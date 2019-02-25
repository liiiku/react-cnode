/**
 * 把所有发现cnode的接口全部代理
 */
const axios = require('axios')
const querystring = require('query-string')

const baseUrl = 'https://cnodejs.org/api/v1'

module.exports = function (req, res, next) {
  const path = req.path
  const user = req.session.user || {}
  const needAccessToken = req.query.needAccessToken // 判断我们需不需要accessToken呢？接口请求的时候加一个参数 放在url的query上面 也就是？后面

  // 如果需要token，但是又没有带token
  if (needAccessToken && !user.accessToken) {
    res.status(401).send({
      success: false,
      msg: '您需要登陆'
    })
  }

  // 如果是get请求，我们不能直接把query传过去，因为query上有我们自己加的参数，比如needAccessToken
  const query = Object.assign({}, req.query, {
    accesstoken: (needAccessToken && req.method === 'GET') ? user.accessToken : ''
  })
  if (query.needAccessToken) delete query.needAccessToken

  axios(`${baseUrl}${path}`, {
    method: req.method,
    params: query,
    // 没转化: {'accesstoken': 'xxx'} 转化后： 'accesstoken=xxx' 这才和formData生成的数据格式一样
    data: querystring.stringify(Object.assign({}, req.body, {
      accesstoken: (needAccessToken && req.method === 'POST') ? user.accessToken : ''
    })),
    headers: { // 直接使用axios发送请求的时候，content-type是application/json的，cnode api有一些可以接受，有一些无法接受，只能用formData来传
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }).then(resp => {
    if (resp.status === 200) {
      res.send(resp.data)
    } else {
      res.status(resp.status).send(resp.data)
    }
  }).catch(err => {
    if (err.response) {
      res.status(500).send(err.response.data)
    } else {
      res.status(500).send({
        success: false,
        msg: '未知错误！'
      })
    }
  })
}
