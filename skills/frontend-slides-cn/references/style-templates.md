# 中文演示文稿风格模板

## 1. 简洁商务风

**适用场景：** 工作汇报、商业计划、项目提案

```css
:root {
  /* 配色方案 */
  --bg-primary: #0f172a;
  --bg-secondary: #1e293b;
  --text-primary: #f8fafc;
  --text-secondary: #94a3b8;
  --accent: #3b82f6;
  --accent-light: #60a5fa;
  --success: #10b981;
  --warning: #f59e0b;
  
  /* 字体 */
  --font-title: 'Noto Sans SC', sans-serif;
  --font-body: 'Noto Sans SC', sans-serif;
  
  /* 间距 */
  --slide-padding: clamp(2rem, 5vw, 4rem);
  --content-gap: clamp(1rem, 2vw, 2rem);
}

/* 背景渐变 */
.slide {
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
}

/* 标题样式 */
h1, h2 {
  font-weight: 700;
  letter-spacing: 0.05em;
  background: linear-gradient(135deg, #ffffff 0%, #94a3b8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* 卡片样式 */
.card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: clamp(1rem, 3vw, 2rem);
  backdrop-filter: blur(10px);
}

/* 强调色块 */
.highlight {
  background: linear-gradient(135deg, var(--accent) 0%, var(--accent-light) 100%);
  color: white;
  padding: 0.5em 1em;
  border-radius: 8px;
  font-weight: 600;
}
```

---

## 2. 学术教育风

**适用场景：** 教学课件、论文答辩、培训材料

```css
:root {
  /* 配色方案 */
  --bg-primary: #fefefe;
  --bg-secondary: #f8f9fa;
  --text-primary: #1f2937;
  --text-secondary: #6b7280;
  --accent: #0891b2;
  --accent-light: #22d3ee;
  --border: #e5e7eb;
  
  /* 字体 */
  --font-title: 'Noto Serif SC', serif;
  --font-body: 'Noto Sans SC', sans-serif;
}

.slide {
  background: #fefefe;
}

/* 标题样式 */
h1 {
  font-family: var(--font-title);
  font-weight: 700;
  color: #1f2937;
  border-bottom: 3px solid var(--accent);
  padding-bottom: 0.5em;
}

h2 {
  font-family: var(--font-title);
  font-weight: 600;
  color: #374151;
}

/* 内容区域 */
.content-box {
  background: white;
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

/* 引用块 */
blockquote {
  border-left: 4px solid var(--accent);
  padding-left: 1.5rem;
  margin: 1.5rem 0;
  font-style: italic;
  color: #4b5563;
  background: #f8f9fa;
  padding: 1rem 1.5rem;
  border-radius: 0 8px 8px 0;
}

/* 列表样式 */
ul {
  list-style: none;
  padding-left: 0;
}

ul li::before {
  content: '▸';
  color: var(--accent);
  font-weight: bold;
  display: inline-block;
  width: 1em;
  margin-left: -1em;
}
```

---

## 3. 科技未来风

**适用场景：** 技术分享、产品发布、创新展示

```css
:root {
  /* 配色方案 */
  --bg-primary: #0a0a0f;
  --bg-secondary: #12121a;
  --text-primary: #ffffff;
  --text-secondary: #a0a0b0;
  --accent: #00f0ff;
  --accent-secondary: #ff00ff;
  --glow: rgba(0, 240, 255, 0.3);
  
  /* 字体 */
  --font-title: 'Noto Sans SC', sans-serif;
  --font-body: 'Noto Sans SC', sans-serif;
  --font-mono: 'Fira Code', 'JetBrains Mono', monospace;
}

.slide {
  background: radial-gradient(ellipse at top, #1a1a2e 0%, #0a0a0f 100%);
}

/* 霓虹标题 */
h1, h2 {
  text-shadow: 0 0 20px var(--glow), 0 0 40px var(--glow);
  background: linear-gradient(90deg, var(--accent) 0%, var(--accent-secondary) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* 网格背景 */
.grid-bg {
  background-image: 
    linear-gradient(rgba(0, 240, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 240, 255, 0.03) 1px, transparent 1px);
  background-size: 50px 50px;
}

/* 代码块 */
.code-block {
  background: #0d0d12;
  border: 1px solid rgba(0, 240, 255, 0.2);
  border-radius: 12px;
  padding: 1.5rem;
  font-family: var(--font-mono);
  font-size: 0.9em;
  overflow-x: auto;
  box-shadow: 0 0 30px rgba(0, 240, 255, 0.1);
}

/* 发光按钮 */
.glow-button {
  background: linear-gradient(135deg, var(--accent) 0%, var(--accent-secondary) 100%);
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  color: white;
  font-weight: 600;
  box-shadow: 0 0 20px var(--glow);
  transition: all 0.3s ease;
}

.glow-button:hover {
  box-shadow: 0 0 40px var(--glow), 0 0 60px var(--glow);
  transform: translateY(-2px);
}
```

