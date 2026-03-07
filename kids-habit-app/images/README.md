# 图标资源说明

由于微信小程序需要使用实际的图片文件作为 tabBar 图标，请准备以下图标文件（建议尺寸：81x81 像素）：

## 需要的图标文件

1. `home.png` - 首页图标（未选中）
2. `home-active.png` - 首页图标（选中）
3. `achievement.png` - 成就图标（未选中）
4. `achievement-active.png` - 成就图标（选中）
5. `mall.png` - 商城图标（未选中）
6. `mall-active.png` - 商城图标（选中）
7. `settings.png` - 设置图标（未选中）
8. `settings-active.png` - 设置图标（选中）

## 图标设计建议

- **风格**：卡通风格，线条圆润
- **颜色**：
  - 未选中状态：灰色 (#999999)
  - 选中状态：橙色 (#FF9500)
- **主题**：
  - 首页：小房子 🏠
  - 成就：奖杯 🏆 或星星 ⭐
  - 商城：购物袋 🛍️ 或礼物 🎁
  - 设置：齿轮 ⚙️

## 临时方案

在开发测试阶段，你可以：

1. 使用微信开发者工具自带的图标
2. 从 iconfont.cn 下载免费图标
3. 使用在线工具生成简单图标

## 云开发数据库集合

需要在微信云开发控制台创建以下集合：

1. **users** - 用户数据
   - openid: string
   - childProfile: object { nickname, avatar }
   - points: number
   - continuousDays: number
   - lastCheckInDate: string
   - password: string (可选)
   - passwordErrors: number
   - lockUntil: number
   - soundEnabled: boolean
   - createdAt: date

2. **tasks** - 任务数据
   - createdBy: string (openid)
   - name: string
   - icon: string
   - points: number
   - type: string (good/bad)
   - frequency: string (daily/weekly)
   - completedToday: boolean
   - lastCompletedAt: date
   - createdAt: date

3. **rewards** - 奖励数据
   - createdBy: string (openid)
   - name: string
   - icon: string
   - points: number
   - createdAt: date

4. **exchanges** - 兑换记录
   - openid: string
   - rewardId: string
   - rewardName: string
   - rewardIcon: string
   - points: number
   - createdAt: date

5. **achievements** - 成就徽章
   - openid: string
   - badges: array [{ id, unlockDate }]

## 部署步骤

1. 在微信开发者工具中打开项目
2. 准备或下载 tabBar 图标放入 images 文件夹
3. 在 `app.json` 中填入你的小程序 appid
4. 在 `app.js` 中填入你的云开发环境 ID
5. 右键点击 `cloud/login` 文件夹，选择"上传并部署：云端安装依赖"
6. 在云开发控制台创建上述数据库集合
7. 编译运行小程序

## 首次使用

1. 进入小程序后，点击底部"设置"标签
2. 点击"家长设置区"
3. 首次使用会提示设置 4 位数字密码
4. 进入后可以添加任务、奖励，设置孩子档案
