// Technical Analysis Library

import { Candle } from '@/types/trading';

// ==================== MOVING AVERAGES ====================

export function calculateSMA(data: number[], period: number): number[] {
  const result: number[] = [];
  
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      result.push(NaN);
    } else {
      const sum = data.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
      result.push(sum / period);
    }
  }
  
  return result;
}

export function calculateEMA(data: number[], period: number): number[] {
  const result: number[] = [];
  const multiplier = 2 / (period + 1);
  
  // First EMA is SMA
  let ema = data.slice(0, period).reduce((a, b) => a + b, 0) / period;
  
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      result.push(NaN);
    } else if (i === period - 1) {
      result.push(ema);
    } else {
      ema = (data[i] - ema) * multiplier + ema;
      result.push(ema);
    }
  }
  
  return result;
}

export function calculateWMA(data: number[], period: number): number[] {
  const result: number[] = [];
  const weights = Array.from({ length: period }, (_, i) => i + 1);
  const weightSum = weights.reduce((a, b) => a + b, 0);
  
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      result.push(NaN);
    } else {
      const slice = data.slice(i - period + 1, i + 1);
      const wma = slice.reduce((sum, val, idx) => sum + val * weights[idx], 0) / weightSum;
      result.push(wma);
    }
  }
  
  return result;
}

// ==================== RSI ====================

export function calculateRSI(closes: number[], period: number = 14): number[] {
  const result: number[] = [];
  const gains: number[] = [];
  const losses: number[] = [];
  
  for (let i = 1; i < closes.length; i++) {
    const change = closes[i] - closes[i - 1];
    gains.push(change > 0 ? change : 0);
    losses.push(change < 0 ? Math.abs(change) : 0);
  }
  
  for (let i = 0; i < closes.length; i++) {
    if (i < period) {
      result.push(NaN);
    } else if (i === period) {
      const avgGain = gains.slice(0, period).reduce((a, b) => a + b, 0) / period;
      const avgLoss = losses.slice(0, period).reduce((a, b) => a + b, 0) / period;
      const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
      result.push(100 - (100 / (1 + rs)));
    } else {
      const prevAvgGain = (result[i - 1] !== NaN ? 
        (100 - result[i - 1] as number) / result[i - 1] * (gains[i - 1] || 0) : 0);
      const avgGain = ((gains.slice(i - period, i).reduce((a, b) => a + b, 0)));
      const avgLoss = ((losses.slice(i - period, i).reduce((a, b) => a + b, 0)));
      const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
      result.push(100 - (100 / (1 + rs)));
    }
  }
  
  return result;
}

export function getRSISignal(rsi: number): 'overbought' | 'oversold' | 'neutral' {
  if (rsi >= 70) return 'overbought';
  if (rsi <= 30) return 'oversold';
  return 'neutral';
}

// ==================== MACD ====================

export function calculateMACD(
  closes: number[],
  fastPeriod: number = 12,
  slowPeriod: number = 26,
  signalPeriod: number = 9
): {
  macd: number[];
  signal: number[];
  histogram: number[];
} {
  const fastEMA = calculateEMA(closes, fastPeriod);
  const slowEMA = calculateEMA(closes, slowPeriod);
  
  const macd: number[] = [];
  for (let i = 0; i < closes.length; i++) {
    if (isNaN(fastEMA[i]) || isNaN(slowEMA[i])) {
      macd.push(NaN);
    } else {
      macd.push(fastEMA[i] - slowEMA[i]);
    }
  }
  
  const signal = calculateEMA(macd.filter(v => !isNaN(v)), signalPeriod);
  
  // Align signal with macd
  const alignedSignal: number[] = [];
  let signalIdx = 0;
  for (let i = 0; i < macd.length; i++) {
    if (isNaN(macd[i])) {
      alignedSignal.push(NaN);
    } else {
      alignedSignal.push(signal[signalIdx] ?? NaN);
      signalIdx++;
    }
  }
  
  const histogram: number[] = [];
  for (let i = 0; i < macd.length; i++) {
    if (isNaN(macd[i]) || isNaN(alignedSignal[i])) {
      histogram.push(NaN);
    } else {
      histogram.push(macd[i] - alignedSignal[i]);
    }
  }
  
  return { macd, signal: alignedSignal, histogram };
}

