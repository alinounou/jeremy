// Quantitative Trading Calculations Library

import {
  PositionSizeInput,
  PositionSizeOutput,
  VaRInput,
  VaROutput,
  MonteCarloInput,
  MonteCarloOutput,
  KellyInput,
  BreakEvenInput,
  BreakEvenOutput,
  Candle,
} from '@/types/trading';

// ==================== POSITION SIZING ====================

export function calculatePositionSize(input: PositionSizeInput): PositionSizeOutput {
  const { accountBalance, riskPercent, entryPrice, stopLoss, instrumentType, pipValue = 0.0001 } = input;
  
  const riskAmount = accountBalance * (riskPercent / 100);
  const priceDiff = Math.abs(entryPrice - stopLoss);
  const pipDistance = priceDiff / pipValue;
  
  let positionSize: number;
  let lots: number;
  let calculatedPipValue: number;
  
  if (instrumentType === 'forex') {
    // Standard lot is 100,000 units
    calculatedPipValue = pipDistance > 0 ? riskAmount / pipDistance : 0;
    lots = calculatedPipValue / 10; // $10 per pip per standard lot
    positionSize = lots * 100000;
  } else if (instrumentType === 'crypto') {
    positionSize = riskAmount / priceDiff;
    lots = positionSize;
    calculatedPipValue = priceDiff;
  } else {
    // Stocks
    positionSize = Math.floor(riskAmount / priceDiff);
    lots = positionSize;
    calculatedPipValue = priceDiff;
  }
  
  return {
    positionSize,
    lots,
    riskAmount,
    pipDistance,
    pipValue: calculatedPipValue,
  };
}

export function calculateATRPositionSize(
  accountBalance: number,
  riskPercent: number,
  atrValue: number,
  atrMultiplier: number,
  entryPrice: number,
  pipValue: number = 0.0001
): PositionSizeOutput {
  const stopLossDistance = atrValue * atrMultiplier;
  const stopLoss = entryPrice - stopLossDistance;
  
  return calculatePositionSize({
    accountBalance,
    riskPercent,
    entryPrice,
    stopLoss,
    instrumentType: 'forex',
    pipValue,
  });
}

export function calculateKellyCriterion(input: KellyInput): number {
  const { winProbability, winLossRatio } = input;
  const kelly = winProbability - ((1 - winProbability) / winLossRatio);
  return Math.max(0, Math.min(kelly, 1)); // Cap between 0 and 100%
}

export function calculateOptimalRisk(
  winRate: number,
  avgWinLossRatio: number,
  maxRisk: number = 0.02
): number {
  const kelly = calculateKellyCriterion({
    winProbability: winRate,
    winLossRatio: avgWinLossRatio,
  });
  
  // Use fractional Kelly (half Kelly) for safety
  const fractionalKelly = kelly * 0.5;
  
  return Math.min(fractionalKelly, maxRisk);
}

// ==================== RISK METRICS ====================

export function calculateSharpeRatio(
  returns: number[],
  riskFreeRate: number = 0.02
): number {
  if (returns.length === 0) return 0;
  
  const meanReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
  const variance = returns.reduce((sum, r) => sum + Math.pow(r - meanReturn, 2), 0) / returns.length;
  const stdDev = Math.sqrt(variance);
  
  if (stdDev === 0) return 0;
  
  return (meanReturn - riskFreeRate / 252) / stdDev * Math.sqrt(252);
}

export function calculateSortinoRatio(
  returns: number[],
  riskFreeRate: number = 0.02
): number {
  if (returns.length === 0) return 0;
  
  const meanReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
  const negativeReturns = returns.filter(r => r < 0);
  
  if (negativeReturns.length === 0) return Infinity;
  
  const downsideVariance = negativeReturns.reduce((sum, r) => sum + Math.pow(r, 2), 0) / negativeReturns.length;
  const downsideDeviation = Math.sqrt(downsideVariance);
  
  if (downsideDeviation === 0) return 0;
  
  return (meanReturn - riskFreeRate / 252) / downsideDeviation * Math.sqrt(252);
}

export function calculateMaxDrawdown(equityCurve: number[]): number {
  if (equityCurve.length === 0) return 0;
  
  let maxDrawdown = 0;
  let peak = equityCurve[0];
  
  for (const value of equityCurve) {
    if (value > peak) {
      peak = value;
    }
    const drawdown = (peak - value) / peak;
    if (drawdown > maxDrawdown) {
      maxDrawdown = drawdown;
    }
  }
  
  return maxDrawdown * 100;
}

