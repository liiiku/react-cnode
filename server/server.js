const express = require('express')
const favicon = require('serve-favicon')
const ReactSSR = require('react-dom/server')
const fs = require('fs')
const path = require('path')
const bodyParser = require('body-parser')
const session = require('express-session')

const isDev = process.env.NODE_ENV === 'development'

const app = express()

// 都转化到req.body这样的数据
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use(session({
  cookie: {
    maxAge: 10 * 60 * 1000
  },
  name: 'tid', // session会放一个cookieID到浏览器端，这个就是cookieId的名字
  resave: false, // 是否每次请求都要生成一个cookieID
  saveUninitialized: false,
  secret: 'react cnode class' // 是用这个字符串去加密cookie，保证cookie在浏览器端是没法去解密的
}))

app.use(favicon(path.join(__dirname, '../favicon.ico'))) // 指定需要返回的图标的地址

app.use('/api/user', require('./util/handle-login'))
app.use('/api', require('./util/proxy'))

if (!isDev) {
  // require('../dist/server-entry') 打印的效果见Reacme.md
  console.log(require('../dist/server-entry'))
  const serverEntry = require('../dist/server-entry').default
  const template = fs.readFileSync(path.join(__dirname, '../dist/index.html'), 'utf8') // 不指定utf8，就是以buffer格式读出来的

  // 这一步的原因是，因为下面的所有请求都返回的是html内容，然如果请求js也返回html内容，这是不对的，这里就可以根据文件目录来区分资源了，对应output中的publicPath
  // 这样就可以区分，什么路径返回服务端渲染的代码，什么地方返回资源文件
  app.use('/public', express.static(path.join(__dirname, '../dist')))
  app.get('*', function (req, res) { // 浏览器的任何请求都返回服务端渲染的内容
    const appString = ReactSSR.renderToString(serverEntry)
    // 这样做的目的是为了把内容插入到html中，而不是仅仅返回一个dom节点
    res.send(template.replace('<!-- app -->', appString))
  })
} else {
  const devStatic = require('./util/dev-static')
  devStatic(app)
}

app.listen(3333, function () {
  console.log('server is listening on 3333')
})
