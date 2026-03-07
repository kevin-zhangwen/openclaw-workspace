// pages/mall/mall.js - 商城兑换页
const app = getApp()

Page({
  data: {
    points: 0,
    rewards: [
      {
        id: '1',
        name: '小贴纸',
        icon: '🎨',
        points: 50,
        description: '精美卡通贴纸一张'
      },
      {
        id: '2',
        name: '看动画片 30 分钟',
        icon: '📺',
        points: 100,
        description: '观看喜爱的动画片'
      },
      {
        id: '3',
        name: '小零食',
        icon: '🍬',
        points: 80,
        description: '选择喜欢的小零食'
      },
      {
        id: '4',
        name: '去公园玩',
        icon: '🎡',
        points: 150,
        description: '周末去公园游玩'
      },
      {
        id: '5',
        name: '新玩具',
        icon: '🧸',
        points: 300,
        description: '挑选一个小玩具'
      },
      {
        id: '6',
        name: '冰淇淋',
        icon: '🍦',
        points: 60,
        description: '美味冰淇淋一个'
      },
      {
        id: '7',
        name: '讲故事时间',
        icon: '📚',
        points: 40,
        description: '爸爸妈妈讲故事'
      },
      {
        id: '8',
        name: '小礼物',
        icon: '🎁',
        points: 200,
        description: '神秘小礼物一份'
      }
    ],
    exchangeHistory: [],
    selectedReward: null,
    showConfirmDialog: false,
    showSuccessAnimation: false
  },

  onLoad: function () {
    this.loadUserData()
    this.loadExchangeHistory()
  },

  onShow: function () {
    this.loadUserData()
  },

  // 加载用户数据
  loadUserData: function () {
    const db = wx.cloud.database()
    const openid = app.globalData.openid

    if (!openid) {
      wx.cloud.callFunction({
        name: 'login',
        success: res => {
          app.globalData.openid = res.result.openid
          this.loadUserData()
        }
      })
      return
    }

    db.collection('users').where({
      openid: openid
    }).get().then(res => {
      if (res.data.length > 0) {
        this.setData({
          points: res.data[0].points || 0
        })
      }
    })
  },

  // 加载兑换历史
  loadExchangeHistory: function () {
    const db = wx.cloud.database()
    const openid = app.globalData.openid

    db.collection('exchanges').where({
      openid: openid
    }).orderBy('createdAt', 'desc').limit(10).get().then(res => {
      this.setData({
        exchangeHistory: res.data
      })
    })
  },

  // 选择奖励
  selectReward: function (e) {
    const index = e.currentTarget.dataset.index
    const reward = this.data.rewards[index]

    if (this.data.points >= reward.points) {
      this.setData({
        selectedReward: reward,
        showConfirmDialog: true
      })
    } else {
      wx.showToast({
        title: `还差${reward.points - this.data.points}分`,
        icon: 'none'
      })
    }
  },

  // 确认兑换
  confirmExchange: function () {
    const reward = this.data.selectedReward
    const db = wx.cloud.database()
    const openid = app.globalData.openid
    const newPoints = this.data.points - reward.points

    // 扣除积分
    db.collection('users').where({
      openid: openid
    }).get().then(res => {
      if (res.data.length > 0) {
        db.collection('users').doc(res.data[0]._id).update({
          data: {
            points: newPoints
          }
        }).then(() => {
          // 记录兑换历史
          db.collection('exchanges').add({
            data: {
              openid: openid,
              rewardId: reward.id,
              rewardName: reward.name,
              rewardIcon: reward.icon,
              points: reward.points,
              createdAt: db.serverDate()
            }
          }).then(() => {
            // 更新本地数据
            this.setData({
              points: newPoints,
              showConfirmDialog: false,
              selectedReward: null,
              showSuccessAnimation: true
            })

            // 解锁"首次兑换"徽章
            this.unlockFirstExchangeBadge()

            // 显示成功动画
            setTimeout(() => {
              this.setData({ showSuccessAnimation: false })
              this.loadExchangeHistory()
            }, 2000)
          })
        })
      }
    })
  },

  // 取消兑换
  cancelExchange: function () {
    this.setData({
      showConfirmDialog: false,
      selectedReward: null
    })
  },

  // 解锁首次兑换徽章
  unlockFirstExchangeBadge: function () {
    const db = wx.cloud.database()
    const openid = app.globalData.openid

    db.collection('achievements').where({
      openid: openid
    }).get().then(res => {
      if (res.data.length > 0) {
        const userAchievements = res.data[0]
        const badges = userAchievements.badges || []
        const exists = badges.find(b => b.id === 'first_exchange')
        
        if (!exists) {
          badges.push({
            id: 'first_exchange',
            unlockDate: db.serverDate()
          })
          db.collection('achievements').doc(userAchievements._id).update({
            data: { badges }
          })
        }
      } else {
        db.collection('achievements').add({
          data: {
            openid: openid,
            badges: [{
              id: 'first_exchange',
              unlockDate: db.serverDate()
            }]
          }
        })
      }
    })
  }
})
