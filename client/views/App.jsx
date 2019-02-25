// 整个页面的主入口
import React from 'react'
import { Link } from 'react-router-dom'
import Routes from '../config/router'

export default class App extends React.Component {
  componentDidMount() {
    // do something here
  }
  render() {
    // 如果我们不想要在最外面包一层没有意义的标签，就可以用这样返回数组的方式
    return [
      <div key="banner">
        <Link to="/">首页</Link>
        <br />
        <Link to="/detail">详情页</Link>
      </div>,
      <Routes key="routes" />,
    ]
  }
}
