// pages/achievement/achievement.js - 成就徽章页
const app = getApp()

Page({
  data: {
    badges: [
      {
        id: 'first_checkin',
        name: '第一次打卡',
        icon: '🌱',
        description: '完成第一次任务打卡',
        condition: '完成 1 次打卡',
        unlocked: false,
        unlockDate: null
      },
      {
        id: 'continuous_3',
        name: '坚持 3 天',
        icon: '🔥',
        description: '连续打卡 3 天',
        condition: '连续打卡 3 天',
        unlocked: false,
        unlockDate: null
      },
      {
        id: 'continuous_7',
        name: '坚持 7 天',
        icon: '⭐',
        description: '连续打卡 7 天',
        condition: '连续打卡 7 天',
        unlocked: false,
        unlockDate: null
      },
      {
        id: 'continuous_30',
        name: '坚持 30 天',
        icon: '💎',
        description: '连续打卡 30 天',
        condition: '连续打卡 30 天',
        unlocked: false,
        unlockDate: null
      },
      {
        id: 'all_daily',
        name: '完美一天',
        icon: '🎯',
        description: '单日完成所有任务',
        condition: '一天内完成所有任务',
        unlocked: false,
        unlockDate: null
      },
      {
        id: 'first_exchange',
        name: '首次兑换',
        icon: '🛒',
        description: '第一次兑换奖励',
        condition: '兑换 1 次奖励',
        unlocked: false,
        unlockDate: null
      },
      {
        id: 'points_500',
        name: '积分达人',
        icon: '💰',
        description: '累计获得 500 积分',
        condition: '累计获得 500 积分',
        unlocked: false,
        unlockDate: null
      }
    ],
    selectedBadge: null,
    showBadgeDetail: false
  },

  onLoad: function () {
    this.loadBadges()
  },

  onShow: function () {
    this.loadBadges()
  },

  // 加载徽章数据
  loadBadges: function () {
    wx.showLoading({ title: '加载中...' })

    const db = wx.cloud.database()
    const openid = app.globalData.openid

    if (!openid) {
      wx.cloud.callFunction({
        name: 'login',
        success: res => {
          app.globalData.openid = res.result.openid
          this.loadBadges()
        }
      })
      return
    }

    // 获取用户成就数据
    db.collection('achievements').where({
      openid: openid
    }).get().then(res => {
      let userBadges = []
      if (res.data.length > 0) {
        userBadges = res.data[0].badges || []
      }

      // 更新徽章状态
      const badges = this.data.badges.map(badge => {
        const userBadge = userBadges.find(b => b.id === badge.id)
        if (userBadge) {
          return {
            ...badge,
            unlocked: true,
            unlockDate: userBadge.unlockDate
          }
        }
        return badge
      })

      this.setData({ badges })
      wx.hideLoading()
    }).catch(err => {
      wx.hideLoading()
      console.error(err)
    })
  },

  // 查看徽章详情
  viewBadgeDetail: function (e) {
    const index = e.currentTarget.dataset.index
    const badge = this.data.badges[index]

    this.setData({
      selectedBadge: badge,
      showBadgeDetail: true
    })
  },

  // 关闭详情
  closeBadgeDetail: function () {
    this.setData({
      selectedBadge: null,
      showBadgeDetail: false
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
        // 更新已有记录
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
        })
      }
    })
  }
})