export function calculateVaR(input: VaRInput): VaROutput {
  const { portfolioValue, confidenceLevel, timeHorizon, volatility, returns } = input;
  
  // Z-scores for common confidence levels
  const zScores: Record<number, number> = {
    0.90: 1.282,
    0.95: 1.645,
    0.99: 2.326,
  };
  
  const zScore = zScores[confidenceLevel] || 1.645;
  
  // Parametric VaR (assuming normal distribution)
  const varParametric = portfolioValue * zScore * volatility * Math.sqrt(timeHorizon / 252);
  
  // Historical VaR
  let varHistorical = 0;
  let expectedShortfall = 0;
  
  if (returns && returns.length > 0) {
    const sortedReturns = [...returns].sort((a, b) => a - b);
    const varIndex = Math.floor((1 - confidenceLevel) * sortedReturns.length);
    varHistorical = -portfolioValue * sortedReturns[varIndex];
    
    // Expected Shortfall (CVaR)
    const tailReturns = sortedReturns.slice(0, varIndex);
    expectedShortfall = -portfolioValue * (tailReturns.reduce((a, b) => a + b, 0) / tailReturns.length);
  }
  
  // Monte Carlo VaR (simplified)
  const varMonteCarlo = varParametric * 1.1; // Slight adjustment for fat tails
  
  return {
    varParametric,
    varHistorical: varHistorical || varParametric,
    varMonteCarlo,
    expectedShortfall: expectedShortfall || varMonteCarlo * 1.2,
  };
}

export function calculateMonteCarlo(input: MonteCarloInput): MonteCarloOutput {
  const { initialCapital, expectedReturn, volatility, timeHorizon, simulations, trades } = input;
  
  const paths: number[][] = [];
  const finalValues: number[] = [];
  let ruinCount = 0;
  
  for (let i = 0; i < simulations; i++) {
    const path: number[] = [initialCapital];
    let capital = initialCapital;
    
    for (let t = 1; t <= trades; t++) {
      // Geometric Brownian Motion
      const dt = timeHorizon / trades;
      const drift = expectedReturn * dt;
      const diffusion = volatility * Math.sqrt(dt) * gaussianRandom();
      
      capital = capital * Math.exp(drift + diffusion);
      path.push(capital);
      
      // Check for ruin (50% loss)
      if (capital < initialCapital * 0.5) {
        ruinCount++;
        break;
      }
    }
    
    paths.push(path);
    finalValues.push(capital);
  }
  
  // Calculate statistics
  finalValues.sort((a, b) => a - b);
  const probabilityOfRuin = ruinCount / simulations;
  const expectedValue = finalValues.reduce((a, b) => a + b, 0) / simulations;
  const valueAtRisk = initialCapital - finalValues[Math.floor(simulations * 0.05)];
  const percentile5 = finalValues[Math.floor(simulations * 0.05)];
  const percentile95 = finalValues[Math.floor(simulations * 0.95)];
  
  return {
    paths,
    finalValues,
    probabilityOfRuin,
    expectedValue,
    valueAtRisk,
    percentile5,
    percentile95,
  };
}

