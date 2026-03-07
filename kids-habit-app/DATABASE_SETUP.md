# 数据库设置指南 📊

## 云开发数据库集合说明

本项目使用微信云开发数据库，需要创建 5 个集合。

## 创建步骤

### 1. 进入云开发控制台
1. 打开微信开发者工具
2. 点击顶部工具栏的"云开发"按钮
3. 进入云开发控制台界面

### 2. 创建数据库集合
点击左侧"数据库"，然后点击"+"号创建集合。

---

## 集合 1：users（用户数据）

**权限**: 所有用户可读写

**字段说明**:
```javascript
{
  _id: "自动生成",
  openid: "用户唯一标识",
  childProfile: {
    nickname: "小宝贝",      // 孩子昵称
    avatar: "😊"             // 头像表情
  },
  points: 100,               // 当前积分
  continuousDays: 0,         // 连续打卡天数
  lastCheckInDate: null,     // 最后打卡日期 (YYYY-MM-DD)
  password: "1234",          // 家长密码（可选）
  passwordErrors: 0,         // 密码错误次数
  lockUntil: null,           // 锁定截止时间（时间戳）
  soundEnabled: true,        // 音效开关
  createdAt: "服务器时间"     // 创建时间
}
```

**初始数据**（可选）:
无需手动添加，用户首次使用时自动创建。

---

## 集合 2：tasks（任务数据）

**权限**: 所有用户可读写

**字段说明**:
```javascript
{
  _id: "自动生成",
  createdBy: "用户 openid",   // 创建者
  name: "按时起床",          // 任务名称
  icon: "⏰",                // 任务图标
  points: 10,                // 积分值
  type: "good",              // good(好习惯) 或 bad(坏习惯)
  frequency: "daily",        // daily(每日) 或 weekly(每周)
  completedToday: false,     // 今日是否完成
  lastCompletedAt: null,     // 最后完成时间
  createdAt: "服务器时间"     // 创建时间
}
```

**初始数据**（可选）:
```javascript
// 示例：按时起床（好习惯）
{
  createdBy: "替换为你的 openid",
  name: "按时起床",
  icon: "⏰",
  points: 10,
  type: "good",
  frequency: "daily",
  completedToday: false,
  createdAt: new Date()
}

// 示例：自己刷牙（好习惯）
{
  createdBy: "替换为你的 openid",
  name: "自己刷牙",
  icon: "🦷",
  points: 5,
  type: "good",
  frequency: "daily",
  completedToday: false,
  createdAt: new Date()
}

// 示例：发脾气（坏习惯）
{
  createdBy: "替换为你的 openid",
  name: "发脾气",
  icon: "😤",
  points: 5,
  type: "bad",
  frequency: "daily",
  completedToday: false,
  createdAt: new Date()
}
```

---

## 集合 3：rewards（奖励数据）

**权限**: 所有用户可读写

**字段说明**:
```javascript
{
  _id: "自动生成",
  createdBy: "用户 openid",   // 创建者
  name: "看动画片 30 分钟",   // 奖励名称
  icon: "📺",                // 奖励图标
  points: 100,               // 所需积分
  createdAt: "服务器时间"     // 创建时间
}
```

**初始数据**（可选）:
```javascript
// 示例奖励列表
[
  {
    createdBy: "替换为你的 openid",
    name: "小贴纸",
    icon: "🎨",
    points: 50,
    createdAt: new Date()
  },
  {
    createdBy: "替换为你的 openid",
    name: "看动画片 30 分钟",
    icon: "📺",
    points: 100,
    createdAt: new Date()
  },
  {
    createdBy: "替换为你的 openid",
    name: "小零食",
    icon: "🍬",
    points: 80,
    createdAt: new Date()
  },
  {
    createdBy: "替换为你的 openid",
    name: "去公园玩",
    icon: "🎡",
    points: 150,
    createdAt: new Date()
  },
  {
    createdBy: "替换为你的 openid",
    name: "新玩具",
    icon: "🧸",
    points: 300,
    createdAt: new Date()
  },
  {
    createdBy: "替换为你的 openid",
    name: "冰淇淋",
    icon: "🍦",
    points: 60,
    createdAt: new Date()
  },
  {
    createdBy: "替换为你的 openid",
    name: "讲故事时间",
    icon: "📚",
    points: 40,
    createdAt: new Date()
  },
  {
    createdBy: "替换为你的 openid",
    name: "小礼物",
    icon: "🎁",
    points: 200,
    createdAt: new Date()
  }
]
```

---

## 集合 4：exchanges（兑换记录）

**权限**: 所有用户可读写

