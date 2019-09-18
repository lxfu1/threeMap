const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const sourcePath = path.resolve('src');

module.exports = {
    //设置人口文件的绝对路径
    entry: {
        bundle: ['babel-polyfill', path.resolve('src/index.jsx')],
        vendor: ['react', 'react-dom', 'echarts']
    },
    output: {
        path: path.resolve('./views'),
        filename: '[name].[hash:8].js'
    },
    resolve: {
        extensions: ['.js', '.jsx', '.scss'],
        alias: {
            resource: path.resolve('./src/util/resource.js'),
            'static': path.resolve('./src/static'),
            utils: path.resolve('./src/util/utils.js'),
            service: path.resolve('./src/service'),
            components: path.resolve('./src/components'),
            constants: path.resolve('./src/constants'),
            api: path.resolve('./src/api/index.js'),
            enums: path.resolve('./src/store'),
            store: path.resolve('./src/store')
        },
        modules: [sourcePath, 'node_modules']
    },
    plugins: [
        new HtmlWebpackPlugin({
            // title: '贵州省煤矿产业云平',// 标题
            favicon: path.resolve('./src/static/images/favicon.png'),
            template: './src/index.html', // 模板文件
            filename: './index.html' // 产出后的文件名称
        }),
        new ExtractTextPlugin('bundle.[hash:8].css')
    ]
};
