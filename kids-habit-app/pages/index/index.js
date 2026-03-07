// pages/index/index.js - 首页任务打卡
const app = getApp()

Page({
  data: {
    childProfile: {
      nickname: '小宝贝',
      avatar: '😊'
    },
    points: 0,
    todayCompleted: 0,
    todayTotal: 0,
    continuousDays: 0,
    tasks: [],
    showCelebration: false,
    celebrationType: '',
    celebrationText: '',
    showAllComplete: false,
    showBadgeUnlock: false,
    badgeUnlockData: {
      icon: '',
      name: ''
    }
  },

  onLoad: function () {
    this.loadUserData()
  },

  onShow: function () {
    this.loadUserData()
    // 检查积分达人徽章（防止之前已有 500+ 积分但未解锁）
    if (this.data.points >= 500) {
      this.checkPointsBadge(this.data.points)
    }
  },

  // 加载用户数据
  loadUserData: function () {
    wx.showLoading({ title: '加载中...' })
    
    const db = wx.cloud.database()
    const openid = app.globalData.openid

    if (!openid) {
      // 获取 openid
      wx.cloud.callFunction({
        name: 'login',
        success: res => {
          app.globalData.openid = res.result.openid
          this.loadUserData()
        },
        fail: err => {
          wx.hideLoading()
          wx.showToast({ title: '加载失败', icon: 'none' })
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
          points: userData.points || 0,
          continuousDays: userData.continuousDays || 0
        })
        this.loadTasks()
      } else {
        // 创建新用户
        this.createInitialUser(openid)
      }
    }).catch(err => {
      wx.hideLoading()
      console.error(err)
    })
  },

  // 创建初始用户数据
  createInitialUser: function (openid) {
    const db = wx.cloud.database()
    db.collection('users').add({
      data: {
        openid: openid,
        childProfile: this.data.childProfile,
        points: 100, // 初始积分
        continuousDays: 0,
        lastCheckInDate: null,
        createdAt: db.serverDate()
      }
    }).then(() => {
      this.setData({ points: 100 })
      this.loadTasks()
    })
  },

  // 加载任务
  loadTasks: function () {
    const db = wx.cloud.database()
    const today = new Date().toISOString().split('T')[0]

    db.collection('tasks').where({
      createdBy: app.globalData.openid
    }).get().then(res => {
      let tasks = res.data
      
      // 检查是否是新的一天，需要重置
      const lastResetDate = wx.getStorageSync('lastResetDate')
      if (lastResetDate !== today) {
        // 重置所有任务的今日完成状态
        tasks = tasks.map(task => {
          task.completedToday = false
          return task
        })
        wx.setStorageSync('lastResetDate', today)
        
        // 更新数据库
        const batch = db.batch()
        tasks.forEach(task => {
          batch.update({
            collection: 'tasks',
            doc: task._id,
            data: { completedToday: false }
          })
        })
        batch.commit()
      }

      // 计算今日完成情况
      const completedCount = tasks.filter(t => t.completedToday).length
      this.setData({
        tasks: tasks,
        todayCompleted: completedCount,
        todayTotal: tasks.length
      })

      // 检查是否全部完成
      if (tasks.length > 0 && completedCount === tasks.length) {
        this.setData({ showAllComplete: true })
      }

      wx.hideLoading()
    })
  },

  // 打卡任务
  checkInTask: function (e) {
    const taskId = e.currentTarget.dataset.id
    const taskIndex = e.currentTarget.dataset.index
    const task = this.data.tasks[taskIndex]

    if (task.completedToday) {
      // 取消打卡
      this.cancelCheckIn(taskId, taskIndex, task)
    } else {
      // 确认打卡
      this.confirmCheckIn(taskId, taskIndex, task)
    }
  },

  // 确认打卡
  confirmCheckIn: function (taskId, taskIndex, task) {
    const db = wx.cloud.database()
    const pointsChange = task.type === 'good' ? task.points : -task.points
    const newPoints = this.data.points + pointsChange

    // 更新任务状态
    db.collection('tasks').doc(taskId).update({
      data: {
        completedToday: true,
        lastCompletedAt: db.serverDate()
      }
    }).then(() => {
      // 更新用户积分
      this.updatePoints(pointsChange)

      // 显示庆祝动画
      this.showCelebration(task.type === 'good' ? 'success' : 'warning', 
        task.type === 'good' ? `+${task.points}` : `${task.points}`)

      // 更新本地数据
      const tasks = this.data.tasks
      tasks[taskIndex].completedToday = true
      const newTodayCompleted = this.data.todayCompleted + 1
      this.setData({
        tasks: tasks,
        todayCompleted: newTodayCompleted
      })

      // 检查是否全部完成
      if (newTodayCompleted === this.data.todayTotal) {
        this.setData({ showAllComplete: true })
        // 解锁完美一天徽章
        this.unlockBadge('all_daily')
      }

      // 检查第一次打卡徽章
      this.checkFirstCheckin()

      // 检查积分达人徽章
      this.checkPointsBadge(newPoints)

      // 检查连续打卡
      this.checkContinuousDays()
    })
  },

  // 取消打卡
  cancelCheckIn: function (taskId, taskIndex, task) {
    wx.showModal({
      title: '取消打卡',
      content: '确定要取消这个任务的打卡吗？积分将会退回。',
      success: (res) => {
        if (res.confirm) {
          const db = wx.cloud.database()
          const pointsChange = task.type === 'good' ? -task.points : task.points

          db.collection('tasks').doc(taskId).update({
            data: {
              completedToday: false
            }
          }).then(() => {
            this.updatePoints(pointsChange)
            this.showCelebration('cancel', `-${Math.abs(pointsChange)}`)

            const tasks = this.data.tasks
            tasks[taskIndex].completedToday = false
            this.setData({
              tasks: tasks,
              todayCompleted: this.data.todayCompleted - 1,
              showAllComplete: false
            })
          })
        }
      }
    })
  },

  // 更新积分
  updatePoints: function (change) {
    const db = wx.cloud.database()
    const newPoints = this.data.points + change

    db.collection('users').where({
      openid: app.globalData.openid
    }).get().then(res => {
      if (res.data.length > 0) {
        db.collection('users').doc(res.data[0]._id).update({
          data: {
            points: newPoints
          }
        }).then(() => {
          this.setData({ points: newPoints })
          // 检查积分达人徽章
          this.checkPointsBadge(newPoints)
        })
      }
    })
  },

  // 检查连续打卡天数并解锁徽章
  checkContinuousDays: function () {
    const db = wx.cloud.database()
    const today = new Date().toISOString().split('T')[0]
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]

    db.collection('users').where({
      openid: app.globalData.openid
    }).get().then(res => {
      if (res.data.length > 0) {
        const userData = res.data[0]
        const lastDate = userData.lastCheckInDate

        let newContinuousDays = this.data.continuousDays

        if (lastDate === yesterday || lastDate === today) {
          if (lastDate !== today) {
            newContinuousDays += 1
          }
        } else {
          newContinuousDays = 1
        }

        db.collection('users').doc(userData._id).update({
          data: {
            continuousDays: newContinuousDays,
            lastCheckInDate: today
          }
        }).then(() => {
          this.setData({ continuousDays: newContinuousDays })
          // 检查连续打卡徽章
          this.checkContinuousBadges(newContinuousDays)
        })
      }
    })
  },

  // 检查并解锁连续打卡徽章
  checkContinuousBadges: function (continuousDays) {
    const badges = []
    if (continuousDays >= 3) badges.push('continuous_3')
    if (continuousDays >= 7) badges.push('continuous_7')
    if (continuousDays >= 30) badges.push('continuous_30')
    
    badges.forEach(badgeId => {
      this.unlockBadge(badgeId)
    })
  },

  // 解锁徽章
  unlockBadge: function (badgeId) {
    const db = wx.cloud.database()
    const openid = app.globalData.openid

    db.collection('achievements').where({
      openid: openid
    }).get().then(res => {
      if (res.data.length > 0) {
        const userAchievements = res.data[0]
        const badges = userAchievements.badges || []
        
        // 检查是否已解锁
        const exists = badges.find(b => b.id === badgeId)
        if (!exists) {
          badges.push({
            id: badgeId,
            unlockDate: db.serverDate()
          })
          
          db.collection('achievements').doc(userAchievements._id).update({
            data: { badges }
          }).then(() => {
            // 显示解锁提示
            this.showBadgeUnlock(badgeId)
          })
        }
      } else {
        // 创建新记录
        db.collection('achievements').add({
          data: {
            openid: openid,
            badges: [{
              id: badgeId,
              unlockDate: db.serverDate()
            }]
          }
        }).then(() => {
          this.showBadgeUnlock(badgeId)
        })
      }
    })
  },

  // 显示徽章解锁提示
  showBadgeUnlock: function (badgeId) {
    const badgeData = {
      'first_checkin': { icon: '🌱', name: '第一次打卡' },
      'continuous_3': { icon: '🔥', name: '连续 3 天' },
      'continuous_7': { icon: '⭐', name: '连续 7 天' },
      'continuous_30': { icon: '💎', name: '连续 30 天' },
      'all_daily': { icon: '🎯', name: '完美一天' },
      'first_exchange': { icon: '🛒', name: '首次兑换' },
      'points_500': { icon: '💰', name: '积分达人' }
    }
    
    const data = badgeData[badgeId]
    if (!data) return
    
    this.setData({
      showBadgeUnlock: true,
      badgeUnlockData: data
    })
    
    // 3 秒后自动关闭
    setTimeout(() => {
      this.setData({
        showBadgeUnlock: false
      })
    }, 3000)
  },

  // 检查第一次打卡徽章
  checkFirstCheckin: function () {
    const db = wx.cloud.database()
    const openid = app.globalData.openid

    db.collection('achievements').where({
      openid: openid
    }).get().then(res => {
      if (res.data.length === 0) {
        // 还没有成就记录，解锁第一次打卡徽章
        this.unlockBadge('first_checkin')
      } else {
        const badges = res.data[0].badges || []
        const hasFirstCheckin = badges.find(b => b.id === 'first_checkin')
        if (!hasFirstCheckin) {
          this.unlockBadge('first_checkin')
        }
      }
    })
  },

  // 检查积分达人徽章
  checkPointsBadge: function (points) {
    if (points >= 500) {
      this.unlockBadge('points_500')
    }
  },

  // 显示庆祝动画
  showCelebration: function (type, text) {
    this.setData({
      showCelebration: true,
      celebrationType: type,
      celebrationText: text
    })

    setTimeout(() => {
      this.setData({ showCelebration: false })
    }, 2000)
  },

  // 手动重置今日任务
  resetTodayTasks: function () {
    wx.showModal({
      title: '重置今日任务',
      content: '确定要重置今天的所有任务打卡状态吗？',
      success: (res) => {
        if (res.confirm) {
          this.loadTasks()
          wx.showToast({ title: '已重置', icon: 'success' })
        }
      }
    })
  }
})
