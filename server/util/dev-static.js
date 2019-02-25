/**
 *  在webpack-dev-server的时候template是不写在硬盘上的，没有办法去读取这个文件
 *  用http请求的方式，去webpack-dev-server启动的服务里面去读取这个template
 */
const path = require('path')
const axios = require('axios')
const webpack = require('webpack')
const MemoryFs = require('memory-fs')
const proxy = require('http-proxy-middleware')
const ReactDomServer = require('react-dom/server')

const serverConfig = require('../../build/webpack.config.server')

/**
 * html页面内容已经获取到了，但是其中的js文件怎么获取到呢？也就是server端打包生成的文件内容？
 * 因为server短的bundle需要webpack.config.server.js启动webpack打包之后才能拿到，而且改了client下面的文件，也要实时的更新bundle文件的
 * 所以可以在这里启动webpack，打包后，读取打包后的内容
 */
const getTemplate = () => {
  return new Promise((resolve, reject) => {
    axios.get('http://localhost:8888/public/index.html')
      .then(res => {
        resolve(res.data) // axios返回的内容都会放到data里面
      })
      .catch(reject)
  })
}

const Module = module.constructor // 创建一个新的module

const mfs = new MemoryFs()
// 这个compiler会实时监听serverConfig中entry入口的文件是不是有变化，一旦有变化，会重新去打包
const serverCompiler = webpack(serverConfig)
serverCompiler.outputFileSystem = mfs
let serverBundle
// 监听entry下面依赖的文件，一旦有变化就会重新去打包
serverCompiler.watch({}, (err, stats) => { // stats webpack在打包的过程当中，所输出的一些信息
  if (err) {
    throw err
  }
  stats = stats.toJson()
  stats.errors.forEach(err => {
    console.error(err)
  })
  stats.warnings.forEach(warn => {
    console.warn(warn)
  })

  const bundlePath = path.join(serverConfig.output.path, serverConfig.output.filename)
  const bundle = mfs.readFileSync(bundlePath, 'utf-8') // mfs.readFileSync读出来的是一个string类型
  // 字符串如果转化成模块呢？
  const m = new Module()
  m._compile(bundle, 'server-entry.js') // 动态编译一个文件，第二个参数：指定module的名字，因为require的时候是通过文件名去require他的，同样的动态编译的一个模块，也需要指定一个文件名，否则无法在缓存当中存储这部分内容，并且在内容上也拿不到这个内容
  serverBundle = m.exports.default
  // console.log(47, m.exports.default)
})

module.exports = function (app) {
  app.use('/public', proxy({
    target: 'http://localhost:8888' // 代理到webpack-dev-server的8888接口 发的请求还是3333，但是实际上是去请求的8888端口的接口
  }))

  app.get('*', function (req, res) {
    getTemplate().then(template => {
      const content = ReactDomServer.renderToString(serverBundle)
      res.send(template.replace('<!-- app -->', content))
    })
  })
}
