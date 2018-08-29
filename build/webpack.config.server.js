const path = require('path')
const webpackMerge = require('webpack-merge')
const baseConfig = require('./webpack.base')

module.exports = webpackMerge(baseConfig, {
  target: 'node', // 打包出来的代码运行的环境
  entry: {
    app: path.join(__dirname, '../client/server.entry.js')
  },
  output: {
    filename: 'server-entry.js',
    libraryTarget: 'commonjs2' // 打包出来的js使用的一种模块的方案
  },
})
