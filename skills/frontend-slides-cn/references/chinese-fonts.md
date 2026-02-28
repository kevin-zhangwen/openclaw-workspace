# 中文字体指南

## 免费商用中文字体

### 思源系列 (Google/Adobe)

```html
<!-- 思源黑体 (Sans) -->
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300;400;500;700&display=swap" rel="stylesheet">

<!-- 思源宋体 (Serif) -->
<link href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;600;700&display=swap" rel="stylesheet">
```

**特点：**
- 字重齐全（Light/Regular/Medium/Bold）
- 覆盖简体中文、繁体中文、日文、韩文
- 屏幕显示效果优秀
- 完全免费商用

### 站酷系列

```html
<!-- 站酷小薇体 (优雅宋体) -->
<link href="https://fonts.googleapis.com/css2?family=ZCOOL+XiaoWei&display=swap" rel="stylesheet">

<!-- 站酷庆科黄油体 (圆润可爱) -->
<link href="https://fonts.googleapis.com/css2?family=ZCOOL+QingKe+HuangYou&display=swap" rel="stylesheet">

<!-- 站酷酷黑体 (粗黑体) -->
<link href="https://fonts.googleapis.com/css2?family=ZCOOL+KuHei&display=swap" rel="stylesheet">
```

**特点：**
- 设计感强，适合标题
- 免费商用
- 风格独特

### 其他推荐

```html
<!-- 马善政毛笔字体 (中国风) -->
<link href="https://fonts.googleapis.com/css2?family=Ma+Shan+Zheng&display=swap" rel="stylesheet">

<!-- 长城中宋体 (传统宋体) -->
<link href="https://fonts.googleapis.com/css2?family=Long+Cang&display=swap" rel="stylesheet">
```

## 字体搭配建议

### 商务汇报
- 标题：Noto Sans SC Bold
- 正文：Noto Sans SC Regular
- 强调：Noto Sans SC Medium

### 学术课件
- 标题：Noto Serif SC Bold
- 正文：Noto Sans SC Regular
- 引用：Noto Serif SC Regular

### 技术分享
- 标题：Noto Sans SC Bold
- 正文：Noto Sans SC Regular
- 代码：'Fira Code', 'JetBrains Mono', monospace

### 中国风
- 标题：Ma Shan Zheng / ZCOOL XiaoWei
- 正文：Noto Sans SC Regular
- 装饰：ZCOOL QingKe HuangYou

## 字体加载优化

```css
/* 字体预加载 */
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

/* Fallback 字体栈 */
font-family: 'Noto Sans SC', 'Source Han Sans CN', 'Microsoft YaHei', 'PingFang SC', sans-serif;
```

## 中文排版最佳实践

```css
.chinese-text {
  /* 行高 */
  line-height: 1.8;
  
  /* 字间距 */
  letter-spacing: 0.02em;
  
  /* 两端对齐 */
  text-align: justify;
  text-justify: inter-ideograph;
  
  /* 段落缩进 */
  text-indent: 2em;
  
  /* 避免孤行 */
  orphans: 2;
  widows: 2;
}

/* 标题优化 */
h1, h2, h3 {
  line-height: 1.4;
  letter-spacing: 0.05em;
  margin-bottom: 1em;
}

/* 列表优化 */
ul, ol {
  padding-left: 2em;
  line-height: 1.8;
}

li {
  margin-bottom: 0.5em;
}
```

## 字体大小参考

| 元素 | 桌面端 | 移动端 |
|------|--------|--------|
| 主标题 | 48-64px | 28-36px |
| 副标题 | 32-40px | 22-28px |
| 正文 | 18-20px | 16-18px |
| 注释 | 14-16px | 12-14px |

## 常见问题

### Q: 字体加载慢怎么办？
A: 使用 `font-display: swap` 让文字先显示 fallback 字体

```css
@font-face {
  font-family: 'Noto Sans SC';
  src: url(...) format('woff2');
  font-display: swap;
}
```

### Q: 某些字显示为方块？
A: 确保字体覆盖所需字符集，或添加合适的 fallback

### Q: 打印时字体变化？
A: 使用 Web 安全字体或嵌入字体到 PDF
