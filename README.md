# react-cnode
react全家桶+mbox开发cnode社区网站

因为有些接口需要登陆之后才能调用，cnodejs的接口，需要一个accesstoken的东西，我们发送的请求，如果有accesstoken，代表有权限去请求接口
但是这个accesstoken肯定不能存在浏览器端，因为这个是需要保密的，肯定是获取到accesstoken之后，存在nodejs这一端的session里面，接下去所有的请求
在服务端去检测有没有accesstoken这个东西，没有就要告诉浏览器端，要先登录再去发送这个请求

为了完成这个，需要安装 body-parser express-session query-string

```
// 解析 application/json
app.use(bodyParser.json());
// 解析 application/x-www-form-urlencoded
app.use(bodyParser.urlencoded());

这样就可以在项目的application级别，引入了body-parser模块处理请求体。在上述代码中，模块会处理application/x-www-form-urlencoded、application/json两种格式的请求体。经过这个中间件后，就可以在所有路由处理器的req.body中访问请求参数
```

