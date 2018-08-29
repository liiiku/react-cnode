const express = require('express')
const favicon = require('serve-favicon')
const ReactSSR = require('react-dom/server')
const fs = require('fs')
const path = require('path')

const isDev = process.env.NODE_ENV === 'development'

const app = express()

app.use(favicon(path.join(__dirname, '../favicon.ico'))) // 指定需要返回的图标的地址

if (!isDev) {
  const serverEntry = require('../dist/server-entry').default
  const template = fs.readFileSync(path.join(__dirname, '../dist/index.html'), 'utf8') // 不指定utf8，就是以buffer格式读出来的
  app.use('/public', express.static(path.join(__dirname, '../dist'))) // 这一步的原因是，因为下面的所有请求都返回的是html内容，然如果请求js也返回html内容，这是不对的

  app.get('*', function (req, res) { // 浏览器的任何请求都返回服务端渲染的内容
    const appString = ReactSSR.renderToString(serverEntry)
    res.send(template.replace('<app></app>', appString))
  })
} else {
  const devStatic = require('./util/dev-static')
  devStatic(app)
}

app.listen(3333, function () {
  console.log('server is listening on 3333')
})
