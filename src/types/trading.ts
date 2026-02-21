// Trading Platform Types

export interface Ticker {
  symbol: string;
  name: string;
  type: 'forex' | 'crypto' | 'stock' | 'metal' | 'index';
  price: number;
  change: number;
  changePercent: number;
  bid?: number;
  ask?: number;
  high24h?: number;
  low24h?: number;
  volume?: number;
  sparkline?: number[];
}

export interface Candle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface MarketData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  timestamp: number;
}

export interface Position {
  id: string;
  symbol: string;
  type: 'long' | 'short';
  size: number;
  entryPrice: number;
  currentPrice: number;
  stopLoss?: number;
  takeProfit?: number;
  pnl: number;
  pnlPercent: number;
  openTime: number;
}

export interface Portfolio {
  totalBalance: number;
  equity: number;
  margin: number;
  freeMargin: number;
  marginLevel: number;
  unrealizedPnl: number;
  realizedPnl: number;
  dailyPnl: number;
  weeklyPnl: number;
  monthlyPnl: number;
}

export interface RiskMetrics {
  valueAtRisk: number;
  conditionalVaR: number;
  sharpeRatio: number;
  sortinoRatio: number;
  maxDrawdown: number;
  currentDrawdown: number;
  winRate: number;
  profitFactor: number;
  averageWin: number;
  averageLoss: number;
  riskRewardRatio: number;
}

export type SignalType = 'BUY' | 'SELL' | 'WAIT';

export interface Signal {
  symbol: string;
  type: SignalType;
  confidence: number;
  probability: number;
  entry?: number;
  stopLoss?: number;
  takeProfit?: number;
  riskReward?: number;
  reasoning: string[];
  timestamp: number;
  timeframe: string;
}

export interface Trade {
  id: string;
  symbol: string;
  type: 'long' | 'short';
  entryPrice: number;
  exitPrice?: number;
  size: number;
  pnl?: number;
  openTime: number;
  closeTime?: number;
  status: 'open' | 'closed';
}

export interface Performance {
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  winRate: number;
  avgWin: number;
  avgLoss: number;
  largestWin: number;
  largestLoss: number;
  profitFactor: number;
  expectancy: number;
  equityCurve: { date: string; value: number }[];
}

// Calculator Types
export interface PositionSizeInput {
  accountBalance: number;
  riskPercent: number;
  entryPrice: number;
  stopLoss: number;
  instrumentType: 'forex' | 'crypto' | 'stock';
  lotSize?: number;
  pipValue?: number;
}

export interface PositionSizeOutput {
  positionSize: number;
  lots: number;
  riskAmount: number;
  pipDistance: number;
  pipValue: number;
}

export interface VaRInput {
  portfolioValue: number;
  confidenceLevel: number;
  timeHorizon: number;
  volatility: number;
  returns?: number[];
}

export interface VaROutput {
  varParametric: number;
  varHistorical: number;
  varMonteCarlo: number;
  expectedShortfall: number;
}

export interface MonteCarloInput {
  initialCapital: number;
  expectedReturn: number;
  volatility: number;
  timeHorizon: number;
  simulations: number;
  trades: number;
}

export interface MonteCarloOutput {
  paths: number[][];
  finalValues: number[];
  probabilityOfRuin: number;
  expectedValue: number;
  valueAtRisk: number;
  percentile5: number;
  percentile95: number;
}

export interface KellyInput {
  winProbability: number;
  winLossRatio: number;
}

export interface BreakEvenInput {
  entryPrice: number;
  positionSize: number;
  spread: number;
  commission: number;
  slippage: number;
}

export interface BreakEvenOutput {
  breakEvenPrice: number;
  totalCost: number;
  effectiveEntry: number;
  pointsToBreakEven: number;
}

// Market Structure Types
export interface MarketStructure {
  trend: 'bullish' | 'bearish' | 'ranging';
  phase: 'accumulation' | 'markup' | 'distribution' | 'markdown';
  keyLevels: {
    resistance: number[];
    support: number[];
  };
  supplyZones: { high: number; low: number; strength: number }[];
  demandZones: { high: number; low: number; strength: number }[];
  liquidityZones: { price: number; type: 'buy' | 'sell'; strength: number }[];
}

