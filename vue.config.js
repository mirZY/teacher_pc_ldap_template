'use strict';
const path = require('path');


function resolve(dir) {
    return path.join(__dirname, dir);
}

module.exports = {
    publicPath: '/',
    outputDir: 'dist',
    assetsDir: 'static',
    lintOnSave: false,
    productionSourceMap: false,
    devServer: {
        port: process.env.port || process.env.npm_config_port || 9000,
        open: true,
        overlay: {
            warnings: false,
            errors: true
        }
    },
    chainWebpack: config => {
        if (process.env.npm_config_report) {
            config.plugin('webpack-bundle-analyzer').use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin);
        }
       
    },
    configureWebpack: {
        name: '教师系统',
        resolve: {
            alias: {
                '@': resolve('src'),
                '@UI': resolve('src/components'),
                '@tools': resolve('src/utils/tools.js'),
                '@api': resolve('src/api/index.js'),
            }
        },
        performance: {
            maxEntrypointSize: 500000, //入口文件最大bytes（500k）
            maxAssetSize: 500000 //任何单文件最大bytes（500k）
        },
    }
};
