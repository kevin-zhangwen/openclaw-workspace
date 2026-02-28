# Stock Market Pro - 股票市场分析技能

✅ **已安装并配置完成**

## 📍 安装位置
```
/home/admin/.openclaw/workspace/stock-market-pro/
```

## ✅ 已安装依赖
- yfinance
- plotly
- pandas
- plotille
- matplotlib
- mplfinance
- rich

## 🚀 使用方法

### 1. 查看股票价格
```bash
cd /home/admin/.openclaw/workspace/stock-market-pro
source .venv/bin/activate
python3 scripts/yf.py price AAPL
```

### 2. 查看基本面
```bash
python3 scripts/yf.py fundamentals NVDA
```

### 3. 生成专业图表（PNG）
```bash
# 蜡烛图
python3 scripts/yf.py pro 000660.KS 6mo

# 带技术指标
python3 scripts/yf.py pro TSLA 6mo --rsi --macd --bb
```

### 4. 一键报告
```bash
python3 scripts/yf.py report 000660.KS 6mo
```

## 📊 支持的股票代码
- **美股**: `AAPL`, `NVDA`, `TSLA`
- **韩股**: `005930.KS`, `000660.KS`
- **加密货币**: `BTC-USD`, `ETH-KRW`
- **外汇**: `USDKRW=X`

## 🔧 技术指标
- `--rsi` : RSI(14)
- `--macd`: MACD(12,26,9)
- `--bb`  : 布林带 (20,2)
- `--vwap`: 成交量加权平均价
- `--atr` : 平均真实波动 (14)

---

**状态**: ✅ 可以正常使用
