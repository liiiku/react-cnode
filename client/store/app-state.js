// 和业务逻辑没有太大的关系，控制应用展示的时候纯前端交互逻辑的
import { observable, computed, action } from 'mobx'

export default class AppState {
  constructor({ count, name } = { count: 0, name: 'lrn' }) {
    this.count = count
    this.name = name
  }
  @observable count
  @observable name
  @computed get msg() {
    return `${this.name} say count is ${this.count}`
  }
  @action add() {
    this.count += 1
  }
  @action changeName(name) {
    this.name = name
  }
  toJson() { // 服务端渲染的时候会用到，因为此时服务端拿到的数据和客户端展示的数据是不一样的
    return {
      count: this.count,
      name: this.name,
    }
  }
}

// const appState = new AppState()

// 一旦AppState相关数据有更新，就会自动执行
// autorun(() => {
//   console.log(appState.msg)
// })

// export default appState
