// 和业务逻辑没有太大的关系，控制应用展示的时候纯前端交互逻辑的
import { observable, computed, autorun, action } from 'mobx'

export class AppState {
  @observable count = 0
  @observable name = 'lrn'
  @computed get msg() {
    return `${this.name} say count is ${this.count}`
  }
  @action add() {
    this.count += 1
  }
  @action changeName(name) {
    this.name = name
  }
}

const appState = new AppState()

// 一旦AppState相关数据有更新，就会自动执行
autorun(() => {
  console.log(appState.msg)
})

setInterval(() => {
  appState.add()
}, 1000)

export default appState
