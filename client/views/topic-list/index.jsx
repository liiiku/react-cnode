import React from 'react'
import { observer, inject } from 'mobx-react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import { AppState } from '../../store/app-state'

// 定义在provider上叫什么名字，这里injecg就叫什么名字
@inject('appState') @observer
export default class TopicList extends React.Component {
  constructor() {
    super()

    this.changeName = this.changeName.bind(this)
  }

  componentDidMount() {
    // do something here
  }

  // 在dev-static中调用asyncBootstrapper方法的时候，会执行这个组件里面的这个方法，等他执行完成之后，才会继续的渲染的工作
  // 所以就可以再这里面去执行数据的初始化
  asyncBootstrap() {
    console.log(22)
    return new Promise((resolve) => {
      setTimeout(() => {
        this.props.appState.count = 3
        resolve(true) // 这里要resolve(true) 会根据true 或者false来判断方法有没有执行成功
      })
    })
  }

  changeName(event) {
    this.props.appState.changeName(event.target.value)
  }

  render() {
    return (
      <div>
        <Helmet>
          <title>topic list</title>
          <meta name="description" content="this is description" />
        </Helmet>
        <input type="text" onChange={this.changeName} /> {/* 调用onChange的时候，这个时候this的指向已经不是组件内部了 */}
        <span>{this.props.appState.msg}</span>
      </div>
    )
  }
}

TopicList.propTypes = {
  appState: PropTypes.instanceOf(AppState),
}
