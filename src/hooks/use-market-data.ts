'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Ticker, Candle, AIAnalysis } from '@/types/trading';

// Simulated market data for demo
const MARKET_DATA: Record<string, Omit<Ticker, 'price' | 'change' | 'changePercent' | 'sparkline'>> = {
  'EURUSD': { symbol: 'EURUSD', name: 'EUR/USD', type: 'forex' },
  'GBPUSD': { symbol: 'GBPUSD', name: 'GBP/USD', type: 'forex' },
  'USDJPY': { symbol: 'USDJPY', name: 'USD/JPY', type: 'forex' },
  'USDCHF': { symbol: 'USDCHF', name: 'USD/CHF', type: 'forex' },
  'AUDUSD': { symbol: 'AUDUSD', name: 'AUD/USD', type: 'forex' },
  'USDCAD': { symbol: 'USDCAD', name: 'USD/CAD', type: 'forex' },
  'XAUUSD': { symbol: 'XAUUSD', name: 'Gold', type: 'metal' },
  'XAGUSD': { symbol: 'XAGUSD', name: 'Silver', type: 'metal' },
  'BTCUSD': { symbol: 'BTCUSD', name: 'Bitcoin', type: 'crypto' },
  'ETHUSD': { symbol: 'ETHUSD', name: 'Ethereum', type: 'crypto' },
  'SOLUSD': { symbol: 'SOLUSD', name: 'Solana', type: 'crypto' },
  'AAPL': { symbol: 'AAPL', name: 'Apple Inc.', type: 'stock' },
  'MSFT': { symbol: 'MSFT', name: 'Microsoft', type: 'stock' },
  'GOOGL': { symbol: 'GOOGL', name: 'Alphabet', type: 'stock' },
  'AMZN': { symbol: 'AMZN', name: 'Amazon', type: 'stock' },
  'TSLA': { symbol: 'TSLA', name: 'Tesla', type: 'stock' },
  'NVDA': { symbol: 'NVDA', name: 'NVIDIA', type: 'stock' },
  '^GSPC': { symbol: '^GSPC', name: 'S&P 500', type: 'index' },
  '^DJI': { symbol: '^DJI', name: 'Dow Jones', type: 'index' },
  '^IXIC': { symbol: '^IXIC', name: 'NASDAQ', type: 'index' },
};

// Base prices for simulation
const BASE_PRICES: Record<string, number> = {
  'EURUSD': 1.0850,
  'GBPUSD': 1.2650,
  'USDJPY': 149.50,
  'USDCHF': 0.8850,
  'AUDUSD': 0.6550,
  'USDCAD': 1.3650,
  'XAUUSD': 2350.00,
  'XAGUSD': 28.50,
  'BTCUSD': 67000,
  'ETHUSD': 3400,
  'SOLUSD': 145,
  'AAPL': 180,
  'MSFT': 415,
  'GOOGL': 175,
  'AMZN': 185,
  'TSLA': 250,
  'NVDA': 880,
  '^GSPC': 5200,
  '^DJI': 39000,
  '^IXIC': 16500,
};

// Global price state for simulation (shared across all hook instances)
const priceState: Record<string, { price: number; trend: number }> = {};

// Initialize price state once
if (Object.keys(priceState).length === 0) {
  Object.keys(BASE_PRICES).forEach(symbol => {
    priceState[symbol] = {
      price: BASE_PRICES[symbol],
      trend: Math.random() > 0.5 ? 1 : -1,
    };
  });
}

// Helper function to generate sparkline
function generateSparklineData(basePrice: number): number[] {
  const points: number[] = [];
  let price = basePrice * 0.998;
  
  for (let i = 0; i < 20; i++) {
    const change = (Math.random() - 0.5) * basePrice * 0.001;
    price += change;
    points.push(price);
  }
  points.push(basePrice);
  
  return points;
}

// Helper function to generate price
function generatePriceForSymbol(symbol: string): { price: number; change: number; changePercent: number } {
  const state = priceState[symbol];
  if (!state) return { price: 100, change: 0, changePercent: 0 };

  const volatility = symbol.includes('BTC') ? 0.005 : 
                     symbol.includes('XAU') ? 0.002 :
                     symbol.includes('JPY') ? 0.001 : 0.0005;
  
  const randomChange = (Math.random() - 0.5) * volatility;
  const trendChange = state.trend * volatility * 0.1;
  const meanReversion = (BASE_PRICES[symbol] - state.price) / BASE_PRICES[symbol] * 0.001;
  
  state.price *= (1 + randomChange + trendChange + meanReversion);
  
  if (Math.random() < 0.01) {
    state.trend *= -1;
  }

  const change = state.price - BASE_PRICES[symbol];
  const changePercent = (change / BASE_PRICES[symbol]) * 100;

  return { price: state.price, change, changePercent };
}

// Helper to generate candles
function generateCandleData(symbol: string, interval: string, limit: number): Candle[] {
  const basePrice = BASE_PRICES[symbol] || 100;
  const generatedCandles: Candle[] = [];
  let price = basePrice * 0.95;
  const now = Date.now();
  const intervalMs = interval === '1m' ? 60000 :
                     interval === '5m' ? 300000 :
                     interval === '15m' ? 900000 :
                     interval === '1h' ? 3600000 :
                     interval === '4h' ? 14400000 :
                     86400000;

  for (let i = 0; i < limit; i++) {
    const open = price;
    const volatility = basePrice * 0.002;
    const trend = Math.sin(i / 20) * volatility * 0.5;
    const noise = (Math.random() - 0.5) * volatility;
    
    price += trend + noise;
    
    const high = Math.max(open, price) * (1 + Math.random() * 0.002);
    const low = Math.min(open, price) * (1 - Math.random() * 0.002);
    const close = price;
    const volume = 500000 + Math.random() * 2000000;

    generatedCandles.push({
      time: now - (limit - i) * intervalMs,
      open,
      high,
      low,
      close,
      volume,
    });
  }

  return generatedCandles;
}

