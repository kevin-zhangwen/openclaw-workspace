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
    showBadgeDetail: false,
    renderFlag: 0  // 用于强制触发视图更新
  },

  onLoad: function () {
    // 只在 onShow 中加载数据
  },

  onShow: function () {
    // 每次显示页面时都重新加载数据，确保显示最新的徽章状态
    this.loadBadges()
  },

  // 加载徽章数据
  loadBadges: function () {
    wx.showLoading({ title: '加载中...' })

    const db = wx.cloud.database()
    let openid = app.globalData.openid

    if (!openid) {
      wx.cloud.callFunction({
        name: 'login',
        success: res => {
          app.globalData.openid = res.result.openid
          this.loadBadges()
        },
        fail: err => {
          console.error('登录失败:', err)
          wx.hideLoading()
        }
      })
      return
    }

    console.log('=== 成就页面加载数据 ===')
    console.log('当前 openid:', openid)

    // 获取用户成就数据
    db.collection('achievements').where({
      openid: openid
    }).get().then(res => {
      console.log('查询结果:', JSON.stringify(res.data))
      console.log('查询结果数量:', res.data.length)

      let userBadges = []
      console.log('查询结果记录数:', res.data.length)
      if (res.data.length > 0) {
        // 合并所有记录的徽章（可能有多个记录）
        res.data.forEach((record, recordIdx) => {
          console.log(`记录 ${recordIdx} ID:`, record._id)
          console.log(`记录 ${recordIdx} openid:`, record.openid)
          console.log(`记录 ${recordIdx} 中的 badges 字段:`, JSON.stringify(record.badges))
          console.log(`记录 ${recordIdx} badges 类型:`, typeof record.badges, Array.isArray(record.badges))

          if (record.badges && Array.isArray(record.badges)) {
            record.badges.forEach((b, idx) => {
              console.log(`记录 ${recordIdx} 徽章 ${idx}:`, JSON.stringify(b), 'id:', b ? b.id : 'null', 'id类型:', b ? typeof b.id : 'null')
            })
            // 过滤掉无效的徽章数据
            const validBadges = record.badges.filter(b => b && b.id)
            userBadges = userBadges.concat(validBadges)
          } else {
            console.log(`记录 ${recordIdx} 没有 badges 数组或 badges 不是数组`)
          }
        })
      } else {
        console.log('没有查询到任何成就记录')
      }

      console.log('合并后的用户徽章数组:', JSON.stringify(userBadges))
      console.log('用户徽章 ID 列表:', userBadges.map(b => b ? b.id : 'null'))

      // 创建全新的徽章数组
      const baseBadges = [
        { id: 'first_checkin', name: '第一次打卡', icon: '🌱', description: '完成第一次任务打卡', condition: '完成 1 次打卡', unlocked: false, unlockDate: null },
        { id: 'continuous_3', name: '坚持 3 天', icon: '🔥', description: '连续打卡 3 天', condition: '连续打卡 3 天', unlocked: false, unlockDate: null },
        { id: 'continuous_7', name: '坚持 7 天', icon: '⭐', description: '连续打卡 7 天', condition: '连续打卡 7 天', unlocked: false, unlockDate: null },
        { id: 'continuous_30', name: '坚持 30 天', icon: '💎', description: '连续打卡 30 天', condition: '连续打卡 30 天', unlocked: false, unlockDate: null },
        { id: 'all_daily', name: '完美一天', icon: '🎯', description: '单日完成所有任务', condition: '一天内完成所有任务', unlocked: false, unlockDate: null },
        { id: 'first_exchange', name: '首次兑换', icon: '🛒', description: '第一次兑换奖励', condition: '兑换 1 次奖励', unlocked: false, unlockDate: null },
        { id: 'points_500', name: '积分达人', icon: '💰', description: '累计获得 500 积分', condition: '累计获得 500 积分', unlocked: false, unlockDate: null }
      ]

      // 更新徽章状态
      const updatedBadges = baseBadges.map(badge => {
        // 使用宽松比较，因为 id 可能存储为不同类型
        const userBadge = userBadges.find(b => {
          if (!b || !b.id) return false
          const bId = String(b.id)
          const badgeId = String(badge.id)
          return bId === badgeId
        })
        const isUnlocked = !!userBadge // 强制转换为布尔值
        console.log(`检查徽章 ${badge.id}:`, isUnlocked ? '✅ 已解锁' : '❌ 未解锁', '找到的记录:', userBadge ? JSON.stringify(userBadge) : 'null')
        return {
          id: badge.id,
          name: badge.name,
          icon: badge.icon,
          description: badge.description,
          condition: badge.condition,
          unlocked: isUnlocked,
          unlockDate: userBadge ? userBadge.unlockDate : null
        }
      })

      console.log('最终徽章状态:', updatedBadges.filter(b => b.unlocked).map(b => b.id))
      console.log('完整徽章数据:', JSON.stringify(updatedBadges.map(b => ({ id: b.id, unlocked: b.unlocked }))))

      // 排序：已解锁的排在前面，未解锁的排在后面
      updatedBadges.sort((a, b) => {
        if (a.unlocked && !b.unlocked) return -1
        if (!a.unlocked && b.unlocked) return 1
        return 0
      })

      console.log('排序后徽章顺序:', updatedBadges.map(b => ({ id: b.id, unlocked: b.unlocked })))

      // 强制触发视图更新
      console.log('准备 setData，徽章数量:', updatedBadges.length)
      console.log('准备 setData，已解锁徽章:', updatedBadges.filter(b => b.unlocked).map(b => ({ id: b.id, unlocked: b.unlocked, type: typeof b.unlocked })))

      this.setData({
        badges: updatedBadges
      }, () => {
        // setData 回调中检查数据
        console.log('setData 完成后的回调:')
        this.data.badges.forEach(b => {
          console.log(`  ${b.id}: unlocked=${b.unlocked} (type: ${typeof b.unlocked})`)
        })
      })

      wx.hideLoading()
    }).catch(err => {
      wx.hideLoading()
      console.error('加载成就失败:', err)
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

  // 阻止事件冒泡
  preventBubble: function () {
    // 什么都不做，只是阻止事件冒泡
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
        
        // 检查是否已解锁（使用宽松比较）
        const exists = badges.find(b => b && String(b.id) === String(badgeId))
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
