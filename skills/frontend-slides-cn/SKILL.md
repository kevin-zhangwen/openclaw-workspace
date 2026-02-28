---
name: frontend-slides-cn
description: 快速创建中文演示文稿技能。支持 PDF 导出、数据可视化图表（柱状图/饼图/折线图）、中文字体优化。使用场景：教学课件、技术分享、工作汇报。从 scratch 创建或转换 PPT/PPTX 文件。
---

# Frontend Slides CN - 中文演示文稿技能

快速创建零依赖、动画丰富的 HTML 演示文稿，专为中文用户优化。

## 核心特性

### ⚡ 快速模式
- **一键生成** - 用户提供主题/大纲后直接生成，减少确认步骤
- **智能推断** - 根据内容自动选择合适风格，无需手动选择
- **即时预览** - 生成后直接在浏览器打开

### 📄 PDF 导出
- 内置打印样式，支持一键导出 PDF
- 保持动画和布局的打印版本
- 支持 A4 和 16:9 两种比例

### 📊 数据可视化
- **柱状图** - 对比数据、趋势展示
- **饼图** - 占比分析、分布展示
- **折线图** - 时间序列、趋势变化
- 支持从 CSV/Excel 数据自动生成图表

### 🇨🇳 中文优化
- **中文字体** - 思源黑体、思源宋体、站酷字体
- **中文排版** - 优化行高、字间距、标点符号
- **中文模板** - 符合中文审美的设计风格

---

## 快速开始

### 模式 A: 新建演示文稿

**用户只需提供：**
1. 演示主题
2. 大致内容或大纲
3. 使用场景（教学/演讲/汇报）

**示例输入：**
> "帮我做一个关于 AI 发展趋势的技术分享，大约 15 页"

**技能自动处理：**
- 推断内容结构
- 选择合适风格（技术类→简洁专业风）
- 生成完整演示文稿
- 直接在浏览器打开

### 模式 B: PPT 转换

用户提供 PPT/PPTX 文件 → 提取内容 → 应用中文优化风格 → 生成 HTML

### 模式 C: 数据报告

用户提供 CSV/Excel 数据 → 自动生成图表幻灯片 → 添加分析说明

---

## 中文风格预设

| 风格 | 适用场景 | 特点 |
|------|----------|------|
| 简洁商务 | 工作汇报、商业计划 | 深蓝/灰色调，专业稳重 |
| 学术教育 | 教学课件、论文答辩 | 清晰易读，重点突出 |
| 科技未来 | 技术分享、产品发布 | 渐变蓝紫，科技感 |
| 中国风 | 文化展示、传统主题 | 红色/金色，传统元素 |
| 清新简约 | 产品介绍、创意分享 | 浅色背景，活泼明快 |

---

## 中文字体配置

### 推荐字体组合

```css
/* 商务/技术风格 */
--font-title: 'Source Han Sans CN', 'Noto Sans SC', sans-serif;
--font-body: 'Source Han Sans CN', 'Noto Sans SC', sans-serif;

/* 学术/教育风格 */
--font-title: 'Source Han Serif CN', 'Noto Serif SC', serif;
--font-body: 'Source Han Sans CN', 'Noto Sans SC', sans-serif;

/* 中国风 */
--font-title: 'Ma Shan Zheng', 'ZCOOL XiaoWei', serif;
--font-body: 'Source Han Sans CN', 'Noto Sans SC', sans-serif;
```

### 字体加载

```html
<!-- 思源字体 (Google Fonts) -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300;400;500;700&family=Noto+Serif+SC:wght@400;600;700&display=swap" rel="stylesheet">

<!-- 站酷字体 (免费商用) -->
<link href="https://fonts.googleapis.com/css2?family=ZCOOL+XiaoWei&display=swap" rel="stylesheet">
```

---

## 图表生成

### 柱状图示例

```html
<div class="chart-bar" data-values="[85, 72, 90, 65, 78]" data-labels="['Q1', 'Q2', 'Q3', 'Q4', '全年']">
  <h3>季度业绩对比</h3>
</div>

<style>
.chart-bar {
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  height: 300px;
  padding: 20px;
  background: var(--bg-secondary);
  border-radius: 12px;
}
.chart-bar .bar {
  width: 60px;
  background: linear-gradient(180deg, var(--accent) 0%, var(--accent-dark) 100%);
  border-radius: 8px 8px 0 0;
  transition: height 0.6s var(--ease-out-expo);
}
</style>
```

### 饼图示例

```html
<canvas id="pie-chart" data-values="[35, 25, 20, 15, 5]" data-labels="['产品 A', '产品 B', '产品 C', '产品 D', '其他']"></canvas>

<script>
// 使用 Canvas 绘制饼图
function drawPieChart(canvasId, values, labels) {
  const canvas = document.getElementById(canvasId);
  const ctx = canvas.getContext('2d');
  // ... 绘制逻辑
}
</script>
```

### 折线图示例

```html
<canvas id="line-chart" data-values="[120, 135, 128, 145, 160, 175]" data-labels="['1 月', '2 月', '3 月', '4 月', '5 月', '6 月']"></canvas>
```

---

## PDF 导出

### 打印样式

```css
@media print {
  @page {
    size: A4 landscape;
    margin: 0;
  }
  
  body {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  
  .slide {
    height: 100vh;
    page-break-after: always;
    break-after: page;
  }
  
  /* 隐藏导航元素 */
  .nav-dots, .progress-bar, .keyboard-hint {
    display: none !important;
  }
  
  /* 确保动画状态固定 */
  .reveal {
    opacity: 1 !important;
    transform: none !important;
  }
}
```

### 导出按钮

