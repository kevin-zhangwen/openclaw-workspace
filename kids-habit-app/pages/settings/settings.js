// pages/settings/settings.js - 设置页（家长管理）
const app = getApp()

Page({
  data: {
    childProfile: {
      nickname: '小宝贝',
      avatar: '😊'
    },
    settings: {
      soundEnabled: true,
      passwordSet: false
    },
    tasks: [],
    rewards: [],
    showPasswordInput: false,
    passwordValue: '',
    passwordError: '',
    lockUntil: null,
    showTaskForm: false,
    showRewardForm: false,
    editingItem: null,
    formData: {
      name: '',
      icon: '⭐',
      points: 10,
      type: 'good', // good or bad
      frequency: 'daily' // daily or weekly
    },
    avatarOptions: ['😊', '😄', '🥳', '🤩', '😎', '🤠', '👧', '👦', '🐶', '🐱', '🐼', '🦁', '🐯', '🐸', '🐵', '🦄'],
    iconOptions: ['⭐', '🌟', '✨', '💫', '🎯', '📚', '🎨', '⚽', '🏀', '🎵', '🧹', '🛏️', '🍽️', '🦷', '🚿', '👕']
  },

  onLoad: function () {
    this.loadUserData()
  },

  onShow: function () {
    this.loadUserData()
  },

  // 加载用户数据
  loadUserData: function () {
    wx.showLoading({ title: '加载中...' })
    
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

    // 获取用户数据
    db.collection('users').where({
      openid: openid
    }).get().then(res => {
      if (res.data.length > 0) {
        const userData = res.data[0]
        this.setData({
          childProfile: userData.childProfile || this.data.childProfile,
          'settings.soundEnabled': userData.soundEnabled !== false,
          'settings.passwordSet': !!userData.password
        })
      }
      this.loadTasks()
      this.loadRewards()
      wx.hideLoading()
    }).catch(err => {
      wx.hideLoading()
      console.error(err)
    })
  },

  // 加载任务
  loadTasks: function () {
    const db = wx.cloud.database()
    db.collection('tasks').where({
      createdBy: app.globalData.openid
    }).get().then(res => {
      this.setData({ tasks: res.data })
    })
  },

  // 加载奖励
  loadRewards: function () {
    const db = wx.cloud.database()
    db.collection('rewards').where({
      createdBy: app.globalData.openid
    }).get().then(res => {
      this.setData({ rewards: res.data })
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

  // 输入密码
  onPasswordInput: function (e) {
    this.setData({
      passwordValue: e.detail.value
    })
  },

  // 提交密码
  submitPassword: function () {
    if (this.data.passwordValue.length !== 4) {
      this.setData({
        passwordError: '请输入 4 位数字密码'
      })
      return
    }

    const db = wx.cloud.database()
    const openid = app.globalData.openid

    if (!this.data.settings.passwordSet) {
      // 首次设置密码
      db.collection('users').where({
        openid: openid
      }).get().then(res => {
        if (res.data.length > 0) {
          db.collection('users').doc(res.data[0]._id).update({
            data: {
              password: this.data.passwordValue,
              passwordErrors: 0
            }
          }).then(() => {
            this.setData({
              'settings.passwordSet': true,
              showPasswordInput: false
            })
            wx.showToast({ title: '密码设置成功', icon: 'success' })
          })
        }
      })
    } else {
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
              passwordError: '',
              lockUntil: null
            })
            // 重置错误计数
            db.collection('users').doc(userData._id).update({
              data: {
                passwordErrors: 0
              }
            })
          } else {
            const errorCount = (userData.passwordErrors || 0) + 1
            if (errorCount >= 3) {
              const lockUntil = Date.now() + 5 * 60 * 1000
              this.setData({
                lockUntil: lockUntil,
                passwordError: '已锁定 5 分钟'
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
    }
  },

  // 关闭密码输入
  closePasswordInput: function () {
    this.setData({
      showPasswordInput: false,
      passwordValue: '',
      passwordError: ''
    })
  },

  // 打开任务表单
  openTaskForm: function (e) {
    const task = e ? e.currentTarget.dataset.task : null
    this.setData({
      showTaskForm: true,
      editingItem: task,
      formData: task ? {
        name: task.name,
        icon: task.icon,
        points: task.points,
        type: task.type,
        frequency: task.frequency
      } : {
        name: '',
        icon: '⭐',
        points: 10,
        type: 'good',
        frequency: 'daily'
      }
    })
  },

  // 打开奖励表单
  openRewardForm: function (e) {
    const reward = e ? e.currentTarget.dataset.reward : null
    this.setData({
      showRewardForm: true,
      editingItem: reward,
      formData: reward ? {
        name: reward.name,
        icon: reward.icon,
        points: reward.points
      } : {
        name: '',
        icon: '🎁',
        points: 50
      }
    })
  },

  // 关闭表单
  closeTaskForm: function () {
    this.setData({
      showTaskForm: false,
      editingItem: null
    })
  },

  closeRewardForm: function () {
    this.setData({
      showRewardForm: false,
      editingItem: null
    })
  },

  // 表单输入
  onFormInput: function (e) {
    const field = e.currentTarget.dataset.field
    const value = e.detail.value
    this.setData({
      [`formData.${field}`]: value
    })
  },

  // 选择图标
  selectIcon: function (e) {
    const icon = e.currentTarget.dataset.icon
    this.setData({
      'formData.icon': icon
    })
  },

  // 选择头像
  selectAvatar: function (e) {
    const avatar = e.currentTarget.dataset.avatar
    this.setData({
      'childProfile.avatar': avatar
    })
  },

  // 保存任务
  saveTask: function () {
    if (!this.data.formData.name) {
      wx.showToast({ title: '请输入任务名称', icon: 'none' })
      return
    }

    const db = wx.cloud.database()
    const openid = app.globalData.openid

    if (this.data.editingItem) {
      // 更新任务
      db.collection('tasks').doc(this.data.editingItem._id).update({
        data: this.data.formData
      }).then(() => {
        this.closeTaskForm()
        this.loadTasks()
        wx.showToast({ title: '保存成功', icon: 'success' })
      })
    } else {
      // 新增任务
      db.collection('tasks').add({
        data: {
          ...this.data.formData,
          createdBy: openid,
          completedToday: false,
          createdAt: db.serverDate()
        }
      }).then(() => {
        this.closeTaskForm()
        this.loadTasks()
        wx.showToast({ title: '添加成功', icon: 'success' })
      })
    }
  },

  // 保存奖励
  saveReward: function () {
    if (!this.data.formData.name) {
      wx.showToast({ title: '请输入奖励名称', icon: 'none' })
      return
    }

    const db = wx.cloud.database()
    const openid = app.globalData.openid

    if (this.data.editingItem) {
      // 更新奖励
      db.collection('rewards').doc(this.data.editingItem._id).update({
        data: this.data.formData
      }).then(() => {
        this.closeRewardForm()
        this.loadRewards()
        wx.showToast({ title: '保存成功', icon: 'success' })
      })
    } else {
      // 新增奖励
      db.collection('rewards').add({
        data: {
          ...this.data.formData,
          createdBy: openid,
          createdAt: db.serverDate()
        }
      }).then(() => {
        this.closeRewardForm()
        this.loadRewards()
        wx.showToast({ title: '添加成功', icon: 'success' })
      })
    }
  },

  // 删除任务
  deleteTask: function (e) {
    const task = e.currentTarget.dataset.task
    wx.showModal({
      title: '删除任务',
      content: '确定要删除这个任务吗？',
      success: (res) => {
        if (res.confirm) {
          const db = wx.cloud.database()
          db.collection('tasks').doc(task._id).remove().then(() => {
            this.loadTasks()
            wx.showToast({ title: '已删除', icon: 'success' })
          })
        }
      }
    })
  },

  // 删除奖励
  deleteReward: function (e) {
    const reward = e.currentTarget.dataset.reward
    wx.showModal({
      title: '删除奖励',
      content: '确定要删除这个奖励吗？',
      success: (res) => {
        if (res.confirm) {
          const db = wx.cloud.database()
          db.collection('rewards').doc(reward._id).remove().then(() => {
            this.loadRewards()
            wx.showToast({ title: '已删除', icon: 'success' })
          })
        }
      }
    })
  },

  // 更新孩子档案
  updateChildProfile: function () {
    const db = wx.cloud.database()
    const openid = app.globalData.openid

    db.collection('users').where({
      openid: openid
    }).get().then(res => {
      if (res.data.length > 0) {
        db.collection('users').doc(res.data[0]._id).update({
          data: {
            childProfile: this.data.childProfile
          }
        }).then(() => {
          wx.showToast({ title: '保存成功', icon: 'success' })
        })
      }
    })
  },

  // 切换音效开关
  toggleSound: function () {
    const db = wx.cloud.database()
    const openid = app.globalData.openid
    const newSoundEnabled = !this.data.settings.soundEnabled

    db.collection('users').where({
      openid: openid
    }).get().then(res => {
      if (res.data.length > 0) {
        db.collection('users').doc(res.data[0]._id).update({
          data: {
            soundEnabled: newSoundEnabled
          }
        }).then(() => {
          this.setData({
            'settings.soundEnabled': newSoundEnabled
          })
          wx.showToast({ title: '已更新', icon: 'success' })
        })
      }
    })
  },

  // 手动重置今日任务
  resetTodayTasks: function () {
    wx.showModal({
      title: '重置今日任务',
      content: '确定要重置今天的所有任务打卡状态吗？',
      success: (res) => {
        if (res.confirm) {
          const db = wx.cloud.database()
          db.collection('tasks').where({
            createdBy: app.globalData.openid
          }).get().then(res => {
            const batch = db.batch()
            res.data.forEach(task => {
              batch.update({
                collection: 'tasks',
                doc: task._id,
                data: { completedToday: false }
              })
            })
            batch.commit().then(() => {
              wx.setStorageSync('lastResetDate', new Date().toISOString().split('T')[0])
              this.loadTasks()
              wx.showToast({ title: '已重置', icon: 'success' })
            })
          })
        }
      }
    })
  },

  // 清空所有数据
  clearAllData: function () {
    wx.showModal({
      title: '警告',
      content: '确定要清空所有数据吗？此操作不可恢复！',
      confirmText: '清空所有',
      confirmColor: '#FF4D4F',
      success: (res) => {
        if (res.confirm) {
          wx.showModal({
            title: '二次确认',
            content: '真的要清空吗？所有任务、积分、成就都将被删除！',
            confirmText: '确认清空',
            confirmColor: '#FF4D4F',
            success: (res2) => {
              if (res2.confirm) {
                const db = wx.cloud.database()
                const openid = app.globalData.openid

                // 删除所有相关数据
                Promise.all([
                  db.collection('tasks').where({ createdBy: openid }).remove(),
                  db.collection('rewards').where({ createdBy: openid }).remove(),
                  db.collection('exchanges').where({ openid: openid }).remove(),
                  db.collection('achievements').where({ openid: openid }).remove()
                ]).then(() => {
                  // 重置用户数据
                  db.collection('users').where({ openid: openid }).get().then(res => {
                    if (res.data.length > 0) {
                      db.collection('users').doc(res.data[0]._id).update({
                        data: {
                          points: 100,
                          continuousDays: 0,
                          lastCheckInDate: null
                        }
                      })
                    }
                  })

                  wx.setStorageSync('lastResetDate', '')
                  this.loadUserData()
                  wx.showToast({ title: '已清空', icon: 'success' })
                })
              }
            }
          })
        }
      }
    })
  }
})
