import React from 'react'
import { StaticRouter } from 'react-router' // staticRouter react-router提供给我们做服务端渲染的时候使用的
import { Provider, useStaticRendering } from 'mobx-react'
import App from './views/App' // 不写./会自动到node_modules目录下面去找
import { createStoreMap } from './store/store'

// 让mobx在服务端渲染的时候不会重复的数据变换 服务端渲染的时候，数据的变化会导致computed的重复调用，会导致内存溢出
useStaticRendering(true)

// 我们要在服务端渲染的时候去生成store，因为服务端渲染会有很多不同的请求进来，不可能将同一个store，在不同的请求中使用它，因为会造成store数据的改来改去
// 所以最好是每次的store都去重新创建一个，所以要去外面传入这个store，就因为会有多个，所以这里用解构的方式传入
export default (stores, routerContext, url) => ( // location 就是本次请求的url
  <Provider {...stores}>
    <StaticRouter context={routerContext} location={url}>
      <App />
    </StaticRouter>
  </Provider>
)

export { createStoreMap }