**字段说明**:
```javascript
{
  _id: "自动生成",
  openid: "用户 openid",      // 用户标识
  rewardId: "奖励 ID",        // 兑换的奖励 ID
  rewardName: "看动画片",     // 奖励名称
  rewardIcon: "📺",          // 奖励图标
  points: 100,               // 消耗积分
  createdAt: "服务器时间"     // 兑换时间
}
```

**初始数据**: 无需手动添加，用户兑换时自动创建。

---

## 集合 5：achievements（成就徽章）

**权限**: 所有用户可读写

**字段说明**:
```javascript
{
  _id: "自动生成",
  openid: "用户 openid",      // 用户标识
  badges: [                   // 已解锁徽章列表
    {
      id: "first_checkin",    // 徽章 ID
      unlockDate: "服务器时间" // 解锁时间
    },
    {
      id: "continuous_3",
      unlockDate: "服务器时间"
    }
  ]
}
```

**徽章 ID 列表**:
- `first_checkin` - 第一次打卡 🌱
- `continuous_3` - 连续 3 天 🔥
- `continuous_7` - 连续 7 天 ⭐
- `continuous_30` - 连续 30 天 💎
- `all_daily` - 单日全部完成 🎯
- `first_exchange` - 首次兑换 🛒
- `points_500` - 累计 500 积分 💰

**初始数据**: 无需手动添加，用户解锁时自动创建。

---

## 数据库操作示例

### 查询当前用户数据
```javascript
const db = wx.cloud.database()
const openid = '用户 openid'

db.collection('users').where({
  openid: openid
}).get().then(res => {
  console.log(res.data)
})
```

### 添加任务
```javascript
const db = wx.cloud.database()

db.collection('tasks').add({
  data: {
    createdBy: openid,
    name: '按时起床',
    icon: '⏰',
    points: 10,
    type: 'good',
    frequency: 'daily',
    completedToday: false,
    createdAt: db.serverDate()
  }
})
```

### 更新积分
```javascript
const db = wx.cloud.database()

db.collection('users').where({
  openid: openid
}).get().then(res => {
  if (res.data.length > 0) {
    db.collection('users').doc(res.data[0]._id).update({
      data: {
        points: 200  // 新积分
      }
    })
  }
})
```

### 删除任务
```javascript
const db = wx.cloud.database()

db.collection('tasks').doc('任务 ID').remove()
```

---

## 数据备份

### 导出数据库
1. 进入云开发控制台
2. 点击左侧"数据库"
3. 选择要导出的集合
4. 点击右上角"导出"按钮
5. 选择 JSON 格式
6. 保存到本地

### 导入数据
1. 进入云开发控制台
2. 点击左侧"数据库"
3. 选择要导入的集合
4. 点击右上角"导入"按钮
5. 选择之前导出的 JSON 文件
6. 确认导入

**建议**: 定期备份重要数据！

---

## 权限设置说明

所有集合的权限都设置为"所有用户可读写"，这是因为：

1. **数据隔离**: 通过 `openid` 字段区分不同用户
2. **前端直接操作**: 减少云函数调用，提高性能
3. **云函数辅助**: 敏感操作（如密码验证）仍通过云函数

### 安全规则示例

如果需要更严格的权限控制，可以在集合的"权限设置"中选择"自定义规则"，然后设置：

```javascript
// users 集合规则示例
{
  "read": "auth.openid == resource.data.openid",
  "write": "auth.openid == resource.data.openid"
}
```

这确保用户只能读写自己的数据。

---

## 数据清理

### 清空某个用户的所有数据
```javascript
const db = wx.cloud.database()
const openid = '用户 openid'

// 删除任务
db.collection('tasks').where({
  createdBy: openid
}).remove()

// 删除奖励
db.collection('rewards').where({
  createdBy: openid
}).remove()

// 删除兑换记录
db.collection('exchanges').where({
  openid: openid
}).remove()

// 删除成就
db.collection('achievements').where({
  openid: openid
}).remove()

// 重置用户数据
db.collection('users').where({
  openid: openid
}).get().then(res => {
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
```

---

## 监控与统计

### 查看数据统计
1. 进入云开发控制台
2. 点击左侧"数据库"
3. 选择集合
4. 查看记录数量

### 查看操作日志
1. 进入云开发控制台
2. 点击左侧"更多" -> "操作日志"
3. 查看数据库操作记录

---

## 配额说明

微信云开发免费版配额：
- 数据库记录数：2GB
- 读写次数：5 万次/天
- 存储容量：5GB

对于个人使用完全足够。如超出配额，可升级付费版本。

---

**提示**: 首次设置完成后，后续使用无需再次配置数据库！