// AI Analysis Types
export interface AIAnalysis {
  symbol: string;
  timestamp: number;
  marketStructure: MarketStructure;
  indicators: {
    rsi: number;
    rsiSignal: 'overbought' | 'oversold' | 'neutral';
    macd: { value: number; signal: number; histogram: number };
    macdSignal: 'bullish' | 'bearish' | 'neutral';
    sma20: number;
    sma50: number;
    sma200: number;
    ema12: number;
    ema26: number;
    bollingerBands: { upper: number; middle: number; lower: number };
    atr: number;
    adx: number;
    trendStrength: number;
  };
  sentiment: {
    overall: number; // -100 to 100
    momentum: number;
    volatility: number;
    trend: number;
  };
  signal: Signal;
}

// Asset class definitions
export const FOREX_PAIRS = [
  { symbol: 'EURUSD', name: 'EUR/USD', pipValue: 0.0001 },
  { symbol: 'GBPUSD', name: 'GBP/USD', pipValue: 0.0001 },
  { symbol: 'USDJPY', name: 'USD/JPY', pipValue: 0.01 },
  { symbol: 'USDCHF', name: 'USD/CHF', pipValue: 0.0001 },
  { symbol: 'AUDUSD', name: 'AUD/USD', pipValue: 0.0001 },
  { symbol: 'USDCAD', name: 'USD/CAD', pipValue: 0.0001 },
  { symbol: 'NZDUSD', name: 'NZD/USD', pipValue: 0.0001 },
  { symbol: 'XAUUSD', name: 'Gold', pipValue: 0.01 },
  { symbol: 'XAGUSD', name: 'Silver', pipValue: 0.001 },
];

export const CRYPTO_ASSETS = [
  { symbol: 'BTCUSD', name: 'Bitcoin', pipValue: 0.01 },
  { symbol: 'ETHUSD', name: 'Ethereum', pipValue: 0.01 },
  { symbol: 'BNBUSD', name: 'BNB', pipValue: 0.01 },
  { symbol: 'SOLUSD', name: 'Solana', pipValue: 0.001 },
  { symbol: 'XRPUSD', name: 'Ripple', pipValue: 0.0001 },
];

export const STOCKS = [
  { symbol: 'AAPL', name: 'Apple Inc.' },
  { symbol: 'MSFT', name: 'Microsoft' },
  { symbol: 'GOOGL', name: 'Alphabet' },
  { symbol: 'AMZN', name: 'Amazon' },
  { symbol: 'TSLA', name: 'Tesla' },
  { symbol: 'NVDA', name: 'NVIDIA' },
  { symbol: 'META', name: 'Meta' },
  { symbol: 'JPM', name: 'JPMorgan' },
];

export const INDICES = [
  { symbol: '^GSPC', name: 'S&P 500' },
  { symbol: '^DJI', name: 'Dow Jones' },
  { symbol: '^IXIC', name: 'NASDAQ' },
  { symbol: '^RUT', name: 'Russell 2000' },
  { symbol: '^VIX', name: 'VIX' },
];

// Default symbols for the platform
export const DEFAULT_SYMBOLS = [
  ...FOREX_PAIRS.map(p => ({ symbol: p.symbol, name: p.name, type: p.symbol.includes('XAU') || p.symbol.includes('XAG') ? 'metal' : 'forex', exchange: 'FX' })),
  ...CRYPTO_ASSETS.map(c => ({ symbol: c.symbol, name: c.name, type: 'crypto', exchange: 'Crypto' })),
  ...STOCKS.map(s => ({ symbol: s.symbol, name: s.name, type: 'stock', exchange: 'NASDAQ' })),
  ...INDICES.map(i => ({ symbol: i.symbol, name: i.name, type: 'index', exchange: 'US' })),
] as const;
