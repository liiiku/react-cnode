import React from 'react'
import { observer, inject } from 'mobx-react'
import PropTypes from 'prop-types'
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

  changeName(event) {
    this.props.appState.changeName(event.target.value)
  }

  render() {
    return (
      <div>
        <input type="text" onChange={this.changeName} /> {/* 调用onChange的时候，这个时候this的指向已经不是组件内部了 */}
        <span>{this.props.appState.msg}</span>
      </div>
    )
  }
}

TopicList.propTypes = {
  appState: PropTypes.instanceOf(AppState),
}
