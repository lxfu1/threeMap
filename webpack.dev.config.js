//上帝保佑,永无bug
const path = require('path');
const webpack = require('webpack');
const sourcePath = path.resolve('src');
const openBrowserWebpackPlugin = require('open-browser-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpackMerge = require('webpack-merge');
const baseConfig = require('./webpack.config.base');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const proxyConfig = require('./proxy');
const HappyPack = require('happypack')
const os = require('os')
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length })

module.exports = webpackMerge(baseConfig, {
    devServer: {
        disableHostCheck: false,
        hot: true,
        inline: true,
        historyApiFallback: true,
        port: 12831, // 配置端口号
        host: '0.0.0.0',
        contentBase: './', // 配置文件的根目录
        proxy:{
            '/nasc': {
                target: 'http://42.123.99.87:14600',
                changeOrigin: true
            },
            '/govacademy-server': {
                target: 'http://42.123.99.87:14600',
                changeOrigin: true
            },
            '/govacademy-user': {
                target: 'http://42.123.99.87:14600',
                changeOrigin: true
            }
        }
    },
    module: {
        // 配置编译打包规则
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: ["happypack/loader?id=happyBabel"]
            },
            {
                test: /\.css/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader']
                })
            },
            {
                test: /\.scss/,
                exclude: path.resolve(__dirname, './src/static/scss/app.scss'),
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        'css-loader?modules&localIdentName=[local]_[hash:base64:6]',
                        'postcss-loader',
                        'sass-loader',
                        'resolve-url-loader',
                        'sass-loader?sourceMap'
                    ]
                })
            },
            {
                test: /\.scss/,
                include: path.resolve(__dirname, './src/static/scss/app.scss'),
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'postcss-loader', 'sass-loader', 'resolve-url-loader', 'sass-loader?sourceMap']
                })
            },
            {
                test: /\.(woff|woff2|ttf|svg|eot)(\?t=[\s\S]+)?$/,
                use: ['url-loader?limit=1000&name=files/[md5:hash:base64:10].[ext]']
            },
            {
                test: /\.(jpg|png|gif|swf)$/,
                use: ['url-loader?limit=1000&name=files/[md5:hash:base64:10].[ext]&outputPath=img/']
            },
            {
                test: /\.json$/,
                use: ['json-loader']
            },
            {
                test: /\.pdf$/,
                use: ['file-loader']
            }
        ]
    },
    devtool: 'source-map',
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            names: ['vendor'],
            minChunks: Infinity,
            filename: 'js/[name].js'
        }),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('development')
            }
        }),
        new webpack.HotModuleReplacementPlugin(),
        new HappyPack({
            id: 'happyBabel',
            loaders: ['babel-loader?cacheDirectory=true'],
            threadPool: happyThreadPool
        }),
        new CopyWebpackPlugin([{ from: path.resolve('src/static/js'), to: 'three' }]),
        new CopyWebpackPlugin([{ from: path.resolve('src/static/doc'), to: 'doc' }]),
        new openBrowserWebpackPlugin({ url: "http://localhost:12831" })
    ]
});
