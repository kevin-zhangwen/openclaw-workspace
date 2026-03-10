// pages/settings/settings.js - 设置页（家长管理）
const app = getApp()

Page({
  data: {
    childProfile: {
      nickname: '小宝贝',
      avatar: '😊'
    },
    points: 0,
    continuousDays: 0,
    settings: {
      soundEnabled: true,
      passwordSet: false
    },
    tasks: [],
    rewards: [],
    unlockedBadges: 0,
    exchangeCount: 0,
    registerDate: '-',
    usageDays: 0,
    weeklyStats: {
      totalCheckIns: 0,
      perfectDays: 0
    },
    recentBadges: [],
    showProfileDetailModal: false,
    showAvatarPicker: false,
    avatarOptions: ['😊', '😄', '🥳', '🤩', '😎', '🤠', '👧', '👦', '🐶', '🐱', '🐼', '🦁', '🐯', '🐸', '🐵', '🦄']
  },

  onLoad: function () {
    this.loadUserData()
  },

  onShow: function () {
    this.loadUserData()
  },

  // 显示个人信息详情
  showProfileDetail: function () {
    this.loadProfileStats()
    this.setData({ showProfileDetailModal: true })
  },

  // 关闭个人信息详情
  closeProfileDetail: function () {
    this.setData({ showProfileDetailModal: false })
  },

  // 加载个人统计数据
  loadProfileStats: function () {
    const db = wx.cloud.database()
    const openid = app.globalData.openid

    // 加载徽章数量
    db.collection('achievements').where({
      openid: openid
    }).get().then(res => {
      let badges = []
      let unlockedCount = 0
      if (res.data.length > 0) {
        badges = res.data[0].badges || []
        unlockedCount = badges.length
      }
      
      // 获取徽章详情
      const badgeDetails = {
        'first_checkin': { icon: '🌱', name: '第一次打卡' },
        'continuous_3': { icon: '🔥', name: '连续 3 天' },
        'continuous_7': { icon: '⭐', name: '连续 7 天' },
        'continuous_30': { icon: '💎', name: '连续 30 天' },
        'all_daily': { icon: '🎯', name: '完美一天' },
        'first_exchange': { icon: '🛒', name: '首次兑换' },
        'points_500': { icon: '💰', name: '积分达人' }
      }
      
      const recentBadges = badges.slice(-3).reverse().map(b => ({
        ...badgeDetails[b.id],
        id: b.id
      })).filter(b => b.icon)
      
      this.setData({
        unlockedBadges: unlockedCount,
        recentBadges: recentBadges
      })
    }).catch(err => {
      console.error('加载徽章失败:', err)
      this.setData({ unlockedBadges: 0, recentBadges: [] })
    })

    // 加载兑换次数
    db.collection('exchanges').where({
      openid: openid
    }).count().then(res => {
      this.setData({
        exchangeCount: res.total
      })
    }).catch(err => {
      console.error('加载兑换次数失败:', err)
      this.setData({ exchangeCount: 0 })
    })

    // 加载用户详细信息
    db.collection('users').where({
      openid: openid
    }).get().then(res => {
      if (res.data.length > 0) {
        const userData = res.data[0]
        this.setData({
          points: Number(userData.points) || 0,
          continuousDays: userData.continuousDays || 0
        })
        
        // 计算注册时间和使用天数
        if (userData.createdAt) {
          const createDate = new Date(userData.createdAt)
          const now = new Date()
          const usageDays = Math.floor((now - createDate) / (1000 * 60 * 60 * 24))
          
          this.setData({
            registerDate: `${createDate.getFullYear()}-${String(createDate.getMonth() + 1).padStart(2, '0')}-${String(createDate.getDate()).padStart(2, '0')}`,
            usageDays: usageDays > 0 ? usageDays : 1
          })
        } else {
          this.setData({ registerDate: '-', usageDays: 1 })
        }
      }
    }).catch(err => {
      console.error('加载用户信息失败:', err)
    })

    // 加载本周统计
    this.loadWeeklyStats()
  },

  // 加载周统计
  loadWeeklyStats: function () {
    const db = wx.cloud.database()
    const openid = app.globalData.openid
    
    // 计算本周的起始日期
    const now = new Date()
    const dayOfWeek = now.getDay()
    const startOfWeek = new Date(now)
    startOfWeek.setDate(now.getDate() - dayOfWeek)
    startOfWeek.setHours(0, 0, 0, 0)
    
    // 查询本周完成的任务
    db.collection('tasks').where({
      createdBy: openid,
      lastCompletedAt: db.command.gte(startOfWeek)
    }).get().then(res => {
      const tasks = res.data
      const totalCheckIns = tasks.length
      const perfectDays = Math.floor(totalCheckIns / (this.data.tasks.length || 1))
      
      this.setData({
        'weeklyStats.totalCheckIns': totalCheckIns,
        'weeklyStats.perfectDays': perfectDays
      })
    }).catch(err => {
      console.error('加载周统计失败:', err)
      this.setData({
        'weeklyStats.totalCheckIns': 0,
        'weeklyStats.perfectDays': 0
      })
    })
  },

  // 加载用户数据
  loadUserData: function () {
    const db = wx.cloud.database()
    const openid = app.globalData.openid

    if (!openid) {
      wx.showLoading({ title: '加载中...', mask: true })
      wx.cloud.callFunction({
        name: 'login',
        success: res => {
          app.globalData.openid = res.result.openid
          wx.hideLoading()
          this.loadUserData()
        },
        fail: err => {
          wx.hideLoading()
          console.error('获取 openid 失败:', err)
        }
      })
      return
    }

    // 获取用户数据
    db.collection('users').where({
      openid: openid
    }).get().then(res => {
      if (res.data.length > 0) {
        const userData = res.data[0]
        this.setData({
          childProfile: userData.childProfile || this.data.childProfile,
          points: Number(userData.points) || 0,
          continuousDays: userData.continuousDays || 0,
          'settings.soundEnabled': userData.soundEnabled !== false,
          'settings.passwordSet': !!userData.password
        })
      }
      this.loadTasks()
      this.loadRewards()
    }).catch(err => {
      console.error('加载用户数据失败:', err)
    })
  },

  // 加载任务
  loadTasks: function () {
    const db = wx.cloud.database()
    db.collection('tasks').where({
      createdBy: app.globalData.openid
    }).get().then(res => {
      this.setData({ tasks: res.data })
    }).catch(err => {
      console.error('加载任务失败:', err)
      this.setData({ tasks: [] })
    })
  },

  // 加载奖励
  loadRewards: function () {
    const db = wx.cloud.database()
    db.collection('rewards').where({
      createdBy: app.globalData.openid
    }).get().then(res => {
      this.setData({ rewards: res.data })
    }).catch(err => {
      console.error('加载奖励失败:', err)
      this.setData({ rewards: [] })
    })
  },

  // 验证密码
  verifyPassword: function () {
    const db = wx.cloud.database()
    const openid = app.globalData.openid

    // 检查是否被锁定
    if (this.data.lockUntil && Date.now() < this.data.lockUntil) {
      const minutes = Math.ceil((this.data.lockUntil - Date.now()) / 60000)
      this.setData({
        passwordError: `已锁定，请${minutes}分钟后再试`
      })
      return false
    }

    if (!this.data.settings.passwordSet) {
      // 首次设置密码
      return true
    }

    // 验证密码
    db.collection('users').where({
      openid: openid
    }).get().then(res => {
      if (res.data.length > 0) {
        const userData = res.data[0]
        if (userData.password === this.data.passwordValue) {
          this.setData({
            showPasswordInput: false,
            passwordValue: '',
            passwordError: ''
          })
          // 密码正确，可以访问家长设置
        } else {
          // 密码错误
          const errorCount = (userData.passwordErrors || 0) + 1
          
          if (errorCount >= 3) {
            // 锁定 5 分钟
            const lockUntil = Date.now() + 5 * 60 * 1000
            this.setData({
              lockUntil: lockUntil,
              passwordError: '错误次数过多，已锁定 5 分钟'
            })
            db.collection('users').doc(userData._id).update({
              data: {
                passwordErrors: errorCount,
                lockUntil: lockUntil
              }
            })
          } else {
            this.setData({
              passwordError: `密码错误，还剩${3 - errorCount}次机会`
            })
            db.collection('users').doc(userData._id).update({
              data: {
                passwordErrors: errorCount
              }
            })
          }
        }
      }
    })

    return false
  },

  // 打开密码输入
  openPasswordInput: function () {
    this.setData({
      showPasswordInput: true,
      passwordValue: '',
      passwordError: ''
    })
  },

  // 进入家长设置区
  enterParentZone: function () {
    if (this.data._navigating) return
    this.setData({ _navigating: true })
    wx.navigateTo({
      url: '/pages/parent/parent',
      complete: () => {
        setTimeout(() => {
          this.setData({ _navigating: false })
        }, 500)
      }
    })
  },

  // 选择头像（从相册或预设表情）
  chooseAvatarFromAlbum: function () {
    const that = this
    wx.showActionSheet({
      itemList: ['从相册选择', '选择预设头像'],
      success: function (res) {
        if (res.tapIndex === 0) {
          that.chooseImageAvatar()
        } else if (res.tapIndex === 1) {
          that.setData({ showAvatarPicker: true })
        }
      }
    })
  },

  // 从相册选择图片头像
  chooseImageAvatar: function () {
    const that = this
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        const tempFilePath = res.tempFiles[0].tempFilePath
        that.uploadAvatar(tempFilePath)
      }
    })
  },

  // 上传头像到云存储
  uploadAvatar: function (tempFilePath) {
    const that = this
    const openid = app.globalData.openid
    const cloudPath = `avatars/${openid}_${Date.now()}.jpg`

    wx.showLoading({ title: '上传中...', mask: true })

    wx.cloud.uploadFile({
      cloudPath: cloudPath,
      filePath: tempFilePath,
      success: function (res) {
        that.setData({
          'childProfile.avatar': res.fileID,
          'childProfile.avatarType': 'image'
        })
        wx.hideLoading()
        wx.showToast({ title: '头像已更新', icon: 'success' })
      },
      fail: function (err) {
        wx.hideLoading()
        console.error('上传头像失败:', err)
        wx.showToast({ title: '上传失败', icon: 'error' })
      }
    })
  },

  // 选择预设头像
  selectPresetAvatar: function (e) {
    const avatar = e.currentTarget.dataset.avatar
    this.setData({
      'childProfile.avatar': avatar,
      'childProfile.avatarType': 'emoji',
      showAvatarPicker: false
    })
  },

  // 关闭头像选择器
  closeAvatarPicker: function () {
    this.setData({ showAvatarPicker: false })
  },

  // 昵称输入
  onNicknameInput: function (e) {
    this.setData({
      'childProfile.nickname': e.detail.value
    })
  },

  // 保存孩子档案
  updateChildProfile: function () {
    const db = wx.cloud.database()
    const openid = app.globalData.openid
    const childProfile = this.data.childProfile

    if (!childProfile.nickname || childProfile.nickname.trim() === '') {
      wx.showToast({ title: '请输入昵称', icon: 'none' })
      return
    }

    wx.showLoading({ title: '保存中...', mask: true })

    db.collection('users').where({
      openid: openid
    }).get().then(res => {
      if (res.data.length > 0) {
        db.collection('users').doc(res.data[0]._id).update({
          data: {
            childProfile: childProfile
          }
        }).then(() => {
          wx.hideLoading()
          wx.showToast({ title: '保存成功', icon: 'success' })
        }).catch(err => {
          wx.hideLoading()
          console.error('保存档案失败:', err)
          wx.showToast({ title: '保存失败', icon: 'error' })
        })
      } else {
        wx.hideLoading()
        wx.showToast({ title: '用户数据不存在', icon: 'none' })
      }
    }).catch(err => {
      wx.hideLoading()
      console.error('查询用户失败:', err)
      wx.showToast({ title: '保存失败', icon: 'error' })
    })
  }
})