```html
<button class="export-pdf" onclick="window.print()">
  📄 导出 PDF
</button>

<style>
.export-pdf {
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 12px 24px;
  background: var(--accent);
  color: var(--bg-primary);
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  z-index: 1000;
}
</style>
```

---

## 中文排版规范

### 文字间距

```css
:root {
  --chinese-line-height: 1.8; /* 中文行高 */
  --chinese-letter-spacing: 0.05em; /* 字间距 */
  --chinese-paragraph-spacing: 1.5em; /* 段落间距 */
}

.chinese-text {
  line-height: var(--chinese-line-height);
  letter-spacing: var(--chinese-letter-spacing);
  text-align: justify;
  text-justify: inter-ideograph;
}
```

### 标点优化

```css
/* 避免标点出现在行首 */
.chinese-text {
  hanging-punctuation: first last;
  text-indent: 2em;
}

/* 引号、括号优化 */
q::before { content: '"'; }
q::after { content: '"'; }
```

---

## 模板结构

### 教学课件模板

```
1. 封面页 - 课程标题 + 讲师信息
2. 目录页 - 课程大纲
3. 学习目标 - 本课程将学到什么
4-10. 内容页 - 知识点讲解（每页一个核心概念）
11. 实践练习 - 动手任务
12. 总结回顾 - 要点回顾
13. Q&A - 问答环节
14. 结束页 - 联系方式/参考资料
```

### 技术分享模板

```
1. 封面页 - 分享主题 + 演讲者
2. 背景介绍 - 为什么讲这个主题
3. 问题定义 - 要解决什么问题
4-8. 技术方案 - 核心内容（架构/实现/优化）
9. 效果展示 - 数据对比/演示
10. 经验总结 - 踩坑记录/最佳实践
11. 未来规划 - 下一步计划
12. Q&A
13. 结束页
```

### 工作汇报模板

```
1. 封面页 - 汇报主题 + 日期
2. 本周/月重点 - 核心成果摘要
3-5. 项目进展 - 各项目负责人汇报
6. 数据展示 - 关键指标图表
7. 问题与挑战 - 需要支持的事项
8. 下周/月计划 - 工作目标
9. 资源需求 - 需要协调的资源
10. 结束页
```

---

## 使用流程

### 快速模式（推荐）

```
1. 用户输入：主题 + 场景 + 大致内容
   → "帮我做一个 Q3 工作汇报，包含销售数据和团队进展"

2. 技能自动：
   - 推断内容结构
   - 选择风格（工作汇报→简洁商务）
   - 生成大纲并确认（可选）
   - 创建完整演示文稿
   - 浏览器打开预览

3. 用户调整（可选）：
   - "换个颜色"
   - "加一页关于团队的介绍"
   - "导出 PDF"
```

### 详细模式

当用户需求复杂时，分步确认：
1. 内容确认 → 2. 风格选择 → 3. 生成预览 → 4. 调整优化

---

## 代码生成规范

### 必填 CSS（中文优化版）

```css
/* 中文字体加载 */
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300;400;500;700&display=swap');

:root {
  /* 中文字体 */
  --font-chinese-sans: 'Noto Sans SC', 'Source Han Sans CN', sans-serif;
  --font-chinese-serif: 'Noto Serif SC', 'Source Han Serif CN', serif;
  
  /* 中文排版 */
  --line-height-chinese: 1.8;
  --letter-spacing-chinese: 0.02em;
  
  /* 视口适配（必须） */
  --slide-padding: clamp(1rem, 4vw, 4rem);
  --title-size: clamp(1.5rem, 5vw, 4rem);
  --body-size: clamp(0.875rem, 1.5vw, 1.125rem);
}

html, body {
  height: 100%;
  overflow-x: hidden;
}

.slide {
  width: 100vw;
  height: 100vh;
  height: 100dvh;
  overflow: hidden;
  padding: var(--slide-padding);
}
```

### 图表生成脚本

参见 `scripts/generate-charts.js`

### PDF 导出脚本

参见 `scripts/export-pdf.js`

---

## 参考文件

- **风格模板详情** → `references/style-templates.md`
- **图表代码库** → `references/chart-examples.md`
- **中文字体指南** → `references/chinese-fonts.md`
- **模板示例** → `references/templates.md`

---

## 常见问题

### Q: 如何导出 PDF？
A: 点击右下角「导出 PDF」按钮，或使用浏览器打印功能（Ctrl+P / Cmd+P），选择「另存为 PDF」

### Q: 图表数据从哪里来？
A: 可以直接在代码中写入数据数组，也可以提供 CSV/Excel 文件自动解析

### Q: 中文字体不显示？
A: 确保网络连接正常（字体从 Google Fonts 加载），或改用本地字体

### Q: 如何在手机上查看？
A: 演示文稿完全响应式，直接用手机浏览器打开即可

---

## 示例会话

**用户：** 帮我做一个关于 Python 数据分析的技术分享，大约 20 页

**技能：** 好的！我为你创建一个技术分享演示文稿 📊

风格：科技未来风（深蓝渐变 + 代码元素）
结构：
1. 封面 - Python 数据分析实战
2. 为什么选择 Python
3. 环境搭建
4-15. 核心库介绍（NumPy/Pandas/Matplotlib 等）
16-18. 实战案例
19. 总结
20. Q&A

正在生成... ✨

[生成完成后]

演示文稿已创建完成！
📁 文件：python-data-analysis.html
🎨 风格：科技未来风
📊 幻灯片：20 页

已在浏览器中打开，查看效果后告诉我是否需要调整！

---

## 更新日志

- v1.0: 初始版本，中文优化 + 快速模式 + PDF 导出 + 图表生成
