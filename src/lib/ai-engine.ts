// AI Trading Intelligence Engine

import { Candle, Signal, AIAnalysis, MarketStructure, SignalType } from '@/types/trading';
import { 
  calculateRSI, 
  getRSISignal, 
  calculateMACD, 
  getMACDSignal, 
  calculateBollingerBands,
  calculateSMA,
  calculateEMA,
  detectTrend,
  calculateTrendStrength,
  findSupportResistance,
  detectCandlestickPatterns,
  analyzeVolume,
  calculateADX
} from './technical-analysis';
import { calculateATR } from './quant';

// ==================== MARKET STRUCTURE ANALYSIS ====================

export function analyzeMarketStructure(candles: Candle[]): MarketStructure {
  const closes = candles.map(c => c.close);
  const highs = candles.map(c => c.high);
  const lows = candles.map(c => c.low);
  
  // Detect trend
  const trend = detectTrend(candles);
  
  // Detect market phase (simplified Wyckoff)
  const phase = detectMarketPhase(candles);
  
  // Find key levels
  const { support, resistance } = findSupportResistance(candles, 20, 0.015);
  
  // Identify supply and demand zones
  const supplyZones = identifySupplyZones(candles);
  const demandZones = identifyDemandZones(candles);
  
  // Identify liquidity zones
  const liquidityZones = identifyLiquidityZones(candles);
  
  return {
    trend,
    phase,
    keyLevels: { resistance, support },
    supplyZones,
    demandZones,
    liquidityZones,
  };
}

function detectMarketPhase(candles: Candle[]): MarketStructure['phase'] {
  if (candles.length < 50) return 'markup';
  
  const recentCandles = candles.slice(-50);
  const closes = recentCandles.map(c => c.close);
  const volumes = recentCandles.map(c => c.volume);
  
  const avgVolume = volumes.reduce((a, b) => a + b, 0) / volumes.length;
  const recentVolume = volumes.slice(-10).reduce((a, b) => a + b, 0) / 10;
  const volumeRatio = recentVolume / avgVolume;
  
  const priceStart = closes[0];
  const priceEnd = closes[closes.length - 1];
  const priceChange = (priceEnd - priceStart) / priceStart;
  
  const volatility = calculateVolatility(closes);
  
  // Simplified phase detection
  if (volumeRatio < 0.7 && volatility < 0.02) return 'accumulation';
  if (volumeRatio < 0.7 && priceChange > 0.05) return 'distribution';
  if (priceChange > 0.02) return 'markup';
  if (priceChange < -0.02) return 'markdown';
  
  return 'accumulation';
}

function calculateVolatility(closes: number[]): number {
  const returns: number[] = [];
  for (let i = 1; i < closes.length; i++) {
    returns.push((closes[i] - closes[i - 1]) / closes[i - 1]);
  }
  const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
  const variance = returns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / returns.length;
  return Math.sqrt(variance);
}

function identifySupplyZones(candles: Candle[]): MarketStructure['supplyZones'] {
  const zones: MarketStructure['supplyZones'] = [];
  
  for (let i = 5; i < candles.length - 5; i++) {
    const window = candles.slice(i - 5, i + 1);
    const avgVolume = window.reduce((sum, c) => sum + c.volume, 0) / 6;
    const currentVolume = candles[i].volume;
    
    // Strong bearish candle with high volume
    if (candles[i].close < candles[i].open && currentVolume > avgVolume * 1.5) {
      const zone = {
        high: candles[i].high,
        low: Math.max(candles[i].open, candles[i].close),
        strength: (currentVolume / avgVolume) * (candles[i].open - candles[i].close) / candles[i].open,
      };
      
      // Check if zone was tested
      const futureCandles = candles.slice(i + 1);
      const tests = futureCandles.filter(c => c.high >= zone.low && c.high <= zone.high).length;
      zone.strength *= (1 - tests * 0.2);
      
      if (zone.strength > 0.3) {
        zones.push(zone);
      }
    }
  }
  
  return zones.sort((a, b) => b.strength - a.strength).slice(0, 5);
}

