const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

// 确保 images 目录存在
const imagesDir = path.join(__dirname, 'images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// 图标配置
const icons = [
  { name: 'home', emoji: '🏠', activeColor: '#FF9800' },
  { name: 'achievement', emoji: '🏆', activeColor: '#FF9800' },
  { name: 'mall', emoji: '🎁', activeColor: '#FF9800' },
  { name: 'settings', emoji: '⚙️', activeColor: '#FF9800' }
];

const size = 81;
const inactiveColor = '#999999';

// 绘制图标函数
function drawIcon(emoji, color, filename) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  
  // 透明背景
  ctx.clearRect(0, 0, size, size);
  
  // 绘制圆形背景（半透明）
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2 - 4, 0, Math.PI * 2);
  ctx.fillStyle = color + '20'; // 20% 透明度
  ctx.fill();
  
  // 绘制 emoji
  ctx.font = '48px Arial, Apple Color Emoji, Noto Color Emoji';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = color;
  ctx.fillText(emoji, size / 2, size / 2 + 2);
  
  // 保存文件
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(imagesDir, filename), buffer);
  console.log(`✓ Created ${filename}`);
}

// 生成所有图标
console.log('Generating tabBar icons...\n');

icons.forEach(icon => {
  // 灰色版本（非激活状态）
  drawIcon(icon.emoji, inactiveColor, `${icon.name}.png`);
  // 橙色版本（激活状态）
  drawIcon(icon.emoji, icon.activeColor, `${icon.name}-active.png`);
});

console.log('\n✅ All icons generated successfully!');
console.log(`📁 Saved to: ${imagesDir}/`);
