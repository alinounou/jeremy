'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  TrendingUp, TrendingDown, Activity, Brain, Calculator, 
  BarChart3, PieChart, Zap, Target, Shield, AlertTriangle,
  ChevronUp, ChevronDown, Minus, RefreshCw, Sun, Moon,
  Settings, Bell, User, Search, Menu, X, Eye, EyeOff,
  DollarSign, Percent, BarChart2, TrendingUp as TrendingUpIcon
} from 'lucide-react';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ComposedChart, Legend, PieChart as RechartsPie, Pie, Cell
} from 'recharts';
import { useMarketData, useHistoricalData, useAISignal, useTheme, usePortfolio, useRiskMetrics } from '@/hooks/use-market-data';
import { Ticker, Signal } from '@/types/trading';
import { calculatePositionSize, calculateVaR, calculateKellyCriterion, calculateBreakEven } from '@/lib/quant';

// Theme colors
const colors = {
  dark: {
    bg: '#0a0a0f',
    card: '#111118',
    border: '#1e1e2e',
    text: '#ffffff',
    textSecondary: '#8b8b9e',
    accent: {
      buy: '#00c853',
      sell: '#ff1744',
      blue: '#2979ff',
      purple: '#7c4dff',
      orange: '#ff9100',
      cyan: '#00b8d4',
    },
  },
  light: {
    bg: '#f5f5f7',
    card: '#ffffff',
    border: '#e0e0e0',
    text: '#1a1a1a',
    textSecondary: '#666666',
    accent: {
      buy: '#00c853',
      sell: '#ff1744',
      blue: '#2979ff',
      purple: '#7c4dff',
      orange: '#ff9100',
      cyan: '#00b8d4',
    },
  },
};

// ==================== HEADER COMPONENT ====================
function Header({ theme, toggleTheme }: { theme: 'dark' | 'light'; toggleTheme: () => void }) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const themeColors = colors[theme];

  return (
    <header className="flex items-center justify-between px-4 py-2 border-b" style={{ 
      backgroundColor: themeColors.card, 
      borderColor: themeColors.border 
    }}>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ 
            background: `linear-gradient(135deg, ${themeColors.accent.blue}, ${themeColors.accent.purple})` 
          }}>
            <Zap size={18} className="text-white" />
          </div>
          <span className="font-bold text-lg" style={{ color: themeColors.text }}>
            ELITE AI TRADING
          </span>
        </div>
        
        <div className="flex items-center gap-2 px-3 py-1 rounded-full text-xs" style={{ 
          backgroundColor: isConnected ? 'rgba(0, 200, 83, 0.1)' : 'rgba(255, 23, 68, 0.1)',
          color: isConnected ? themeColors.accent.buy : themeColors.accent.sell
        }}>
          <Activity size={12} />
          <span>{isConnected ? 'LIVE' : 'DISCONNECTED'}</span>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="text-sm" style={{ color: themeColors.textSecondary }}>
          {currentTime.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} {' '}
          {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-lg transition-all hover:scale-105"
            style={{ backgroundColor: themeColors.border, color: themeColors.text }}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button className="p-2 rounded-lg" style={{ backgroundColor: themeColors.border, color: themeColors.text }}>
            <Bell size={18} />
          </button>
          <button className="p-2 rounded-lg" style={{ backgroundColor: themeColors.border, color: themeColors.text }}>
            <Settings size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}

