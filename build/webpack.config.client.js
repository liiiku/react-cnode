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
    filename: '[name].[hash].js' // name对应entry下面的key的名字
    // path: path.join(__dirname, '../dist'),
    // publicPath: '/public/' // 静态资源文件引用时候的一个路径 如果这里是空的 生成的html中的script中src路径就是 app.hash.js，如果指定了'/public'，那src就是：/public/app.hash.js
    // 可以区分这个url是静态资源，还是api请求，可以用以区分，还有一个好处就是：如果静态资源要部署到cdn上，只要写cdn的前缀，也就是域名就可以了
  },
  plugins: [
    new HTMLPlugin({ // 服务端渲染的时候，需要用到html，因为要直接返回这个html，所以这里要根据一个tpl.html 直接生成一个用于返回的html
      template: path.join(__dirname, '../client/template.html')
    }),
    new HTMLPlugin({
      template: '!!ejs-compiled-loader!' + path.join(__dirname, '../client/server.template.ejs'),
      filename: 'server.ejs'
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
  // webpack 会去检测硬盘上有没有dist目录，如果有dist目录就会直接去访问这个目录下的文件，所以如果有dist目录，这里要删掉
  config.devServer = {
    host: '0.0.0.0',
    port: '8888',
    // contentBase服务于经过webpack编译后的文件的，所以这里就是对应output中的路径
    contentBase: path.join(__dirname, '../dist'), // 这个就是说在dist目录下启动了整个服务，这样的话：localhost:8888/filename是可以访问到文件的，
    //  但是由于上面设置了publicPath，所以资源路径变成了localhost:8888/public/filename就访问不到了,因为是在dist目录下启动的整个服务，但是dist目录下面，没有public文件夹，整个public是我们为了区别文件自己加的一个标识
    hot: true, // 启动hot-module-replacement 开启了，就要在react中配置，否则会报错
    overlay: { // webpack编译出错后，出现在浏览器上类似eslint错误的蒙层
      errors: true
    },
    publicPath: '/public/', // 这个使得以后访问dist目录下的所有的静态文件，都需要带有/public才能访问 与output对应起来
    historyApiFallback: { // 因为现在的路由都是前端路由，比如访问 /help 后端根本就没有这个路由，那么就直接返回index.html
      index: '/public/index.html' // 就是dist下面的index，因为上面publicPath映射到了public
    },
    proxy: {
      '/api': 'http://localhost:3333'
    }
  }
  config.plugins.push(new webpack.HotModuleReplacementPlugin())
}

module.exports = config
