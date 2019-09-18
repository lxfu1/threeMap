//上帝保佑,永无bug
const path = require('path');
const webpack = require('webpack');
const uglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
const webpackMerge = require('webpack-merge');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const baseConfig = require('./webpack.config.base');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = webpackMerge(baseConfig, {
    output: {
        publicPath: '/views/'
    },
    module: {
        // 配置编译打包规则
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            },
            {
                test: /\.css/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                minimize: true
                            }
                        }
                    ]
                })
            },
            {
                test: /\.scss/,
                exclude: path.resolve(__dirname, './src/static/scss/app.scss'),
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                minimize: true,
                                modules: true,
                                localIdentName: '[local][hash:base64:6]'
                            }
                        },
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
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                minimize: true
                            }
                        },
                        'postcss-loader',
                        'sass-loader',
                        'resolve-url-loader',
                        'sass-loader?sourceMap'
                    ]
                })
            },
            {
                test: /\.(woff|woff2|ttf|svg|eot)(\?t=[\s\S]+)?$/,
                use: ['url-loader?limit=1000&name=[md5:hash:base64:10].[ext]']
            },
            {
                test: /\.(jpg|png|gif|swf)$/,
                use: ['url-loader?limit=1000&name=[md5:hash:base64:10].[ext]&outputPath=img/', 'image-webpack-loader']
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
    plugins: [
        new uglifyJsPlugin({
            compress: {
                warnings: false,
                drop_debugger: true,
                drop_console: true
            }
        }),
        /*
        * For react you can use this plugin for production. It reduces the size of the react lib to ~95kb (yes thats less than the prebuild minimized react.min.js in the bower package).
        * */
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production')
            }
        }),
        new webpack.optimize.CommonsChunkPlugin({
            names: ['vendor'],
            minChunks: Infinity,
            filename: '[name].js'
        }),
        new CopyWebpackPlugin([{ from: path.resolve('src/static/js'), to: 'three' }]),
        new CopyWebpackPlugin([{ from: path.resolve('json'), to: 'json' }]),
        new CopyWebpackPlugin([{ from: path.resolve('src/static/doc'), to: 'doc' }])
    ]
});