// Box-Muller transform for Gaussian random numbers
function gaussianRandom(): number {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

// ==================== BREAK-EVEN CALCULATIONS ====================

export function calculateBreakEven(input: BreakEvenInput): BreakEvenOutput {
  const { entryPrice, positionSize, spread, commission, slippage } = input;
  
  const spreadCost = spread;
  const commissionCost = commission / positionSize;
  const slippageCost = slippage;
  const totalCost = spreadCost + commissionCost + slippageCost;
  
  const breakEvenPrice = entryPrice + totalCost;
  const pointsToBreakEven = totalCost;
  
  return {
    breakEvenPrice,
    totalCost,
    effectiveEntry: breakEvenPrice,
    pointsToBreakEven,
  };
}

// ==================== RISK/REWARD CALCULATIONS ====================

export function calculateRiskReward(
  entryPrice: number,
  stopLoss: number,
  takeProfit: number
): {
  risk: number;
  reward: number;
  ratio: number;
  riskPercent: number;
  rewardPercent: number;
} {
  const risk = Math.abs(entryPrice - stopLoss);
  const reward = Math.abs(takeProfit - entryPrice);
  const ratio = reward / risk;
  const riskPercent = (risk / entryPrice) * 100;
  const rewardPercent = (reward / entryPrice) * 100;
  
  return { risk, reward, ratio, riskPercent, rewardPercent };
}

export function calculateOptimalStopLoss(
  entryPrice: number,
  atr: number,
  atrMultiplier: number = 2,
  direction: 'long' | 'short'
): number {
  const stopDistance = atr * atrMultiplier;
  return direction === 'long'
    ? entryPrice - stopDistance
    : entryPrice + stopDistance;
}

export function calculateOptimalTakeProfit(
  entryPrice: number,
  stopLoss: number,
  riskRewardRatio: number = 2
): number {
  const risk = Math.abs(entryPrice - stopLoss);
  const isLong = entryPrice > stopLoss;
  
  return isLong
    ? entryPrice + (risk * riskRewardRatio)
    : entryPrice - (risk * riskRewardRatio);
}

// ==================== PIP & MARGIN CALCULATIONS ====================

export function calculatePipValue(
  lotSize: number,
  pipSize: number,
  quoteCurrencyRate: number = 1
): number {
  // Standard lot = 100,000 units
  return lotSize * 100000 * pipSize * quoteCurrencyRate;
}

export function calculateMargin(
  positionSize: number,
  leverage: number,
  price: number
): number {
  return (positionSize * price) / leverage;
}

export function calculateLeverage(
  positionSize: number,
  margin: number,
  price: number
): number {
  return (positionSize * price) / margin;
}

// ==================== EXPECTANCY ====================

export function calculateExpectancy(
  winRate: number,
  avgWin: number,
  avgLoss: number
): number {
  return (winRate * avgWin) - ((1 - winRate) * avgLoss);
}

export function calculateProfitFactor(
  grossProfit: number,
  grossLoss: number
): number {
  if (grossLoss === 0) return Infinity;
  return grossProfit / Math.abs(grossLoss);
}

// ==================== VOLATILITY ====================

export function calculateVolatility(returns: number[], annualize: boolean = true): number {
  if (returns.length === 0) return 0;
  
  const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
  const variance = returns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / (returns.length - 1);
  const stdDev = Math.sqrt(variance);
  
  return annualize ? stdDev * Math.sqrt(252) : stdDev;
}

export function calculateATR(candles: Candle[], period: number = 14): number {
  if (candles.length < period) return 0;
  
  const trueRanges: number[] = [];
  
  for (let i = 1; i < candles.length; i++) {
    const high = candles[i].high;
    const low = candles[i].low;
    const prevClose = candles[i - 1].close;
    
    const tr = Math.max(
      high - low,
      Math.abs(high - prevClose),
      Math.abs(low - prevClose)
    );
    trueRanges.push(tr);
  }
  
  // Simple moving average of true ranges
  const recentTR = trueRanges.slice(-period);
  return recentTR.reduce((a, b) => a + b, 0) / period;
}

// ==================== DRAWDOWN ANALYSIS ====================

export function calculateDrawdownDistribution(equityCurve: number[]): {
  current: number;
  max: number;
  avg: number;
  duration: number;
  maxDuration: number;
} {
  if (equityCurve.length === 0) {
    return { current: 0, max: 0, avg: 0, duration: 0, maxDuration: 0 };
  }
  
  let peak = equityCurve[0];
  let currentDrawdown = 0;
  let maxDrawdown = 0;
  let currentDuration = 0;
  let maxDuration = 0;
  const drawdowns: number[] = [];
  
  for (let i = 1; i < equityCurve.length; i++) {
    const value = equityCurve[i];
    
    if (value > peak) {
      peak = value;
      if (currentDrawdown > 0) {
        drawdowns.push(currentDrawdown);
        currentDuration = 0;
      }
      currentDrawdown = 0;
    } else {
      const dd = (peak - value) / peak;
      currentDrawdown = dd;
      currentDuration++;
      
      if (dd > maxDrawdown) {
        maxDrawdown = dd;
      }
      if (currentDuration > maxDuration) {
        maxDuration = currentDuration;
      }
    }
  }
  
  const avgDrawdown = drawdowns.length > 0
    ? drawdowns.reduce((a, b) => a + b, 0) / drawdowns.length
    : 0;
  
  return {
    current: currentDrawdown * 100,
    max: maxDrawdown * 100,
    avg: avgDrawdown * 100,
    duration: currentDuration,
    maxDuration,
  };
}

// ==================== STRESS TESTING ====================

export function performStressTest(
  portfolioValue: number,
  positions: { value: number; beta: number }[],
  scenarios: { name: string; marketMove: number }[]
): { name: string; impact: number; newPortfolioValue: number }[] {
  return scenarios.map(scenario => {
    const impact = positions.reduce((sum, pos) => {
      return sum + (pos.value * pos.beta * scenario.marketMove);
    }, 0);
    
    return {
      name: scenario.name,
      impact,
      newPortfolioValue: portfolioValue + impact,
    };
  });
}

export const defaultStressScenarios = [
  { name: 'Market Crash (-20%)', marketMove: -0.20 },
  { name: 'Flash Crash (-10%)', marketMove: -0.10 },
  { name: 'Correction (-15%)', marketMove: -0.15 },
  { name: 'Rally (+10%)', marketMove: 0.10 },
  { name: 'Volatility Spike (+30%)', marketMove: 0.30 },
];
