'use strict'
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')

module.exports = {
  dev: {
    env: require('./dev.env'),
    port: 8080,
    // localhost
    // host: '106.14.114.152:9005',
    host: '127.0.0.1',
    autoOpenBrowser: true,
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
      /*++++++++正式环境++++++*/
      '/admin/*/*': {
        // target: 'http://118.31.11.107:8081',
        // target: 'http://106.14.114.152:9005',
        target: 'http://106.14.114.152:9005',
        secure: false,
        changeOrigin: true
       },
      '/admin/*': {
        // target: 'http://106.14.114.152:9006', //头像列表链接
        target: 'http://106.14.114.152:9005', //开发环境
        secure: false,
        changeOrigin: true
       },
      /*++++++++测试环境++++++*/
      // '/admin/*': {
      //   target: 'http://10.5.202.175:9005',
      //   secure: false,
      //   changeOrigin: true
      // },
      // '/admin/*/*': {
      //   target: 'http://10.5.202.175:9005',
      //   secure: false,
      //   changeOrigin: true
      // },
      // '/cc/*/*': {
      //   target: 'https://tcc.taobao.com',
      //   secure: false,
      //   changeOrigin: true
      // },
      /*+++++++185环境++++++*/
      // '/admin/*': {
      //   target: 'http://116.62.189.185:9005',
      //   secure: false,
      //   changeOrigin: true
      // }
    },
    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false
  },

  build: {
    prodEnv: require('./prod.env'),
    testEnv: require('./test.env'),
    onlineEnv: require('./online.env'),
    // Template for index.html
    index: path.resolve(__dirname, '../dist/index.html'),
    indexh5: path.resolve(__dirname, '../dist/indexh5.html'),

    // Paths
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',

    /**
     * Source Maps
     */

    productionSourceMap: false,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  }
}
