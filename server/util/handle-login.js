const router = require('express').Router()
const axios = require('axios')

const baseUrl = 'https://cnodejs.org/api/v1'

router.post('/login', function (req, res, next) {
  axios.post(`${baseUrl}/accesstoken`, {
    accesstoken: req.body.accessToken
  })
    .then(resp => {
      if (resp.status === 200 && resp.data.success) {
        req.session.user = {
          accessToken: req.body.accessToken,
          loginName: resp.data.loginname,
          id: resp.data.id,
          avatarUrl: resp.data.avatar_url
        }
        res.json({
          success: true,
          data: resp.data
        })
      }
    })
    .catch(err => {
      if (err.response) { // 请求到cnode api接口是有返回的，只是说是业务逻辑的错误，而不是服务器直接报的错误
        res.json({
          success: false,
          data: err.response.data
        })
      } else {
        next(err) // 抛给全局的错误处理器去处理
      }
    })
})

module.exports = router