export function getMACDSignal(macd: number[], signal: number[]): 'bullish' | 'bearish' | 'neutral' {
  if (macd.length < 2 || signal.length < 2) return 'neutral';
  
  const currentMacd = macd[macd.length - 1];
  const currentSignal = signal[signal.length - 1];
  const prevMacd = macd[macd.length - 2];
  const prevSignal = signal[signal.length - 2];
  
  // Crossover detection
  if (prevMacd < prevSignal && currentMacd > currentSignal) return 'bullish';
  if (prevMacd > prevSignal && currentMacd < currentSignal) return 'bearish';
  
  // Trend direction
  if (currentMacd > currentSignal) return 'bullish';
  if (currentMacd < currentSignal) return 'bearish';
  
  return 'neutral';
}

// ==================== BOLLINGER BANDS ====================

export function calculateBollingerBands(
  closes: number[],
  period: number = 20,
  stdDev: number = 2
): {
  upper: number[];
  middle: number[];
  lower: number[];
} {
  const middle = calculateSMA(closes, period);
  const upper: number[] = [];
  const lower: number[] = [];
  
  for (let i = 0; i < closes.length; i++) {
    if (i < period - 1) {
      upper.push(NaN);
      lower.push(NaN);
    } else {
      const slice = closes.slice(i - period + 1, i + 1);
      const mean = middle[i] as number;
      const variance = slice.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / period;
      const std = Math.sqrt(variance);
      
      upper.push(mean + stdDev * std);
      lower.push(mean - stdDev * std);
    }
  }
  
  return { upper, middle, lower };
}

// ==================== ADX (Average Directional Index) ====================

export function calculateADX(candles: Candle[], period: number = 14): number[] {
  const trueRanges: number[] = [];
  const plusDM: number[] = [];
  const minusDM: number[] = [];
  
  for (let i = 1; i < candles.length; i++) {
    const high = candles[i].high;
    const low = candles[i].low;
    const close = candles[i].close;
    const prevHigh = candles[i - 1].high;
    const prevLow = candles[i - 1].low;
    const prevClose = candles[i - 1].close;
    
    // True Range
    trueRanges.push(Math.max(
      high - low,
      Math.abs(high - prevClose),
      Math.abs(low - prevClose)
    ));
    
    // Directional Movement
    const upMove = high - prevHigh;
    const downMove = prevLow - low;
    
    plusDM.push(upMove > downMove && upMove > 0 ? upMove : 0);
    minusDM.push(downMove > upMove && downMove > 0 ? downMove : 0);
  }
  
  // Smoothed values
  const smoothedTR = smoothArray(trueRanges, period);
  const smoothedPlusDM = smoothArray(plusDM, period);
  const smoothedMinusDM = smoothArray(minusDM, period);
  
  // Directional Index
  const plusDI: number[] = [];
  const minusDI: number[] = [];
  const dx: number[] = [];
  
  for (let i = 0; i < smoothedTR.length; i++) {
    plusDI.push((smoothedPlusDM[i] / smoothedTR[i]) * 100);
    minusDI.push((smoothedMinusDM[i] / smoothedTR[i]) * 100);
    
    const sum = plusDI[i] + minusDI[i];
    dx.push(sum === 0 ? 0 : (Math.abs(plusDI[i] - minusDI[i]) / sum) * 100);
  }
  
  return smoothArray(dx, period);
}

function smoothArray(data: number[], period: number): number[] {
  const result: number[] = [];
  let smoothed = data.slice(0, period).reduce((a, b) => a + b, 0);
  
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      result.push(NaN);
    } else if (i === period - 1) {
      result.push(smoothed);
    } else {
      smoothed = smoothed - smoothed / period + data[i];
      result.push(smoothed);
    }
  }
  
  return result;
}

