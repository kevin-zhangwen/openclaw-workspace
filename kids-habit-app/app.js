// app.js - 小程序入口文件
App({
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: 'cloud1-4gfs7yt17ef38042',
        traceUser: true,
      })
    }

    this.globalData = {}
  },

  globalData: {
    userInfo: null,
    openid: null,
    childProfile: null,
    settings: {
      soundEnabled: true,
      password: null
    }
  }
})
