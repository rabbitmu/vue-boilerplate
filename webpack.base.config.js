const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const TransferWebpackPlugin = require('transfer-webpack-plugin')
const HappyPack = require('happypack')

// 路径
const ROOT_PATH = path.join(__dirname, './')
const TEMPLATE_PATH = path.join(__dirname, './', 'template')

// 插件列表
const plugins = [
    // 创建全局变量
    new webpack.ProvidePlugin({
        'Vue': [ 'vue/dist/vue.runtime.esm.js', 'default' ]
    }),
    // happypack打包
    new HappyPack({
        threads: 4,
        loaders: ['babel-loader']
    }),
    // code-spliting
    new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        minChunks: module => {
            return module.context && /node\_modules/.test(module.context)
        }
    }),
    new webpack.optimize.CommonsChunkPlugin({
        name: 'manifest',
    }),
    // 分离CSS文件
    new ExtractTextPlugin({
        filename: '[name].bundle.css',
        disable: false,
        allChunks: true
    }),
    // 生成html文件
    new HtmlWebpackPlugin({
        inject: true,
        hash: true,
        filename: 'app.html',
        template: TEMPLATE_PATH + '/app.html',
        chunks: ['vendor', 'manifest', 'app']
    })
]

module.exports = {
    resolve: {
        extensions: ['.js'],
        alias: {
            'constants': path.join(ROOT_PATH, './', 'constants'),
            'components': path.join(ROOT_PATH, './src/', 'components')
        }
    },
    module: {
        rules: [
            {
                // use babel-loader for *.js files
                // use happypack for improve compile performance
                test: /\.js$/,
                loader: 'happypack/loader',
                // important: exclude files in node_modules
                // otherwise it's going to be really slow!
                exclude: /node_modules/
            },
            {
                // use sass-loader for *.scss files
                test: /\.scss/i,
                use: ExtractTextPlugin.extract({
                    use: [
                        'css-loader',
                        'postcss-loader',
                        'sass-loader'
                    ]
                })
            },
            {
                // load image file
                test: /\.(jpe?g|png|gif|svg)$/i,
                loader: 'file-loader',
                options: {
                    hash: 'sha512',
                    digest: 'hex',
                    limit: '10000',
                    name: '[hash].[ext]'
                }
            }
        ]
    },
    plugins: plugins
}
