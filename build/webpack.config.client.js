// 用绝对路径，避免出现一些错误，如果使用相对路径可能存在系统之间的差异
const path = require('path')
const webpack = require('webpack')
const HTMLPlugin = require('html-webpack-plugin')
const webpackMerge = require('webpack-merge')
const baseConfig = require('./webpack.base')

const isDev = process.env.NODE_ENV === 'development'

const config = webpackMerge(baseConfig, {
  entry: {
    app: path.join(__dirname, '../client/app.js')
  },
  output: {
    filename: '[name].[hash].js', // name对应entry下面的key的名字
    // path: path.join(__dirname, '../dist'),
    // publicPath: '/public/' // 静态资源文件引用时候的一个路径 如果这里是空的 生成的html中的script中src路径就是 app.hash.js，如果指定了'/public'，那src就是：/public/app.hash.js
                  // 可以区分这个url是静态资源，还是api请求
  },
  plugins: [
    new HTMLPlugin({
      template: path.join(__dirname, '../client/template.html')
    })
  ]
})
// console.log(isDev)
// 启动webpack-dev-server 为了去服务于经过webpack编译出来的静态文件的 所以contentBase就是是output中的path
if (isDev) { // webpack-dev-server是会去检测硬盘上面有没有dist目录的，如果有这个目录就会直接去访问这个目录下的js文件的
  // console.log(41, 'dev')
  config.entry = {
    app: [ // 全部打包到同一个文件里面去
      'react-hot-loader/patch', // 客户端热更新代码需要用到的内容
      path.join(__dirname, '../client/app.js')
    ]
  }
  config.devServer = {
    host: '0.0.0.0',
    port: '8888',
    contentBase: path.join(__dirname, '../dist'), // 这个就是说在dist目录下启动了整个服务，这样的话：localhost:8888/filename是可以访问到文件的，
                                                  //  但是由于上面设置了publicPath，所以资源路径变成了localhost:8888/public/filename就访问不到了
    hot: true, // 启动hot-module-replacement
    overlay: { // webpack编译出错后，出现在浏览器上类似eslint错误的蒙层
      errors: true
    },
    publicPath: '/public/', // 这个使得以后访问dist目录下的所有的静态文件，都需要带有/public才能访问
    historyApiFallback: {
      index: '/public/index.html' // 就是dist下面的index，因为上面publicPath映射到了public
    }
  }
  config.plugins.push(new webpack.HotModuleReplacementPlugin())
}

module.exports = config
