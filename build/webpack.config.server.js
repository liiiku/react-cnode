const path = require('path')
const webpackMerge = require('webpack-merge')
const baseConfig = require('./webpack.base')

module.exports = webpackMerge(baseConfig, {
  target: 'node', // 打包出来的代码运行的环境，这样设置后，打包后的生成文件是用module.exports包裹的，客户端打包后的文件不是，是自执行函数包裹的
  entry: {
    app: path.join(__dirname, '../client/server.entry.js')
  },
  externals: Object.keys(require('../package-lock.json').dependencies),
  output: {
    filename: 'server-entry.js', // 服务端没有浏览器缓存这个概念，所以直接写死就好
    libraryTarget: 'commonjs2' // 打包出来的js使用的一种模块的方案
  }
})
