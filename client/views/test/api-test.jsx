import React from 'react'
import axios from 'axios'

/* eslint-disable */
export default class TestApi extends React.Component {
  getTopics() {
    axios.get('/api/topics')
      .then(resp => {
        console.log(resp)
      }).catch(err => {
        console.log(err)
      })
  }
  login() {
    axios.post('/api/user/login', {
      accessToken: '2e427212-8db8-4a59-864c-283cad66f52b',
    })
      .then(resp => {
        console.log(resp)
      })
  }
  markAll() {
    axios.post('/api/message/mark_all?needAccessToken=true')
      .then(resp => {
        console.log(resp)
      })
  }
  render() {
    return (
      <div>
        <button onClick={this.getTopics}>topics</button>
        <button onClick={this.login}>login</button>
        <button onClick={this.markAll}>markAll</button>
      </div>
    )
  }
}

/* eslint-enable */