function identifyDemandZones(candles: Candle[]): MarketStructure['demandZones'] {
  const zones: MarketStructure['demandZones'] = [];
  
  for (let i = 5; i < candles.length - 5; i++) {
    const window = candles.slice(i - 5, i + 1);
    const avgVolume = window.reduce((sum, c) => sum + c.volume, 0) / 6;
    const currentVolume = candles[i].volume;
    
    // Strong bullish candle with high volume
    if (candles[i].close > candles[i].open && currentVolume > avgVolume * 1.5) {
      const zone = {
        high: Math.min(candles[i].open, candles[i].close),
        low: candles[i].low,
        strength: (currentVolume / avgVolume) * (candles[i].close - candles[i].open) / candles[i].close,
      };
      
      // Check if zone was tested
      const futureCandles = candles.slice(i + 1);
      const tests = futureCandles.filter(c => c.low >= zone.low && c.low <= zone.high).length;
      zone.strength *= (1 - tests * 0.2);
      
      if (zone.strength > 0.3) {
        zones.push(zone);
      }
    }
  }
  
  return zones.sort((a, b) => b.strength - a.strength).slice(0, 5);
}

function identifyLiquidityZones(candles: Candle[]): MarketStructure['liquidityZones'] {
  const zones: MarketStructure['liquidityZones'] = [];
  
  // Find equal highs (buy-side liquidity)
  const highs = candles.map(c => c.high);
  const tolerance = 0.001;
  
  for (let i = 0; i < highs.length - 1; i++) {
    for (let j = i + 1; j < highs.length; j++) {
      if (Math.abs(highs[i] - highs[j]) / highs[i] < tolerance) {
        zones.push({
          price: (highs[i] + highs[j]) / 2,
          type: 'buy',
          strength: 2,
        });
        break;
      }
    }
  }
  
  // Find equal lows (sell-side liquidity)
  const lows = candles.map(c => c.low);
  
  for (let i = 0; i < lows.length - 1; i++) {
    for (let j = i + 1; j < lows.length; j++) {
      if (Math.abs(lows[i] - lows[j]) / lows[i] < tolerance) {
        zones.push({
          price: (lows[i] + lows[j]) / 2,
          type: 'sell',
          strength: 2,
        });
        break;
      }
    }
  }
  
  return zones;
}

// ==================== SIGNAL GENERATION ====================