// ==================== STOCHASTIC OSCILLATOR ====================

export function calculateStochastic(
  candles: Candle[],
  kPeriod: number = 14,
  dPeriod: number = 3
): { k: number[]; d: number[] } {
  const k: number[] = [];
  
  for (let i = 0; i < candles.length; i++) {
    if (i < kPeriod - 1) {
      k.push(NaN);
    } else {
      const slice = candles.slice(i - kPeriod + 1, i + 1);
      const highest = Math.max(...slice.map(c => c.high));
      const lowest = Math.min(...slice.map(c => c.low));
      const close = candles[i].close;
      
      const kValue = highest === lowest ? 0 : ((close - lowest) / (highest - lowest)) * 100;
      k.push(kValue);
    }
  }
  
  const d = calculateSMA(k.filter(v => !isNaN(v)), dPeriod);
  
  // Align d with k
  const alignedD: number[] = [];
  let dIdx = 0;
  for (let i = 0; i < k.length; i++) {
    if (isNaN(k[i])) {
      alignedD.push(NaN);
    } else {
      alignedD.push(d[dIdx] ?? NaN);
      dIdx++;
    }
  }
  
  return { k, d: alignedD };
}

// ==================== SUPPORT & RESISTANCE ====================

export function findSupportResistance(
  candles: Candle[],
  lookback: number = 20,
  threshold: number = 0.02
): { support: number[]; resistance: number[] } {
  const support: number[] = [];
  const resistance: number[] = [];
  
  for (let i = lookback; i < candles.length - lookback; i++) {
    const leftCandles = candles.slice(i - lookback, i);
    const rightCandles = candles.slice(i + 1, i + lookback + 1);
    const currentLow = candles[i].low;
    const currentHigh = candles[i].high;
    
    // Check for support (local minimum)
    const isSupport = leftCandles.every(c => c.low >= currentLow) &&
                      rightCandles.every(c => c.low >= currentLow);
    
    // Check for resistance (local maximum)
    const isResistance = leftCandles.every(c => c.high <= currentHigh) &&
                         rightCandles.every(c => c.high <= currentHigh);
    
    if (isSupport) {
      const nearbySupport = support.find(s => Math.abs(s - currentLow) / currentLow < threshold);
      if (!nearbySupport) {
        support.push(currentLow);
      }
    }
    
    if (isResistance) {
      const nearbyResistance = resistance.find(r => Math.abs(r - currentHigh) / currentHigh < threshold);
      if (!nearbyResistance) {
        resistance.push(currentHigh);
      }
    }
  }
  
  return {
    support: support.sort((a, b) => b - a),
    resistance: resistance.sort((a, b) => a - b),
  };
}

// ==================== TREND DETECTION ====================

export function detectTrend(
  candles: Candle[],
  shortPeriod: number = 20,
  longPeriod: number = 50
): 'bullish' | 'bearish' | 'ranging' {
  if (candles.length < longPeriod) return 'ranging';
  
  const closes = candles.map(c => c.close);
  const shortSMA = calculateSMA(closes, shortPeriod);
  const longSMA = calculateSMA(closes, longPeriod);
  
  const currentShort = shortSMA[shortSMA.length - 1];
  const currentLong = longSMA[longSMA.length - 1];
  
  if (isNaN(currentShort) || isNaN(currentLong)) return 'ranging';
  
  const difference = (currentShort - currentLong) / currentLong;
  
  if (difference > 0.01) return 'bullish';
  if (difference < -0.01) return 'bearish';
  return 'ranging';
}

export function calculateTrendStrength(candles: Candle[]): number {
  if (candles.length < 14) return 0;
  
  const adx = calculateADX(candles);
  const lastADX = adx[adx.length - 1];
  
  return isNaN(lastADX) ? 0 : Math.min(100, lastADX);
}

// ==================== VOLUME ANALYSIS ====================

