import { NextRequest, NextResponse } from 'next/server';
import { generateSignal } from '@/lib/ai-engine';
import { DEFAULT_SYMBOLS } from '@/types/trading';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const ticker = searchParams.get('ticker');
  const type = searchParams.get('type') || 'STOCKS';

  if (!ticker) {
    // Return signals for all default symbols
    const signals = [];
    for (const symbol of DEFAULT_SYMBOLS.slice(0, 10)) {
      const candles = generateMockCandles(symbol.symbol);
      const currentPrice = candles[candles.length - 1].close;
      const signal = generateSignal(symbol.symbol, candles, currentPrice);
      if (signal) signals.push(signal);
    }
    return NextResponse.json({ signals });
  }

  // Generate mock candles for the ticker
  const candles = generateMockCandles(ticker);
  const currentPrice = candles[candles.length - 1].close;
  const signal = generateSignal(ticker, candles, currentPrice);

  return NextResponse.json({ signal });
}

function generateMockCandles(ticker: string) {
  const basePrice = getBasePrice(ticker);
  const candles = [];
  const now = Date.now();
  
  let price = basePrice;
  let trend = Math.random() > 0.5 ? 1 : -1;
  
  for (let i = 100; i >= 0; i--) {
    const time = now - i * 60 * 60 * 1000; // 1-hour candles
    
    if (Math.random() < 0.05) trend *= -1;
    const volatility = basePrice * 0.003;
    const change = (Math.random() - 0.5) * volatility * 2 + trend * volatility * 0.3;
    
    const open = price;
    price = Math.max(basePrice * 0.7, Math.min(basePrice * 1.3, price + change));
    const close = price;
    
    const highLowRange = Math.abs(close - open) + Math.random() * volatility;
    const high = Math.max(open, close) + Math.random() * highLowRange * 0.5;
    const low = Math.min(open, close) - Math.random() * highLowRange * 0.5;
    
    candles.push({
      time: Math.floor(time / 1000),
      open,
      high,
      low,
      close,
      volume: Math.floor(Math.random() * 1000000) + 100000,
    });
  }
  
  return candles;
}

function getBasePrice(ticker: string): number {
  const prices: Record<string, number> = {
    'EURUSD': 1.0850,
    'GBPUSD': 1.2650,
    'USDJPY': 154.50,
    'AUDUSD': 0.6550,
    'USDCAD': 1.3650,
    'USDCHF': 0.8850,
    'BTCUSD': 67500,
    'ETHUSD': 3450,
    'XRPUSD': 0.52,
    'SOLUSD': 145,
    'AAPL': 195.50,
    'GOOGL': 175.25,
    'MSFT': 425.75,
    'AMZN': 185.30,
    'TSLA': 245.80,
    'NVDA': 875.50,
    'XAUUSD': 2350.50,
    'XAGUSD': 28.50,
    'SPX': 5350,
    'DJI': 39500,
    'NAS100': 18800,
  };
  
  return prices[ticker] || 100;
}
