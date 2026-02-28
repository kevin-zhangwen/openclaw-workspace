/**
 * 图表生成工具库
 * 用于在 HTML 演示文稿中生成柱状图、饼图、折线图
 * 零依赖，纯原生 JavaScript 实现
 */

const ChartGenerator = {
  /**
   * 生成柱状图
   * @param {string} containerId - 容器元素 ID
   * @param {Object} data - 数据对象 {labels: [], values: []}
   * @param {Object} options - 配置选项
   */
  createBarChart(containerId, data, options = {}) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const {
      horizontal = false,
      colors = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'],
      showValues = true,
      animated = true
    } = options;

    const maxValue = Math.max(...data.values);
    const minValue = Math.min(...data.values);
    const range = maxValue - minValue || 1;

    if (horizontal) {
      // 横向柱状图
      container.className = 'bar-chart-horizontal';
      container.innerHTML = data.values.map((value, index) => {
        const percentage = ((value - minValue) / range) * 100;
        const color = colors[index % colors.length];
        return `
          <div class="bar-row">
            <span class="bar-label">${data.labels[index]}</span>
            <div class="bar-track">
              <div class="bar-fill" style="width: 0%; background: ${color};" 
                   data-width="${percentage}%">
                ${showValues ? `<span class="bar-value">${value}</span>` : ''}
              </div>
            </div>
          </div>
        `;
      }).join('');

      // 动画
      if (animated) {
        setTimeout(() => {
          container.querySelectorAll('.bar-fill').forEach((bar, i) => {
            setTimeout(() => {
              bar.style.width = bar.dataset.width;
            }, i * 100);
          });
        }, 100);
      } else {
        container.querySelectorAll('.bar-fill').forEach(bar => {
          bar.style.width = bar.dataset.width;
        });
      }
    } else {
      // 纵向柱状图
      container.className = 'bar-chart-vertical';
      container.innerHTML = `
        <div class="grid-lines"></div>
        <div class="bars-container">
          ${data.values.map((value, index) => {
            const heightPercent = (value / maxValue) * 100;
            const color = colors[index % colors.length];
            return `
              <div class="bar-container">
                <div class="bar" style="height: 0%; background: ${color};" 
                     data-height="${heightPercent}%">
                  ${showValues ? `<span class="bar-value">${value}</span>` : ''}
                </div>
                <span class="bar-label">${data.labels[index]}</span>
              </div>
            `;
          }).join('')}
        </div>
      `;

      // 动画
      if (animated) {
        setTimeout(() => {
          container.querySelectorAll('.bar').forEach((bar, i) => {
            setTimeout(() => {
              bar.style.height = bar.dataset.height;
            }, i * 100);
          });
        }, 100);
      } else {
        container.querySelectorAll('.bar').forEach(bar => {
          bar.style.height = bar.dataset.height;
        });
      }
    }
  },

  /**
   * 生成饼图
   * @param {string} canvasId - Canvas 元素 ID
   * @param {Object} data - 数据对象 {labels: [], values: []}
   * @param {Object} options - 配置选项
   */
  createPieChart(canvasId, data, options = {}) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const {
      donut = false,
      colors = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'],
      showLabels = true,
      animated = true
    } = options;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const outerRadius = Math.min(centerX, centerY) - 60;
    const innerRadius = donut ? outerRadius * 0.6 : 0;

    const total = data.values.reduce((sum, val) => sum + val, 0);
    let currentAngle = -Math.PI / 2;

    const drawSlice = (index) => {
      if (index >= data.values.length) return;

      const value = data.values[index];
      const sliceAngle = (value / total) * 2 * Math.PI;
      const color = colors[index % colors.length];

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, outerRadius, currentAngle, currentAngle + sliceAngle);
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();

      if (donut) {
        // 挖空中心
        ctx.beginPath();
        ctx.arc(centerX, centerY, innerRadius, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
      }

      // 绘制百分比标签
      if (showLabels) {
        const midAngle = currentAngle + sliceAngle / 2;
        const labelRadius = donut 
          ? (outerRadius + innerRadius) / 2 
          : outerRadius * 0.7;
        const labelX = centerX + Math.cos(midAngle) * labelRadius;
        const labelY = centerY + Math.sin(midAngle) * labelRadius;

        const percentage = Math.round((value / total) * 100);
        if (percentage > 3) { // 太小的 slice 不显示标签
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 14px "Noto Sans SC", sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(percentage + '%', labelX, labelY);
        }
      }

      currentAngle += sliceAngle;

      // 动画效果
      if (animated) {
        setTimeout(() => drawSlice(index + 1), 150);
      }
    };

    if (animated) {
      drawSlice(0);
    } else {
      for (let i = 0; i < data.values.length; i++) {
        const value = data.values[i];
        const sliceAngle = (value / total) * 2 * Math.PI;
        const color = colors[i % colors.length];

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, outerRadius, currentAngle, currentAngle + sliceAngle);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();

        currentAngle += sliceAngle;
      }
    }

    // 绘制图例
    this.drawLegend(ctx, canvas.width, canvas.height - 30, data.labels, colors);
  },

  /**
   * 生成折线图
   * @param {string} canvasId - Canvas 元素 ID
   * @param {Object} data - 数据对象 {labels: [], values: []}
   * @param {Object} options - 配置选项
   */
  createLineChart(canvasId, data, options = {}) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const {
      colors = ['#4F46E5'],
      fillColor = 'rgba(79, 70, 229, 0.1)',
      showPoints = true,
      animated = true,
      smooth = true
    } = options;

    const padding = 60;
    const width = canvas.width - padding * 2;
    const height = canvas.height - padding * 2;

    const maxValue = Math.max(...data.values);
    const minValue = Math.min(...data.values);
    const range = maxValue - minValue || 1;

    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 绘制网格线
    ctx.strokeStyle = '#e5e7eb';
    ctx.setLineDash([5, 5]);
    ctx.lineWidth = 1;

    for (let i = 0; i <= 4; i++) {
      const y = padding + (height / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(canvas.width - padding, y);
      ctx.stroke();

      // Y 轴标签
      const value = Math.round(maxValue - (range / 4) * i);
      ctx.fillStyle = '#9ca3af';
      ctx.font = '12px "Noto Sans SC", sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(value, padding - 10, y + 4);
    }

    ctx.setLineDash([]);

    // 计算点坐标
    const points = data.values.map((value, index) => {
      const x = padding + (width / (data.values.length - 1)) * index;
      const y = padding + height - ((value - minValue) / range) * height;
      return { x, y, value };
    });

    // 绘制曲线下面积
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    
    if (smooth && points.length > 2) {
      // 贝塞尔曲线
      for (let i = 1; i < points.length - 1; i++) {
        const xc = (points[i].x + points[i + 1].x) / 2;
        const yc = (points[i].y + points[i + 1].y) / 2;
        ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
      }
      ctx.quadraticCurveTo(
        points[points.length - 1].x,
        points[points.length - 1].y,
        points[points.length - 1].x,
        points[points.length - 1].y
      );
    } else {
      // 直线连接
      points.forEach((point, i) => {
        if (i === 0) ctx.moveTo(point.x, point.y);
        else ctx.lineTo(point.x, point.y);
      });
    }

    ctx.lineTo(points[points.length - 1].x, padding + height);
    ctx.lineTo(points[0].x, padding + height);
    ctx.closePath();
    ctx.fillStyle = fillColor;
    ctx.fill();

    // 绘制折线
    const drawLine = (progress) => {
      ctx.strokeStyle = colors[0];
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);

      const visiblePoints = Math.floor(points.length * progress);
      
      for (let i = 1; i <= visiblePoints; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }

      if (progress < 1 && visiblePoints < points.length - 1) {
        const nextPoint = points[visiblePoints + 1];
        const currentPoint = points[visiblePoints];
        const t = (progress * points.length) - visiblePoints;
        const x = currentPoint.x + (nextPoint.x - currentPoint.x) * t;
        const y = currentPoint.y + (nextPoint.y - currentPoint.y) * t;
        ctx.lineTo(x, y);
      }

      ctx.stroke();
    };

    // 绘制数据点
    const drawPoints = (visibleCount) => {
      points.forEach((point, i) => {
        if (i > visibleCount) return;

        // 外圈
        ctx.beginPath();
        ctx.arc(point.x, point.y, 8, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.strokeStyle = colors[0];
        ctx.lineWidth = 3;
        ctx.stroke();

        // 内点
        ctx.beginPath();
        ctx.arc(point.x, point.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = colors[0];
        ctx.fill();

        // X 轴标签
        ctx.fillStyle = '#6b7280';
        ctx.font = '12px "Noto Sans SC", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(data.labels[i], point.x, canvas.height - padding + 25);
      });
    };

    // 动画
    if (animated) {
      let progress = 0;
      const animate = () => {
        progress += 0.02;
        if (progress <= 1) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          // 重绘网格
          for (let i = 0; i <= 4; i++) {
            const y = padding + (height / 4) * i;
            ctx.strokeStyle = '#e5e7eb';
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(canvas.width - padding, y);
            ctx.stroke();
          }
          ctx.setLineDash([]);
          
          drawLine(progress);
          drawPoints(Math.floor(points.length * progress));
          requestAnimationFrame(animate);
        }
      };
      animate();
    } else {
      drawLine(1);
      drawPoints(points.length - 1);
    }

    // 绘制图例
    this.drawLegend(ctx, canvas.width, canvas.height - 30, data.labels.slice(0, 5), colors);
  },

  /**
   * 绘制图例
   */
  drawLegend(ctx, x, y, labels, colors) {
    ctx.font = '12px "Noto Sans SC", sans-serif';
    labels.slice(0, 5).forEach((label, index) => {
      const itemX = x + index * 100;
      
      ctx.fillStyle = colors[index % colors.length];
      ctx.fillRect(itemX, y, 16, 16);
      
      ctx.fillStyle = '#374151';
      ctx.textAlign = 'left';
      ctx.fillText(label, itemX + 24, y + 13);
    });
  },

  /**
   * 从 CSV 数据生成图表
   * @param {string} csvText - CSV 文本
   * @param {Object} options - 解析选项
   */
  parseCSV(csvText, options = {}) {
    const {
      hasHeader = true,
      delimiter = ','
    } = options;

    const lines = csvText.trim().split('\n');
    const data = { labels: [], values: [] };

    lines.forEach((line, index) => {
      const parts = line.split(delimiter);
      if (hasHeader && index === 0) return; // 跳过表头

      if (parts.length >= 2) {
        data.labels.push(parts[0].trim());
        data.values.push(parseFloat(parts[1].trim()) || 0);
      }
    });

    return data;
  }
};

// 导出供使用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ChartGenerator;
}