export function analyzeVolume(candles: Candle[]): {
  avgVolume: number;
  volumeRatio: number;
  volumeTrend: 'increasing' | 'decreasing' | 'neutral';
} {
  if (candles.length < 2) {
    return { avgVolume: 0, volumeRatio: 1, volumeTrend: 'neutral' };
  }
  
  const volumes = candles.map(c => c.volume);
  const avgVolume = volumes.reduce((a, b) => a + b, 0) / volumes.length;
  const lastVolume = volumes[volumes.length - 1];
  const prevVolume = volumes[volumes.length - 2];
  
  const volumeRatio = lastVolume / avgVolume;
  const volumeTrend = lastVolume > prevVolume * 1.2 ? 'increasing' :
                      lastVolume < prevVolume * 0.8 ? 'decreasing' : 'neutral';
  
  return { avgVolume, volumeRatio, volumeTrend };
}

// ==================== CANDLESTICK PATTERNS ====================

export function detectCandlestickPatterns(candles: Candle[]): string[] {
  const patterns: string[] = [];
  
  if (candles.length < 3) return patterns;
  
  const last = candles[candles.length - 1];
  const prev = candles[candles.length - 2];
  const prev2 = candles[candles.length - 3];
  
  const body = last.close - last.open;
  const bodyAbs = Math.abs(body);
  const upperWick = last.high - Math.max(last.open, last.close);
  const lowerWick = Math.min(last.open, last.close) - last.low;
  const totalRange = last.high - last.low;
  
  // Doji
  if (bodyAbs < totalRange * 0.1) {
    patterns.push('Doji');
  }
  
  // Hammer / Hanging Man
  if (lowerWick > bodyAbs * 2 && upperWick < bodyAbs * 0.5) {
    patterns.push(body > 0 ? 'Hammer' : 'Hanging Man');
  }
  
  // Shooting Star / Inverted Hammer
  if (upperWick > bodyAbs * 2 && lowerWick < bodyAbs * 0.5) {
    patterns.push(body > 0 ? 'Inverted Hammer' : 'Shooting Star');
  }
  
  // Bullish Engulfing
  if (prev.close < prev.open && last.close > last.open &&
      last.open < prev.close && last.close > prev.open) {
    patterns.push('Bullish Engulfing');
  }
  
  // Bearish Engulfing
  if (prev.close > prev.open && last.close < last.open &&
      last.open > prev.close && last.close < prev.open) {
    patterns.push('Bearish Engulfing');
  }
  
  // Morning Star
  if (candles.length >= 3) {
    if (prev2.close < prev2.open && // First bearish
        Math.abs(prev.close - prev.open) < prev2.close * 0.01 && // Small body
        last.close > last.open && last.close > (prev2.open + prev2.close) / 2) {
      patterns.push('Morning Star');
    }
  }
  
  // Evening Star
  if (candles.length >= 3) {
    if (prev2.close > prev2.open && // First bullish
        Math.abs(prev.close - prev.open) < prev2.close * 0.01 && // Small body
        last.close < last.open && last.close < (prev2.open + prev2.close) / 2) {
      patterns.push('Evening Star');
    }
  }
  
  return patterns;
}

// ==================== MOMENTUM ====================

export function calculateMomentum(closes: number[], period: number = 10): number[] {
  const result: number[] = [];
  
  for (let i = 0; i < closes.length; i++) {
    if (i < period) {
      result.push(NaN);
    } else {
      result.push(closes[i] - closes[i - period]);
    }
  }
  
  return result;
}

export function calculateROC(closes: number[], period: number = 10): number[] {
  const result: number[] = [];
  
  for (let i = 0; i < closes.length; i++) {
    if (i < period) {
      result.push(NaN);
    } else {
      result.push((closes[i] - closes[i - period]) / closes[i - period] * 100);
    }
  }
  
  return result;
}

// ==================== UTILITY ====================

export function normalizeArray(data: number[]): number[] {
  const validValues = data.filter(v => !isNaN(v));
  const min = Math.min(...validValues);
  const max = Math.max(...validValues);
  const range = max - min;
  
  if (range === 0) return data.map(() => 50);
  
  return data.map(v => isNaN(v) ? NaN : ((v - min) / range) * 100);
}
