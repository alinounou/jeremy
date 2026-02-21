# 🚀 Elite AI Trading Platform

Ultra-professional institutional AI trading web platform with real-time market data, quantitative calculators, predictive AI signals, and Bloomberg Terminal / TradingView Pro-style interface.

![Elite AI Trading Platform](https://img.shields.io/badge/Platform-Elite%20AI%20Trading-blue)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

### 📊 Real-Time Market Data
- **Multi-Asset Coverage**: Forex, Metals (Gold/Silver), Crypto, Indices, Stocks
- **Live Price Streaming**: Real-time tick-by-tick updates with simulated market data
- **Historical Data**: Rolling candle buffer with multiple timeframes
- **Market Watch**: Comprehensive ticker display with price changes and mini sparklines

### 🧮 Advanced Quantitative Calculators
- **Position Sizing Calculator**: Fixed %, ATR-based, Volatility-adjusted, Kelly Criterion
- **Risk/Reward Optimizer**: Calculate optimal SL/TP levels
- **VaR Calculator**: Value at Risk (Parametric, Historical, Monte Carlo)
- **Break-Even Calculator**: Including spread, slippage, and fees
- **Monte Carlo Simulator**: Trade sequence simulation with probability analysis

### 🤖 AI Market Intelligence
- **Multi-Layer Analysis**:
  - Structural Layer: Market structure, BOS, liquidity zones, supply/demand clusters
  - Statistical Layer: Volatility clustering, momentum scoring, mean reversion
  - Predictive Layer: Breakout & reversal probability, regime shift detection
- **BUY/SELL/WAIT Signals**: With confidence scores and probability metrics
- **Explainable AI**: Full reasoning for each signal generated
- **Entry/SL/TP Recommendations**: AI-calculated optimal levels

### 📈 Professional Trading Terminal UI
- **Dark/Light Mode**: Professional theme toggle
- **Advanced Chart**: Real-time price chart with Bollinger Bands and moving averages
- **Signal Center**: AI signal display with confidence bars and reasoning
- **Market Heatmap**: Color-coded volatility and momentum visualization
- **Sentiment Gauge**: Bullish/Bearish sentiment meter
- **Portfolio Dashboard**: P/L summary, positions, and risk metrics
- **Responsive Design**: Desktop, tablet, and mobile support

## 🛠️ Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript 5.0
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **UI Components**: shadcn/ui
- **AI Engine**: Custom-built quantitative analysis library

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── market/
│   │   │   ├── quote/route.ts      # Real-time quotes API
│   │   │   └── history/route.ts    # Historical data API
│   │   └── ai/
│   │       └── signal/route.ts     # AI signal generation API
│   ├── globals.css                  # Global styles
│   ├── layout.tsx                   # Root layout
│   └── page.tsx                     # Main trading terminal
├── components/
│   └── ui/                          # shadcn/ui components
├── hooks/
│   └── use-market-data.ts           # Custom hooks for data management
├── lib/
│   ├── ai-engine.ts                 # AI analysis and signal generation
│   ├── quant.ts                     # Quantitative calculations
│   └── technical-analysis.ts        # Technical indicators
└── types/
    └── trading.ts                   # TypeScript type definitions
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or bun

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/elite-ai-trading.git

# Navigate to project directory
cd elite-ai-trading

# Install dependencies
bun install

# Create environment file
cp .env.example .env.local

# Start development server
bun run dev
```

### Environment Variables

Create a `.env.local` file with the following variables:

```env
PRIME_API_KEY=your_prime_api_key
GITHUB_TOKEN=your_github_token
```

## 📊 Quantitative Analysis Library

### Position Sizing

```typescript
import { calculatePositionSize } from '@/lib/quant';

const result = calculatePositionSize({
  accountBalance: 10000,
  riskPercent: 2,
  entryPrice: 1.0850,
  stopLoss: 1.0800,
  instrumentType: 'forex',
});
// Returns: positionSize, lots, riskAmount, pipDistance
```

### Value at Risk (VaR)

```typescript
import { calculateVaR } from '@/lib/quant';

const var = calculateVaR({
  portfolioValue: 100000,
  confidenceLevel: 0.95,
  timeHorizon: 1,
  volatility: 0.15,
});
// Returns: varParametric, varHistorical, varMonteCarlo, expectedShortfall
```

### Kelly Criterion

```typescript
import { calculateKellyCriterion } from '@/lib/quant';

const kelly = calculateKellyCriterion({
  winProbability: 0.55,
  winLossRatio: 1.5,
});
// Returns optimal position size percentage
```

## 🤖 AI Signal Generation

The AI engine provides comprehensive market analysis:

```typescript
import { performAIAnalysis } from '@/lib/ai-engine';

const analysis = performAIAnalysis(symbol, candles, timeframe);
// Returns: market structure, indicators, sentiment, and trading signal
```

### Signal Output

```typescript
interface Signal {
  symbol: string;
  type: 'BUY' | 'SELL' | 'WAIT';
  confidence: number;      // 0-100
  probability: number;     // 0-100
  entry?: number;
  stopLoss?: number;
  takeProfit?: number;
  riskReward?: number;
  reasoning: string[];
}
```

## 📈 Technical Indicators

Built-in technical analysis library includes:

- Moving Averages (SMA, EMA, WMA)
- RSI (Relative Strength Index)
- MACD (Moving Average Convergence Divergence)
- Bollinger Bands
- ADX (Average Directional Index)
- Stochastic Oscillator
- Support & Resistance Detection
- Trend Detection
- Candlestick Pattern Recognition

## 🎨 Customization

### Theme Colors

Modify the color scheme in `src/app/page.tsx`:

```typescript
const colors = {
  dark: {
    bg: '#0a0a0f',
    card: '#111118',
    border: '#1e1e2e',
    accent: {
      buy: '#00c853',
      sell: '#ff1744',
      blue: '#2979ff',
    },
  },
  // ... light theme
};
```

### Adding New Assets

Add new trading instruments in `src/types/trading.ts`:

```typescript
export const FOREX_PAIRS = [
  { symbol: 'EURUSD', name: 'EUR/USD', pipValue: 0.0001 },
  // Add more pairs...
];
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with Next.js and React
- UI components from shadcn/ui
- Charts powered by Recharts
- Inspired by Bloomberg Terminal and TradingView Pro

---

**Built with ❤️ for professional traders and quantitative analysts**
