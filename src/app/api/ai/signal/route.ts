import { NextRequest, NextResponse } from 'next/server';
import { performAIAnalysis } from '@/lib/ai-engine';

// Simulated historical data generator for demo
function generateSimulatedCandles(basePrice: number, count: number = 200) {
  const candles = [];
  let price = basePrice;
  const now = Date.now();
  
  for (let i = 0; i < count; i++) {
    const volatility = 0.002;
    const trend = Math.sin(i / 30) * 0.001;
    const noise = (Math.random() - 0.5) * volatility;
    
    const open = price;
    const change = price * (trend + noise);
    price += change;
    
    const high = Math.max(open, price) * (1 + Math.random() * 0.002);
    const low = Math.min(open, price) * (1 - Math.random() * 0.002);
    const close = price;
    const volume = 1000000 + Math.random() * 5000000;
    
    candles.push({
      time: now - (count - i) * 60000,
      open,
      high,
      low,
      close,
      volume,
    });
  }
  
  return candles;
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const symbol = searchParams.get('symbol') || 'EURUSD';
  const timeframe = searchParams.get('timeframe') || '1h';
  
  try {
    // Base prices for different assets
    const basePrices: Record<string, number> = {
      'EURUSD': 1.0850,
      'GBPUSD': 1.2650,
      'USDJPY': 149.50,
      'XAUUSD': 2350.00,
      'BTCUSD': 67000,
      'ETHUSD': 3400,
      'AAPL': 180,
      'TSLA': 250,
      'NVDA': 880,
      '^GSPC': 5200,
    };
    
    const basePrice = basePrices[symbol] || 100;
    const candles = generateSimulatedCandles(basePrice, 200);
    
    const analysis = performAIAnalysis(symbol, candles, timeframe);
    
    return NextResponse.json(analysis);
  } catch (error) {
    console.error('AI Analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to perform AI analysis' },
      { status: 500 }
    );
  }
}