export function generateSignal(
  symbol: string,
  candles: Candle[],
  timeframe: string
): Signal {
  if (candles.length < 50) {
    return createDefaultSignal(symbol, timeframe);
  }
  
  const closes = candles.map(c => c.close);
  const currentPrice = closes[closes.length - 1];
  
  // Technical indicators
  const rsi = calculateRSI(closes);
  const lastRSI = rsi[rsi.length - 1] || 50;
  const rsiSignal = getRSISignal(lastRSI);
  
  const { macd, signal: macdSignal } = calculateMACD(closes);
  const macdValue = getMACDSignal(macd, macdSignal);
  
  const bollinger = calculateBollingerBands(closes);
  const bbUpper = bollinger.upper[bollinger.upper.length - 1];
  const bbLower = bollinger.lower[bollinger.lower.length - 1];
  
  const trend = detectTrend(candles);
  const trendStrength = calculateTrendStrength(candles);
  
  const atr = calculateATR(candles);
  
  const marketStructure = analyzeMarketStructure(candles);
  
  const patterns = detectCandlestickPatterns(candles);
  const volumeAnalysis = analyzeVolume(candles);
  
  // Scoring system
  let bullishScore = 0;
  let bearishScore = 0;
  const reasoning: string[] = [];
  
  // RSI signals
  if (rsiSignal === 'oversold') {
    bullishScore += 15;
    reasoning.push(`RSI oversold (${lastRSI.toFixed(1)}) - potential bounce`);
  } else if (rsiSignal === 'overbought') {
    bearishScore += 15;
    reasoning.push(`RSI overbought (${lastRSI.toFixed(1)}) - potential reversal`);
  }
  
  // MACD signals
  if (macdValue === 'bullish') {
    bullishScore += 20;
    reasoning.push('MACD bullish crossover detected');
  } else if (macdValue === 'bearish') {
    bearishScore += 20;
    reasoning.push('MACD bearish crossover detected');
  }
  
  // Trend signals
  if (trend === 'bullish') {
    bullishScore += 15 * (trendStrength / 100);
    reasoning.push(`Uptrend with ${trendStrength.toFixed(0)}% strength`);
  } else if (trend === 'bearish') {
    bearishScore += 15 * (trendStrength / 100);
    reasoning.push(`Downtrend with ${trendStrength.toFixed(0)}% strength`);
  }
  
  // Bollinger Bands
  if (currentPrice < bbLower) {
    bullishScore += 10;
    reasoning.push('Price below lower Bollinger Band - oversold');
  } else if (currentPrice > bbUpper) {
    bearishScore += 10;
    reasoning.push('Price above upper Bollinger Band - overbought');
  }
  
  // Market structure
  if (marketStructure.phase === 'accumulation') {
    bullishScore += 10;
    reasoning.push('Market in accumulation phase');
  } else if (marketStructure.phase === 'distribution') {
    bearishScore += 10;
    reasoning.push('Market in distribution phase');
  }
  
  // Support/Resistance proximity
  const nearestSupport = marketStructure.keyLevels.support[0];
  const nearestResistance = marketStructure.keyLevels.resistance[0];
  
  if (nearestSupport && currentPrice < nearestSupport * 1.02) {
    bullishScore += 15;
    reasoning.push(`Near support level at ${nearestSupport.toFixed(5)}`);
  }
  
  if (nearestResistance && currentPrice > nearestResistance * 0.98) {
    bearishScore += 15;
    reasoning.push(`Near resistance level at ${nearestResistance.toFixed(5)}`);
  }
  
  // Candlestick patterns
  patterns.forEach(pattern => {
    if (pattern.includes('Bullish') || pattern === 'Hammer' || pattern === 'Morning Star') {
      bullishScore += 10;
      reasoning.push(`${pattern} pattern detected`);
    } else if (pattern.includes('Bearish') || pattern === 'Shooting Star' || pattern === 'Evening Star') {
      bearishScore += 10;
      reasoning.push(`${pattern} pattern detected`);
    }
  });
  
  // Volume confirmation
  if (volumeAnalysis.volumeTrend === 'increasing') {
    if (bullishScore > bearishScore) {
      bullishScore += 5;
      reasoning.push('Volume supporting bullish move');
    } else {
      bearishScore += 5;
      reasoning.push('Volume supporting bearish move');
    }
  }
  
  // Determine signal type
  const totalScore = bullishScore + bearishScore;
  let signalType: SignalType = 'WAIT';
  let confidence = 0;
  
  if (bullishScore > bearishScore * 1.3 && bullishScore > 30) {
    signalType = 'BUY';
    confidence = Math.min(95, (bullishScore / totalScore) * 100);
  } else if (bearishScore > bullishScore * 1.3 && bearishScore > 30) {
    signalType = 'SELL';
    confidence = Math.min(95, (bearishScore / totalScore) * 100);
  } else {
    signalType = 'WAIT';
    confidence = 100 - Math.abs(bullishScore - bearishScore);
    reasoning.push('Market conditions unclear - waiting for confirmation');
  }
  
  // Calculate entry, SL, TP
  let entry: number | undefined;
  let stopLoss: number | undefined;
  let takeProfit: number | undefined;
  let riskReward: number | undefined;
  
  if (signalType !== 'WAIT') {
    entry = currentPrice;
    
    if (signalType === 'BUY') {
      stopLoss = currentPrice - atr * 2;
      takeProfit = currentPrice + atr * 4; // 2:1 RR
    } else {
      stopLoss = currentPrice + atr * 2;
      takeProfit = currentPrice - atr * 4;
    }
    
    riskReward = 2;
  }
  
  const probability = confidence;
  
  return {
    symbol,
    type: signalType,
    confidence,
    probability,
    entry,
    stopLoss,
    takeProfit,
    riskReward,
    reasoning,
    timestamp: Date.now(),
    timeframe,
  };
}

function createDefaultSignal(symbol: string, timeframe: string): Signal {
  return {
    symbol,
    type: 'WAIT',
    confidence: 50,
    probability: 50,
    reasoning: ['Insufficient data for analysis'],
    timestamp: Date.now(),
    timeframe,
  };
}

// ==================== FULL AI ANALYSIS ====================

