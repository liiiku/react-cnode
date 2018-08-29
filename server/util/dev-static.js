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

const getTemplate = () => {
  return new Promise((resolve, reject) => {
    axios.get('http://localhost:8888/public/index.html')
      .then(res => {
        resolve(res.data) // axios返回的内容都会放到data里面
      })
      .catch(reject)
  })
}

const Module = module.constructor

const mfs = new MemoryFs
const serverCompiler = webpack(serverConfig)
serverCompiler.outputFileSystem = mfs
let serverBundle
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
  const bundle = mfs.readFileSync(bundlePath, 'utf-8')
  const m = new Module()
  m._compile(bundle, 'server-entry.js') // 第二个参数：指定module的名字，因为require的时候是通过文件名去require他的，同样的动态编译的一个模块，也需要指定一个文件名，否则无法在缓存当中存储这部分内容，并且在内容上也拿不到这个内容
  serverBundle = m.exports.default
  // console.log(47, m.exports)
})

module.exports = function (app) {
  app.use('/public', proxy({
    target: 'http://localhost:8888'
  }))

  app.get('*', function (req, res) {
    getTemplate().then(template => {
      const content = ReactDomServer.renderToString(serverBundle)
      res.send(template.replace('<app></app>', content))
    })
  })
}