---

## 4. 中国风

**适用场景：** 文化展示、传统主题、节日庆典

```css
:root {
  /* 配色方案 */
  --bg-primary: #8b0000;
  --bg-secondary: #a52a2a;
  --text-primary: #fff8dc;
  --text-secondary: #ffd700;
  --accent: #ffd700;
  --gold: #ffd700;
  --jade: #00a86b;
  
  /* 字体 */
  --font-title: 'Ma Shan Zheng', cursive;
  --font-body: 'Noto Sans SC', sans-serif;
  --font-serif: 'Noto Serif SC', serif;
}

.slide {
  background: linear-gradient(135deg, #8b0000 0%, #5c0000 100%);
}

/* 书法标题 */
h1 {
  font-family: var(--font-title);
  font-size: clamp(3rem, 8vw, 6rem);
  color: var(--gold);
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

/* 云纹装饰 */
.cloud-pattern {
  background-image: url("data:image/svg+xml,..."); /* 云纹 SVG */
  opacity: 0.1;
  position: absolute;
  inset: 0;
  pointer-events: none;
}

/* 边框装饰 */
.decorative-border {
  border: 3px solid var(--gold);
  border-radius: 8px;
  position: relative;
  padding: 2rem;
}

.decorative-border::before {
  content: '❖';
  position: absolute;
  top: -15px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--bg-primary);
  padding: 0 1rem;
  color: var(--gold);
  font-size: 24px;
}

/* 竖排文字 */
.vertical-text {
  writing-mode: vertical-rl;
  text-orientation: upright;
  font-family: var(--font-serif);
  line-height: 2;
}
```

---

## 5. 清新简约风

**适用场景：** 产品介绍、创意分享、轻量汇报

```css
:root {
  /* 配色方案 */
  --bg-primary: #f0f9ff;
  --bg-secondary: #ffffff;
  --text-primary: #0c4a6e;
  --text-secondary: #64748b;
  --accent: #0ea5e9;
  --accent-light: #38bdf8;
  --soft-pink: #fda4af;
  --soft-green: #86efac;
  
  /* 字体 */
  --font-title: 'Noto Sans SC', sans-serif;
  --font-body: 'Noto Sans SC', sans-serif;
}

.slide {
  background: linear-gradient(180deg, #f0f9ff 0%, #ffffff 100%);
}

/* 柔和标题 */
h1, h2 {
  color: var(--text-primary);
  font-weight: 600;
  letter-spacing: -0.02em;
}

/* 圆角卡片 */
.soft-card {
  background: white;
  border-radius: 24px;
  padding: 2rem;
  box-shadow: 0 10px 40px -10px rgba(14, 165, 233, 0.1);
}

/* 柔和渐变色块 */
.gradient-blob {
  background: linear-gradient(135deg, var(--accent-light) 0%, var(--soft-pink) 100%);
  border-radius: 50%;
  filter: blur(40px);
  opacity: 0.5;
  position: absolute;
}

/* 标签样式 */
.tag {
  display: inline-block;
  padding: 0.25em 0.75em;
  background: rgba(14, 165, 233, 0.1);
  color: var(--accent);
  border-radius: 999px;
  font-size: 0.875em;
  font-weight: 500;
}
```

---

## 动画效果库

### 淡入上移
```css
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.reveal {
  animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
```

### 缩放进入
```css
@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.zoom-in {
  animation: scaleIn 0.5s ease-out forwards;
}
```

### 从左滑入
```css
@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.slide-left {
  animation: slideInLeft 0.6s ease-out forwards;
}
```

###  stagger 延迟
```css
.stagger-1 { animation-delay: 0.1s; }
.stagger-2 { animation-delay: 0.2s; }
.stagger-3 { animation-delay: 0.3s; }
.stagger-4 { animation-delay: 0.4s; }
.stagger-5 { animation-delay: 0.5s; }
```

---

## 使用建议

### 选择风格的原则
1. **看受众** - 领导/客户→商务风；学生→教育风；开发者→科技风
2. **看内容** - 数据多→简洁风；故事多→中国风/清新风
3. **看场合** - 正式→商务/学术；轻松→清新/科技

### 自定义颜色
修改 `:root` 中的颜色变量即可快速切换整体配色

### 混合使用
可以在一个演示文稿中混合使用不同风格的组件，但保持主色调一致