export function performAIAnalysis(
  symbol: string,
  candles: Candle[],
  timeframe: string
): AIAnalysis {
  const closes = candles.map(c => c.close);
  
  // Calculate all indicators
  const rsi = calculateRSI(closes);
  const lastRSI = rsi[rsi.length - 1] || 50;
  
  const { macd, signal: macdSignal, histogram } = calculateMACD(closes);
  
  const sma20 = calculateSMA(closes, 20);
  const sma50 = calculateSMA(closes, 50);
  const sma200 = calculateSMA(closes, 200);
  
  const ema12 = calculateEMA(closes, 12);
  const ema26 = calculateEMA(closes, 26);
  
  const bollingerBands = calculateBollingerBands(closes);
  
  const atr = calculateATR(candles);
  const adx = calculateADX(candles);
  const trendStrength = calculateTrendStrength(candles);
  
  // Market structure
  const marketStructure = analyzeMarketStructure(candles);
  
  // Generate signal
  const signal = generateSignal(symbol, candles, timeframe);
  
  // Calculate sentiment scores
  const momentum = calculateMomentumScore(candles);
  const volatility = calculateVolatilityScore(candles);
  const trend = calculateTrendScore(candles);
  const overall = (momentum + volatility + trend) / 3;
  
  return {
    symbol,
    timestamp: Date.now(),
    marketStructure,
    indicators: {
      rsi: lastRSI,
      rsiSignal: getRSISignal(lastRSI),
      macd: {
        value: macd[macd.length - 1] || 0,
        signal: macdSignal[macdSignal.length - 1] || 0,
        histogram: histogram[histogram.length - 1] || 0,
      },
      macdSignal: getMACDSignal(macd, macdSignal),
      sma20: sma20[sma20.length - 1] || 0,
      sma50: sma50[sma50.length - 1] || 0,
      sma200: sma200[sma200.length - 1] || 0,
      ema12: ema12[ema12.length - 1] || 0,
      ema26: ema26[ema26.length - 1] || 0,
      bollingerBands: {
        upper: bollingerBands.upper[bollingerBands.upper.length - 1] || 0,
        middle: bollingerBands.middle[bollingerBands.middle.length - 1] || 0,
        lower: bollingerBands.lower[bollingerBands.lower.length - 1] || 0,
      },
      atr,
      adx: adx[adx.length - 1] || 0,
      trendStrength,
    },
    sentiment: {
      overall,
      momentum,
      volatility,
      trend,
    },
    signal,
  };
}

function calculateMomentumScore(candles: Candle[]): number {
  if (candles.length < 10) return 50;
  
  const closes = candles.map(c => c.close);
  const changes: number[] = [];
  
  for (let i = 1; i < closes.length; i++) {
    changes.push((closes[i] - closes[i - 1]) / closes[i - 1]);
  }
  
  const recentChanges = changes.slice(-10);
  const avgChange = recentChanges.reduce((a, b) => a + b, 0) / recentChanges.length;
  
  // Normalize to -100 to 100
  return Math.max(-100, Math.min(100, avgChange * 1000));
}

function calculateVolatilityScore(candles: Candle[]): number {
  if (candles.length < 14) return 50;
  
  const closes = candles.map(c => c.close);
  const volatility = calculateVolatility(closes.slice(-14));
  
  // Lower volatility = higher score (stability)
  // Higher volatility = lower score (risk)
  const score = 100 - (volatility * 1000);
  return Math.max(0, Math.min(100, score));
}

function calculateTrendScore(candles: Candle[]): number {
  if (candles.length < 50) return 50;
  
  const closes = candles.map(c => c.close);
  const sma20 = calculateSMA(closes, 20);
  const sma50 = calculateSMA(closes, 50);
  
  const currentPrice = closes[closes.length - 1];
  const currentSMA20 = sma20[sma20.length - 1];
  const currentSMA50 = sma50[sma50.length - 1];
  
  let score = 50;
  
  if (currentPrice > currentSMA20) score += 15;
  if (currentPrice > currentSMA50) score += 15;
  if (currentSMA20 > currentSMA50) score += 20;
  
  return Math.min(100, score);
}

// ==================== MULTI-TIMEFRAME ANALYSIS ====================

export function multiTimeframeConsensus(
  signals: { timeframe: string; signal: Signal }[]
): {
  consensus: SignalType;
  confidence: number;
  breakdown: Record<string, { type: SignalType; weight: number }>;
} {
  const weights: Record<string, number> = {
    '1m': 0.05,
    '5m': 0.1,
    '15m': 0.15,
    '1h': 0.2,
    '4h': 0.25,
    '1d': 0.25,
  };
  
  const breakdown: Record<string, { type: SignalType; weight: number }> = {};
  let buyWeight = 0;
  let sellWeight = 0;
  let waitWeight = 0;
  
  signals.forEach(({ timeframe, signal }) => {
    const weight = weights[timeframe] || 0.1;
    breakdown[timeframe] = { type: signal.type, weight };
    
    if (signal.type === 'BUY') {
      buyWeight += weight * (signal.confidence / 100);
    } else if (signal.type === 'SELL') {
      sellWeight += weight * (signal.confidence / 100);
    } else {
      waitWeight += weight;
    }
  });
  
  let consensus: SignalType = 'WAIT';
  let confidence = 50;
  
  if (buyWeight > sellWeight * 1.2 && buyWeight > 0.3) {
    consensus = 'BUY';
    confidence = Math.min(95, buyWeight * 100);
  } else if (sellWeight > buyWeight * 1.2 && sellWeight > 0.3) {
    consensus = 'SELL';
    confidence = Math.min(95, sellWeight * 100);
  } else {
    confidence = 100 - Math.abs(buyWeight - sellWeight) * 100;
  }
  
  return { consensus, confidence, breakdown };
}