export function useMarketData(symbols: string[] = Object.keys(MARKET_DATA)) {
  // Initialize with pre-computed tickers
  const [tickers, setTickers] = useState<Ticker[]>(() => {
    return symbols.map(symbol => {
      const { price, change, changePercent } = generatePriceForSymbol(symbol);
      return {
        ...MARKET_DATA[symbol],
        price,
        change,
        changePercent,
        sparkline: generateSparklineData(price),
        high24h: price * 1.01,
        low24h: price * 0.99,
        volume: Math.floor(Math.random() * 10000000),
      } as Ticker;
    });
  });
  const [isLoading] = useState(false);

  // Real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setTickers(prevTickers => 
        prevTickers.map(ticker => {
          const { price, change, changePercent } = generatePriceForSymbol(ticker.symbol);
          return {
            ...ticker,
            price,
            change,
            changePercent,
            sparkline: generateSparklineData(price),
          };
        })
      );
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const getTicker = useCallback((symbol: string) => {
    return tickers.find(t => t.symbol === symbol);
  }, [tickers]);

  const getTickersByType = useCallback((type: Ticker['type']) => {
    return tickers.filter(t => t.type === type);
  }, [tickers]);

  return {
    tickers,
    isLoading,
    error: null,
    getTicker,
    getTickersByType,
    refresh: () => {},
  };
}

// Historical data hook
export function useHistoricalData(symbol: string, interval: string = '1h', limit: number = 100) {
  // Initialize with generated candles
  const [candles] = useState<Candle[]>(() => generateCandleData(symbol, interval, limit));
  const [isLoading] = useState(false);

  return { candles, isLoading, error: null };
}

// AI Signal hook
export function useAISignal(symbol: string, timeframe: string = '1h') {
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    const fetchAnalysis = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/ai/signal?symbol=${symbol}&timeframe=${timeframe}`);
        if (!response.ok) throw new Error('Failed to fetch AI analysis');
        const data = await response.json();
        if (isMounted) {
          setAnalysis(data);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Unknown error');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchAnalysis();
    
    const interval = setInterval(fetchAnalysis, 30000);
    
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [symbol, timeframe]);

  return { analysis, isLoading, error, refresh: () => {} };
}

// Theme hook - initialize from localStorage synchronously if available
function getInitialTheme(): 'dark' | 'light' {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('trading-theme') as 'dark' | 'light' | null;
    return stored || 'dark';
  }
  return 'dark';
}

export function useTheme() {
  const [theme, setTheme] = useState<'dark' | 'light'>(getInitialTheme);

  const toggleTheme = useCallback(() => {
    setTheme(prevTheme => {
      const newTheme = prevTheme === 'dark' ? 'light' : 'dark';
      if (typeof window !== 'undefined') {
        localStorage.setItem('trading-theme', newTheme);
        document.documentElement.classList.toggle('light-mode', newTheme === 'light');
      }
      return newTheme;
    });
  }, []);

  return { theme, toggleTheme };
}

// Portfolio hook
export function usePortfolio() {
  const [portfolio, setPortfolio] = useState({
    totalBalance: 100000,
    equity: 102500,
    margin: 15000,
    freeMargin: 87500,
    marginLevel: 683.33,
    unrealizedPnl: 2500,
    realizedPnl: 5000,
    dailyPnl: 850,
    weeklyPnl: 3200,
    monthlyPnl: 8500,
  });

  const [positions] = useState([
    { id: '1', symbol: 'EURUSD', type: 'long' as const, size: 1.5, entryPrice: 1.0820, currentPrice: 1.0850, pnl: 450, pnlPercent: 0.45 },
    { id: '2', symbol: 'XAUUSD', type: 'long' as const, size: 0.5, entryPrice: 2320, currentPrice: 2350, pnl: 1500, pnlPercent: 0.65 },
    { id: '3', symbol: 'BTCUSD', type: 'short' as const, size: 0.1, entryPrice: 68500, currentPrice: 67000, pnl: 150, pnlPercent: 0.22 },
  ]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setPortfolio(prev => ({
        ...prev,
        unrealizedPnl: prev.unrealizedPnl + (Math.random() - 0.5) * 50,
        dailyPnl: prev.dailyPnl + (Math.random() - 0.5) * 20,
        equity: prev.equity + (Math.random() - 0.5) * 30,
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return { portfolio, positions };
}

// Risk metrics hook
export function useRiskMetrics() {
  const metrics = useMemo(() => ({
    valueAtRisk: 2500,
    conditionalVaR: 3800,
    sharpeRatio: 1.85,
    sortinoRatio: 2.45,
    maxDrawdown: 12.5,
    currentDrawdown: 2.3,
    winRate: 62.5,
    profitFactor: 1.85,
    averageWin: 450,
    averageLoss: 280,
    riskRewardRatio: 1.61,
  }), []);

  return metrics;
}