// ==================== MARKET WATCH COMPONENT ====================
function MarketWatch({ 
  theme, 
  selectedSymbol, 
  onSelectSymbol 
}: { 
  theme: 'dark' | 'light'; 
  selectedSymbol: string;
  onSelectSymbol: (symbol: string) => void;
}) {
  const { tickers, getTickersByType } = useMarketData();
  const themeColors = colors[theme];
  const [activeTab, setActiveTab] = useState<'forex' | 'crypto' | 'stock' | 'index' | 'metal'>('forex');

  const filteredTickers = useMemo(() => {
    return getTickersByType(activeTab).slice(0, 8);
  }, [getTickersByType, activeTab]);

  const formatPrice = (price: number, symbol: string) => {
    if (symbol.includes('JPY')) return price.toFixed(2);
    if (symbol.includes('BTC')) return price.toFixed(0);
    if (symbol.includes('XAU') || symbol.includes('XAG')) return price.toFixed(2);
    if (price >= 1000) return price.toFixed(2);
    return price.toFixed(5);
  };

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: themeColors.card }}>
      <div className="p-3 border-b" style={{ borderColor: themeColors.border }}>
        <h2 className="text-sm font-semibold mb-3" style={{ color: themeColors.text }}>MARKET WATCH</h2>
        <div className="flex flex-wrap gap-1">
          {(['forex', 'crypto', 'stock', 'metal', 'index'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="px-2 py-1 text-xs rounded transition-all"
              style={{
                backgroundColor: activeTab === tab ? themeColors.accent.blue : 'transparent',
                color: activeTab === tab ? 'white' : themeColors.textSecondary,
              }}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredTickers.map((ticker) => (
          <div
            key={ticker.symbol}
            onClick={() => onSelectSymbol(ticker.symbol)}
            className="flex items-center justify-between p-3 cursor-pointer transition-all hover:bg-opacity-50"
            style={{
              backgroundColor: selectedSymbol === ticker.symbol ? themeColors.border : 'transparent',
              borderBottom: `1px solid ${themeColors.border}`,
            }}
          >
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm" style={{ color: themeColors.text }}>
                  {ticker.name}
                </span>
              </div>
              <span className="text-xs" style={{ color: themeColors.textSecondary }}>
                {ticker.symbol}
              </span>
            </div>
            
            <div className="text-right">
              <div className="font-mono text-sm" style={{ color: themeColors.text }}>
                {formatPrice(ticker.price, ticker.symbol)}
              </div>
              <div className="flex items-center justify-end gap-1">
                {ticker.changePercent >= 0 ? (
                  <TrendingUp size={12} style={{ color: themeColors.accent.buy }} />
                ) : (
                  <TrendingDown size={12} style={{ color: themeColors.accent.sell }} />
                )}
                <span
                  className="text-xs font-mono"
                  style={{
                    color: ticker.changePercent >= 0 ? themeColors.accent.buy : themeColors.accent.sell,
                  }}
                >
                  {ticker.changePercent >= 0 ? '+' : ''}{ticker.changePercent.toFixed(2)}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==================== TRADING CHART COMPONENT ====================
function TradingChart({ 
  theme, 
  symbol 
}: { 
  theme: 'dark' | 'light'; 
  symbol: string;
}) {
  const { candles, isLoading } = useHistoricalData(symbol, '1h', 100);
  const themeColors = colors[theme];
  const [timeframe, setTimeframe] = useState('1h');
  const { tickers } = useMarketData();
  
  const currentTicker = tickers.find(t => t.symbol === symbol);

  const chartData = useMemo(() => {
    return candles.map((candle, index) => ({
      time: new Date(candle.time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      open: candle.open,
      high: candle.high,
      low: candle.low,
      close: candle.close,
      volume: candle.volume,
      ma20: index > 19 ? candles.slice(index - 19, index + 1).reduce((sum, c) => sum + c.close, 0) / 20 : null,
    }));
  }, [candles]);

  const priceChange = currentTicker?.changePercent || 0;

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center" style={{ backgroundColor: themeColors.card }}>
        <RefreshCw className="animate-spin" size={24} style={{ color: themeColors.accent.blue }} />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: themeColors.card }}>
      {/* Chart Header */}
      <div className="flex items-center justify-between p-3 border-b" style={{ borderColor: themeColors.border }}>
        <div className="flex items-center gap-4">
          <div>
            <h3 className="font-bold" style={{ color: themeColors.text }}>{symbol}</h3>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-mono" style={{ color: themeColors.text }}>
                {currentTicker?.price?.toFixed(symbol.includes('JPY') ? 2 : 5) || '0.00000'}
              </span>
              <span 
                className="text-sm px-2 py-0.5 rounded"
                style={{ 
                  backgroundColor: priceChange >= 0 ? 'rgba(0, 200, 83, 0.1)' : 'rgba(255, 23, 68, 0.1)',
                  color: priceChange >= 0 ? themeColors.accent.buy : themeColors.accent.sell,
                }}
              >
                {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {['1m', '5m', '15m', '1h', '4h', '1d'].map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className="px-2 py-1 text-xs rounded transition-all"
              style={{
                backgroundColor: timeframe === tf ? themeColors.accent.blue : 'transparent',
                color: timeframe === tf ? 'white' : themeColors.textSecondary,
              }}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Area */}
      <div className="flex-1 p-2">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData}>
            <defs>
              <linearGradient id="colorClose" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={themeColors.accent.blue} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={themeColors.accent.blue} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={themeColors.border} opacity={0.3} />
            <XAxis 
              dataKey="time" 
              stroke={themeColors.textSecondary} 
              fontSize={10}
              tickLine={false}
            />
            <YAxis 
              stroke={themeColors.textSecondary} 
              fontSize={10}
              tickLine={false}
              domain={['auto', 'auto']}
              orientation="right"
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: themeColors.card,
                border: `1px solid ${themeColors.border}`,
                borderRadius: '8px',
                color: themeColors.text,
              }}
            />
            <Area
              type="monotone"
              dataKey="close"
              stroke={themeColors.accent.blue}
              fill="url(#colorClose)"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="ma20"
              stroke={themeColors.accent.orange}
              strokeWidth={1}
              strokeDasharray="5 5"
              dot={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Volume */}
      <div className="h-16 px-2 pb-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData.slice(-50)}>
            <Bar 
              dataKey="volume" 
              fill={themeColors.accent.blue}
              opacity={0.5}
              radius={[2, 2, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ==================== SIGNAL CENTER COMPONENT ====================
function SignalCenter({ 
  theme, 
  symbol 
}: { 
  theme: 'dark' | 'light'; 
  symbol: string;
}) {
  const { analysis, isLoading } = useAISignal(symbol);
  const themeColors = colors[theme];

  if (isLoading || !analysis) {
    return (
      <div className="h-full flex items-center justify-center" style={{ backgroundColor: themeColors.card }}>
        <Brain className="animate-pulse" size={32} style={{ color: themeColors.accent.purple }} />
      </div>
    );
  }

  const signal = analysis.signal;
  const signalColor = signal.type === 'BUY' ? themeColors.accent.buy :
                      signal.type === 'SELL' ? themeColors.accent.sell :
                      themeColors.accent.orange;

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: themeColors.card }}>
      <div className="p-3 border-b" style={{ borderColor: themeColors.border }}>
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold" style={{ color: themeColors.text }}>AI SIGNAL CENTER</h2>
          <div className="flex items-center gap-1 px-2 py-1 rounded" style={{ backgroundColor: themeColors.border }}>
            <Brain size={14} style={{ color: themeColors.accent.purple }} />
            <span className="text-xs" style={{ color: themeColors.accent.purple }}>AI ACTIVE</span>
          </div>
        </div>
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        {/* Main Signal */}
        <div className="text-center mb-6">
          <div 
            className="inline-block px-6 py-3 rounded-xl text-2xl font-bold mb-2"
            style={{ 
              backgroundColor: `${signalColor}20`,
              color: signalColor,
              boxShadow: `0 0 30px ${signalColor}30`,
            }}
          >
            {signal.type}
          </div>
          <div className="flex items-center justify-center gap-2">
            <span className="text-sm" style={{ color: themeColors.textSecondary }}>Confidence:</span>
            <span className="font-mono text-lg" style={{ color: themeColors.text }}>
              {signal.confidence.toFixed(1)}%
            </span>
          </div>
        </div>

        {/* Probability Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-xs mb-1" style={{ color: themeColors.textSecondary }}>
            <span>Probability</span>
            <span>{signal.probability.toFixed(1)}%</span>
          </div>
          <div className="h-3 rounded-full overflow-hidden" style={{ backgroundColor: themeColors.border }}>
            <div 
              className="h-full rounded-full transition-all duration-500"
              style={{ 
                width: `${signal.probability}%`,
                backgroundColor: signalColor,
              }}
            />
          </div>
        </div>

        {/* Entry/SL/TP */}
        {signal.entry && (
          <div className="grid grid-cols-3 gap-2 mb-6">
            <div className="p-2 rounded-lg text-center" style={{ backgroundColor: themeColors.border }}>
              <div className="text-xs mb-1" style={{ color: themeColors.textSecondary }}>ENTRY</div>
              <div className="font-mono text-sm" style={{ color: themeColors.text }}>
                {signal.entry.toFixed(5)}
              </div>
            </div>
            <div className="p-2 rounded-lg text-center" style={{ backgroundColor: themeColors.border }}>
              <div className="text-xs mb-1" style={{ color: themeColors.accent.sell }}>STOP LOSS</div>
              <div className="font-mono text-sm" style={{ color: themeColors.accent.sell }}>
                {signal.stopLoss?.toFixed(5)}
              </div>
            </div>
            <div className="p-2 rounded-lg text-center" style={{ backgroundColor: themeColors.border }}>
              <div className="text-xs mb-1" style={{ color: themeColors.accent.buy }}>TAKE PROFIT</div>
              <div className="font-mono text-sm" style={{ color: themeColors.accent.buy }}>
                {signal.takeProfit?.toFixed(5)}
              </div>
            </div>
          </div>
        )}

        {/* Risk/Reward */}
        {signal.riskReward && (
          <div className="flex items-center justify-between p-2 rounded-lg mb-4" style={{ backgroundColor: themeColors.border }}>
            <span className="text-xs" style={{ color: themeColors.textSecondary }}>Risk/Reward Ratio</span>
            <span className="font-mono font-bold" style={{ color: themeColors.accent.cyan }}>
              1:{signal.riskReward}
            </span>
          </div>
        )}

        {/* AI Reasoning */}
        <div className="mt-4">
          <div className="text-xs font-semibold mb-2" style={{ color: themeColors.textSecondary }}>
            AI ANALYSIS REASONING
          </div>
          <div className="space-y-1">
            {signal.reasoning.map((reason, index) => (
              <div 
                key={index}
                className="flex items-start gap-2 text-xs p-2 rounded"
                style={{ backgroundColor: themeColors.border }}
              >
                <Zap size={12} className="mt-0.5 flex-shrink-0" style={{ color: themeColors.accent.blue }} />
                <span style={{ color: themeColors.text }}>{reason}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Market Structure */}
        <div className="mt-4 p-3 rounded-lg" style={{ backgroundColor: themeColors.border }}>
          <div className="text-xs font-semibold mb-2" style={{ color: themeColors.textSecondary }}>
            MARKET STRUCTURE
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span style={{ color: themeColors.textSecondary }}>Trend: </span>
              <span style={{ 
                color: analysis.marketStructure.trend === 'bullish' ? themeColors.accent.buy : 
                       analysis.marketStructure.trend === 'bearish' ? themeColors.accent.sell : 
                       themeColors.accent.orange 
              }}>
                {analysis.marketStructure.trend.toUpperCase()}
              </span>
            </div>
            <div>
              <span style={{ color: themeColors.textSecondary }}>Phase: </span>
              <span style={{ color: themeColors.accent.cyan }}>
                {analysis.marketStructure.phase.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==================== QUANT CALCULATORS PANEL ====================
function QuantCalculatorsPanel({ theme }: { theme: 'dark' | 'light' }) {
  const themeColors = colors[theme];
  const [activeCalc, setActiveCalc] = useState<'position' | 'var' | 'kelly' | 'breakeven'>('position');
  
  // Position Sizing State
  const [posInputs, setPosInputs] = useState({
    balance: 10000,
    riskPercent: 2,
    entry: 1.0850,
    stopLoss: 1.0800,
  });
  
  // Kelly State
  const [kellyInputs, setKellyInputs] = useState({
    winProbability: 0.55,
    winLossRatio: 1.5,
  });

  const positionResult = calculatePositionSize({
    accountBalance: posInputs.balance,
    riskPercent: posInputs.riskPercent,
    entryPrice: posInputs.entry,
    stopLoss: posInputs.stopLoss,
    instrumentType: 'forex',
  });

  const kellyResult = calculateKellyCriterion(kellyInputs);

  const calculators = [
    { id: 'position', label: 'Position Size', icon: Target },
    { id: 'var', label: 'VaR', icon: Shield },
    { id: 'kelly', label: 'Kelly', icon: Percent },
    { id: 'breakeven', label: 'Break-Even', icon: DollarSign },
  ];

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: themeColors.card }}>
      <div className="p-3 border-b" style={{ borderColor: themeColors.border }}>
        <h2 className="text-sm font-semibold mb-2" style={{ color: themeColors.text }}>QUANT CALCULATORS</h2>
        <div className="flex flex-wrap gap-1">
          {calculators.map((calc) => (
            <button
              key={calc.id}
              onClick={() => setActiveCalc(calc.id as typeof activeCalc)}
              className="flex items-center gap-1 px-2 py-1 text-xs rounded transition-all"
              style={{
                backgroundColor: activeCalc === calc.id ? themeColors.accent.blue : 'transparent',
                color: activeCalc === calc.id ? 'white' : themeColors.textSecondary,
              }}
            >
              <calc.icon size={12} />
              {calc.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 p-3 overflow-y-auto">
        {activeCalc === 'position' && (
          <div className="space-y-4">
            <div>
              <label className="text-xs block mb-1" style={{ color: themeColors.textSecondary }}>
                Account Balance ($)
              </label>
              <input
                type="number"
                value={posInputs.balance}
                onChange={(e) => setPosInputs({ ...posInputs, balance: Number(e.target.value) })}
                className="w-full p-2 rounded text-sm font-mono"
                style={{ 
                  backgroundColor: themeColors.border, 
                  color: themeColors.text,
                  border: 'none',
                  outline: 'none',
                }}
              />
            </div>
            
            <div>
              <label className="text-xs block mb-1" style={{ color: themeColors.textSecondary }}>
                Risk Percentage (%)
              </label>
              <input
                type="number"
                value={posInputs.riskPercent}
                onChange={(e) => setPosInputs({ ...posInputs, riskPercent: Number(e.target.value) })}
                className="w-full p-2 rounded text-sm font-mono"
                style={{ 
                  backgroundColor: themeColors.border, 
                  color: themeColors.text,
                  border: 'none',
                  outline: 'none',
                }}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs block mb-1" style={{ color: themeColors.textSecondary }}>
                  Entry Price
                </label>
                <input
                  type="number"
                  step="0.00001"
                  value={posInputs.entry}
                  onChange={(e) => setPosInputs({ ...posInputs, entry: Number(e.target.value) })}
                  className="w-full p-2 rounded text-sm font-mono"
                  style={{ 
                    backgroundColor: themeColors.border, 
                    color: themeColors.text,
                    border: 'none',
                    outline: 'none',
                  }}
                />
              </div>
              <div>
                <label className="text-xs block mb-1" style={{ color: themeColors.textSecondary }}>
                  Stop Loss
                </label>
                <input
                  type="number"
                  step="0.00001"
                  value={posInputs.stopLoss}
                  onChange={(e) => setPosInputs({ ...posInputs, stopLoss: Number(e.target.value) })}
                  className="w-full p-2 rounded text-sm font-mono"
                  style={{ 
                    backgroundColor: themeColors.border, 
                    color: themeColors.text,
                    border: 'none',
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            {/* Results */}
            <div className="p-3 rounded-lg space-y-2" style={{ backgroundColor: themeColors.border }}>
              <div className="text-xs font-semibold" style={{ color: themeColors.accent.blue }}>RESULTS</div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span style={{ color: themeColors.textSecondary }}>Position Size:</span>
                  <div className="font-mono" style={{ color: themeColors.text }}>
                    {positionResult.positionSize.toFixed(0)} units
                  </div>
                </div>
                <div>
                  <span style={{ color: themeColors.textSecondary }}>Lots:</span>
                  <div className="font-mono" style={{ color: themeColors.text }}>
                    {positionResult.lots.toFixed(2)}
                  </div>
                </div>
                <div>
                  <span style={{ color: themeColors.textSecondary }}>Risk Amount:</span>
                  <div className="font-mono" style={{ color: themeColors.accent.sell }}>
                    ${positionResult.riskAmount.toFixed(2)}
                  </div>
                </div>
                <div>
                  <span style={{ color: themeColors.textSecondary }}>Pip Distance:</span>
                  <div className="font-mono" style={{ color: themeColors.text }}>
                    {positionResult.pipDistance.toFixed(1)} pips
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeCalc === 'kelly' && (
          <div className="space-y-4">
            <div>
              <label className="text-xs block mb-1" style={{ color: themeColors.textSecondary }}>
                Win Probability (%)
              </label>
              <input
                type="number"
                step="0.01"
                value={kellyInputs.winProbability * 100}
                onChange={(e) => setKellyInputs({ ...kellyInputs, winProbability: Number(e.target.value) / 100 })}
                className="w-full p-2 rounded text-sm font-mono"
                style={{ 
                  backgroundColor: themeColors.border, 
                  color: themeColors.text,
                  border: 'none',
                  outline: 'none',
                }}
              />
            </div>
            
            <div>
              <label className="text-xs block mb-1" style={{ color: themeColors.textSecondary }}>
                Win/Loss Ratio
              </label>
              <input
                type="number"
                step="0.1"
                value={kellyInputs.winLossRatio}
                onChange={(e) => setKellyInputs({ ...kellyInputs, winLossRatio: Number(e.target.value) })}
                className="w-full p-2 rounded text-sm font-mono"
                style={{ 
                  backgroundColor: themeColors.border, 
                  color: themeColors.text,
                  border: 'none',
                  outline: 'none',
                }}
              />
            </div>

            <div className="p-3 rounded-lg" style={{ backgroundColor: themeColors.border }}>
              <div className="text-xs font-semibold mb-2" style={{ color: themeColors.accent.purple }}>KELLY CRITERION</div>
              <div className="text-center">
                <div className="text-3xl font-mono font-bold" style={{ 
                  color: kellyResult > 0 ? themeColors.accent.buy : themeColors.accent.sell 
                }}>
                  {(kellyResult * 100).toFixed(2)}%
                </div>
                <div className="text-xs mt-1" style={{ color: themeColors.textSecondary }}>
                  Optimal Position Size
                </div>
              </div>
              <div className="mt-3 text-xs p-2 rounded" style={{ backgroundColor: themeColors.bg }}>
                <div style={{ color: themeColors.textSecondary }}>
                  Half Kelly (Recommended): <span className="font-mono" style={{ color: themeColors.accent.cyan }}>
                    {(kellyResult * 50).toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeCalc === 'var' && (
          <div className="space-y-4">
            <div className="p-3 rounded-lg" style={{ backgroundColor: themeColors.border }}>
              <div className="text-xs font-semibold mb-3" style={{ color: themeColors.accent.orange }}>
                VALUE AT RISK (VaR)
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs" style={{ color: themeColors.textSecondary }}>95% VaR (1 Day)</span>
                  <span className="font-mono text-sm" style={{ color: themeColors.accent.sell }}>
                    -$2,450
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs" style={{ color: themeColors.textSecondary }}>99% VaR (1 Day)</span>
                  <span className="font-mono text-sm" style={{ color: themeColors.accent.sell }}>
                    -$3,520
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs" style={{ color: themeColors.textSecondary }}>Expected Shortfall</span>
                  <span className="font-mono text-sm" style={{ color: themeColors.accent.sell }}>
                    -$4,180
                  </span>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-lg" style={{ backgroundColor: themeColors.border }}>
              <div className="text-xs font-semibold mb-3" style={{ color: themeColors.accent.blue }}>
                STRESS TEST SCENARIOS
              </div>
              <div className="space-y-2 text-xs">
                {[
                  { name: 'Market Crash (-20%)', impact: -8500 },
                  { name: 'Flash Crash (-10%)', impact: -4250 },
                  { name: 'Volatility Spike', impact: -2100 },
                ].map((scenario, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <span style={{ color: themeColors.textSecondary }}>{scenario.name}</span>
                    <span className="font-mono" style={{ color: themeColors.accent.sell }}>
                      ${scenario.impact.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeCalc === 'breakeven' && (
          <div className="space-y-4">
            <div className="p-3 rounded-lg" style={{ backgroundColor: themeColors.border }}>
              <div className="text-xs font-semibold mb-3" style={{ color: themeColors.accent.cyan }}>
                BREAK-EVEN ANALYSIS
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs" style={{ color: themeColors.textSecondary }}>Spread Cost</span>
                  <span className="font-mono text-sm" style={{ color: themeColors.text }}>1.5 pips</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs" style={{ color: themeColors.textSecondary }}>Commission</span>
                  <span className="font-mono text-sm" style={{ color: themeColors.text }}>$7.00</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs" style={{ color: themeColors.textSecondary }}>Slippage (Est.)</span>
                  <span className="font-mono text-sm" style={{ color: themeColors.text }}>0.5 pips</span>
                </div>
                <div className="border-t pt-2" style={{ borderColor: themeColors.bg }}>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold" style={{ color: themeColors.textSecondary }}>
                      Points to Break-Even
                    </span>
                    <span className="font-mono text-lg" style={{ color: themeColors.accent.orange }}>
                      2.2 pips
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ==================== PORTFOLIO DASHBOARD ====================
function PortfolioDashboard({ theme }: { theme: 'dark' | 'light' }) {
  const { portfolio, positions } = usePortfolio();
  const riskMetrics = useRiskMetrics();
  const themeColors = colors[theme];

  const pieData = [
    { name: 'Forex', value: 45, color: themeColors.accent.blue },
    { name: 'Crypto', value: 25, color: themeColors.accent.purple },
    { name: 'Metals', value: 20, color: themeColors.accent.orange },
    { name: 'Stocks', value: 10, color: themeColors.accent.cyan },
  ];

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: themeColors.card }}>
      <div className="p-3 border-b" style={{ borderColor: themeColors.border }}>
        <h2 className="text-sm font-semibold" style={{ color: themeColors.text }}>PORTFOLIO & RISK DASHBOARD</h2>
      </div>

      <div className="flex-1 p-3 overflow-y-auto">
        {/* Balance Overview */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          {[
            { label: 'Balance', value: `$${portfolio.totalBalance.toLocaleString()}`, color: themeColors.text },
            { label: 'Equity', value: `$${portfolio.equity.toLocaleString()}`, color: themeColors.text },
            { label: 'P/L Today', value: `$${portfolio.dailyPnl.toFixed(0)}`, color: portfolio.dailyPnl >= 0 ? themeColors.accent.buy : themeColors.accent.sell },
            { label: 'P/L Week', value: `$${portfolio.weeklyPnl.toFixed(0)}`, color: portfolio.weeklyPnl >= 0 ? themeColors.accent.buy : themeColors.accent.sell },
          ].map((item, i) => (
            <div key={i} className="p-2 rounded-lg text-center" style={{ backgroundColor: themeColors.border }}>
              <div className="text-xs" style={{ color: themeColors.textSecondary }}>{item.label}</div>
              <div className="font-mono font-bold text-sm" style={{ color: item.color }}>{item.value}</div>
            </div>
          ))}
        </div>

        {/* Risk Metrics */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {[
            { label: 'Sharpe Ratio', value: riskMetrics.sharpeRatio.toFixed(2), color: riskMetrics.sharpeRatio > 1 ? themeColors.accent.buy : themeColors.accent.orange },
            { label: 'Max Drawdown', value: `${riskMetrics.maxDrawdown.toFixed(1)}%`, color: themeColors.accent.sell },
            { label: 'Win Rate', value: `${riskMetrics.winRate.toFixed(1)}%`, color: riskMetrics.winRate > 50 ? themeColors.accent.buy : themeColors.accent.sell },
          ].map((item, i) => (
            <div key={i} className="p-2 rounded-lg text-center" style={{ backgroundColor: themeColors.border }}>
              <div className="text-xs" style={{ color: themeColors.textSecondary }}>{item.label}</div>
              <div className="font-mono font-bold" style={{ color: item.color }}>{item.value}</div>
            </div>
          ))}
        </div>

        {/* Open Positions */}
        <div className="mb-4">
          <div className="text-xs font-semibold mb-2" style={{ color: themeColors.textSecondary }}>OPEN POSITIONS</div>
          <div className="space-y-1">
            {positions.map((pos) => (
              <div 
                key={pos.id}
                className="flex items-center justify-between p-2 rounded-lg"
                style={{ backgroundColor: themeColors.border }}
              >
                <div className="flex items-center gap-2">
                  <span 
                    className="px-2 py-0.5 rounded text-xs font-bold"
                    style={{ 
                      backgroundColor: pos.type === 'long' ? `${themeColors.accent.buy}20` : `${themeColors.accent.sell}20`,
                      color: pos.type === 'long' ? themeColors.accent.buy : themeColors.accent.sell,
                    }}
                  >
                    {pos.type.toUpperCase()}
                  </span>
                  <span className="font-medium text-sm" style={{ color: themeColors.text }}>{pos.symbol}</span>
                </div>
                <div className="text-right">
                  <div className="font-mono text-sm" style={{ 
                    color: pos.pnl >= 0 ? themeColors.accent.buy : themeColors.accent.sell 
                  }}>
                    ${pos.pnl.toFixed(0)}
                  </div>
                  <div className="text-xs" style={{ color: themeColors.textSecondary }}>
                    {pos.pnlPercent.toFixed(2)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Allocation Pie Chart */}
        <div className="flex items-center gap-4">
          <div className="w-24 h-24">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPie>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={25}
                  outerRadius={40}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
              </RechartsPie>
            </ResponsiveContainer>
          </div>
          <div className="flex-1 space-y-1">
            {pieData.map((item, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span style={{ color: themeColors.textSecondary }}>{item.name}</span>
                </div>
                <span className="font-mono" style={{ color: themeColors.text }}>{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ==================== HEATMAP COMPONENT ====================
function Heatmap({ theme }: { theme: 'dark' | 'light' }) {
  const { tickers } = useMarketData();
  const themeColors = colors[theme];

  const heatmapData = useMemo(() => {
    return tickers.slice(0, 12).map(ticker => ({
      symbol: ticker.symbol,
      name: ticker.name,
      change: ticker.changePercent,
      color: ticker.changePercent >= 2 ? '#00c853' :
             ticker.changePercent >= 1 ? '#69f0ae' :
             ticker.changePercent >= 0 ? '#b9f6ca' :
             ticker.changePercent >= -1 ? '#ff8a80' :
             ticker.changePercent >= -2 ? '#ff5252' :
             '#ff1744',
    }));
  }, [tickers]);

  return (
    <div className="p-3" style={{ backgroundColor: themeColors.card }}>
      <h2 className="text-sm font-semibold mb-3" style={{ color: themeColors.text }}>MARKET HEATMAP</h2>
      <div className="grid grid-cols-6 gap-1">
        {heatmapData.map((item, i) => (
          <div
            key={i}
            className="p-2 rounded text-center cursor-pointer transition-all hover:scale-105"
            style={{ backgroundColor: item.color + '30', border: `1px solid ${item.color}` }}
          >
            <div className="text-xs font-medium" style={{ color: themeColors.text }}>{item.symbol}</div>
            <div className="text-xs font-mono" style={{ 
              color: item.change >= 0 ? themeColors.accent.buy : themeColors.accent.sell 
            }}>
              {item.change >= 0 ? '+' : ''}{item.change.toFixed(2)}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==================== SENTIMENT GAUGE ====================
function SentimentGauge({ theme }: { theme: 'dark' | 'light' }) {
  const { analysis } = useAISignal('EURUSD');
  const themeColors = colors[theme];

  const sentiment = analysis?.sentiment.overall || 0;
  const angle = ((sentiment + 100) / 200) * 180 - 90;

  return (
    <div className="p-3" style={{ backgroundColor: themeColors.card }}>
      <h2 className="text-sm font-semibold mb-3" style={{ color: themeColors.text }}>MARKET SENTIMENT</h2>
      <div className="relative h-20">
        <svg viewBox="0 0 200 100" className="w-full h-full">
          {/* Gauge Background */}
          <path
            d="M 20 90 A 80 80 0 0 1 180 90"
            fill="none"
            stroke={themeColors.border}
            strokeWidth="15"
            strokeLinecap="round"
          />
          {/* Gauge Fill */}
          <path
            d="M 20 90 A 80 80 0 0 1 180 90"
            fill="none"
            stroke={`url(#gaugeGradient-${theme})`}
            strokeWidth="15"
            strokeLinecap="round"
          />
          {/* Needle */}
          <line
            x1="100"
            y1="90"
            x2={100 + 60 * Math.cos((angle - 90) * Math.PI / 180)}
            y2={90 + 60 * Math.sin((angle - 90) * Math.PI / 180)}
            stroke={themeColors.text}
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle cx="100" cy="90" r="8" fill={themeColors.accent.blue} />
          <defs>
            <linearGradient id={`gaugeGradient-${theme}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={themeColors.accent.sell} />
              <stop offset="50%" stopColor={themeColors.accent.orange} />
              <stop offset="100%" stopColor={themeColors.accent.buy} />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute bottom-0 left-0 right-0 text-center">
          <span className="text-xs" style={{ color: themeColors.textSecondary }}>
            {sentiment > 20 ? 'BULLISH' : sentiment < -20 ? 'BEARISH' : 'NEUTRAL'}
          </span>
        </div>
      </div>
      <div className="flex justify-between text-xs mt-1" style={{ color: themeColors.textSecondary }}>
        <span>BEARISH</span>
        <span>NEUTRAL</span>
        <span>BULLISH</span>
      </div>
    </div>
  );
}

// ==================== MAIN PAGE COMPONENT ====================
export default function TradingPlatform() {
  const { theme, toggleTheme } = useTheme();
  const [selectedSymbol, setSelectedSymbol] = useState('EURUSD');
  const themeColors = colors[theme];

  return (
    <div 
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: themeColors.bg, color: themeColors.text }}
    >
      <Header theme={theme} toggleTheme={toggleTheme} />

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Market Watch */}
        <div className="w-64 border-r flex-shrink-0" style={{ borderColor: themeColors.border }}>
          <MarketWatch 
            theme={theme} 
            selectedSymbol={selectedSymbol}
            onSelectSymbol={setSelectedSymbol}
          />
        </div>

        {/* Center - Main Trading Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 flex overflow-hidden">
            {/* Chart */}
            <div className="flex-1 border-r" style={{ borderColor: themeColors.border }}>
              <TradingChart theme={theme} symbol={selectedSymbol} />
            </div>

            {/* Signal Center */}
            <div className="w-80 flex-shrink-0 border-r" style={{ borderColor: themeColors.border }}>
              <SignalCenter theme={theme} symbol={selectedSymbol} />
            </div>
          </div>

          {/* Bottom Section */}
          <div className="h-64 border-t" style={{ borderColor: themeColors.border }}>
            <div className="grid grid-cols-3 h-full">
              <Heatmap theme={theme} />
              <SentimentGauge theme={theme} />
              <PortfolioDashboard theme={theme} />
            </div>
          </div>
        </div>

        {/* Right Sidebar - Quant Calculators */}
        <div className="w-72 border-l flex-shrink-0" style={{ borderColor: themeColors.border }}>
          <QuantCalculatorsPanel theme={theme} />
        </div>
      </div>

      {/* Footer Status Bar */}
      <div 
        className="flex items-center justify-between px-4 py-1 text-xs border-t"
        style={{ backgroundColor: themeColors.card, borderColor: themeColors.border, color: themeColors.textSecondary }}
      >
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: themeColors.accent.buy }} />
            <span>Connected to Live Feed</span>
          </div>
          <span>|</span>
          <span>Latency: 12ms</span>
          <span>|</span>
          <span>Data Provider: Prime API</span>
        </div>
        <div className="flex items-center gap-4">
          <span>Build: Elite AI Trading Platform v2.0</span>
          <span>|</span>
          <span>Powered by z-ai-web-dev-sdk</span>
        </div>
      </div>
    </div>
  );
}
