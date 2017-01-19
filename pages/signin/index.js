var ywk = require('../../utils/ywk')
var app = getApp()
Page({
  data: {
    username: '',
    password: '',
    hide: true,
    redirect: '',
    alertData: {msg: '', showClass: 'alert-show'},
    disabled: false
  },
  signin (e) {
    if (this.data.username && this.data.password) {
      wx.showToast({
        title: '登录中',
        icon: 'loading',
        duration: 10000
      })
      ywk.ajaxJson('/api/user/signin', this.data, 'POST').then((res) => {
        if (res.error_code === 0) {
          wx.setStorageSync('session_token', res.session_token || '')
          this.getRole()
        } else {
          this.setData({
            alertData: {msg: res.msg, cls: 'alert-show'}
          })

          setTimeout(() => {
            this.setData({
              alertData: {msg: '', cls: ''}
            })
          }, 2000)
          wx.hideToast()
        }
      }, (err) => {
        wx.hideToast()
      })
      app.getSystemInfo()
    }
  },
  getRole () {
    ywk.ajaxJson('/api/v1.1/user/role', {}, 'GET').then((res) => {
      if (res.error_code === 0) {
        let role = 'f'
        if (res.current_id === res.roles.client.id) {
          role = 'c'
        } else if(res.current_id === res.roles.freelancer.id) {
          role = 'f'
        }
        wx.setStorageSync('role', role)
        wx.setStorageSync('roles', res.roles)
        let url = this.data.redirect ? this.data.redirect : '../profile/index'
        wx.navigateTo({
          url: url
        })
      }
    }, (err) => {
      wx.hideToast()
      console.log(err)
    })
  },
  getUsername (e) {
    this.setData({
      username: e.detail.value
    })
  },
  getPassword (e) {
    this.setData({
      password: e.detail.value
    })
  },
  change () {
    let newValue = !this.data.hide
    this.setData({
      hide: newValue
    })
  },
  onLoad (opt) {
    if (opt && opt.redirect) {
      this.setData({
        redirect: decodeURIComponent(opt.redirect)
      })
    }
  }
})
