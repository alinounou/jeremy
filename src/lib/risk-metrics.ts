// Risk Metrics Library
import type { Trade, RiskMetrics, Performance } from '@/types/trading';

// ==================== SHARPE RATIO ====================

export function sharpeRatio(returns: number[], riskFreeRate: number = 0.02): number {
  if (returns.length === 0) return 0;
  
  const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
  const variance = returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / (returns.length - 1);
  const stdDev = Math.sqrt(variance);
  
  if (stdDev === 0) return 0;
  
  // Annualize (assuming daily returns)
  const annualizedAvgReturn = avgReturn * 252;
  const annualizedStdDev = stdDev * Math.sqrt(252);
  
  return (annualizedAvgReturn - riskFreeRate) / annualizedStdDev;
}

// ==================== SORTINO RATIO ====================

export function sortinoRatio(returns: number[], riskFreeRate: number = 0.02): number {
  if (returns.length === 0) return 0;
  
  const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
  
  // Only consider negative returns for downside deviation
  const negativeReturns = returns.filter(r => r < 0);
  if (negativeReturns.length === 0) return Infinity;
  
  const downsideVariance = negativeReturns.reduce((sum, r) => sum + Math.pow(r, 2), 0) / negativeReturns.length;
  const downsideDeviation = Math.sqrt(downsideVariance);
  
  if (downsideDeviation === 0) return 0;
  
  // Annualize
  const annualizedAvgReturn = avgReturn * 252;
  const annualizedDownsideDev = downsideDeviation * Math.sqrt(252);
  
  return (annualizedAvgReturn - riskFreeRate) / annualizedDownsideDev;
}

// ==================== MAX DRAWDOWN ====================

export function maxDrawdown(equityCurve: number[]): { maxDD: number; maxDDPercent: number } {
  if (equityCurve.length === 0) return { maxDD: 0, maxDDPercent: 0 };
  
  let peak = equityCurve[0];
  let maxDD = 0;
  let maxDDPercent = 0;
  
  for (const value of equityCurve) {
    if (value > peak) peak = value;
    const dd = peak - value;
    const ddPercent = (dd / peak) * 100;
    
    if (dd > maxDD) maxDD = dd;
    if (ddPercent > maxDDPercent) maxDDPercent = ddPercent;
  }
  
  return { maxDD, maxDDPercent };
}

// ==================== RECOVERY FACTOR ====================

export function recoveryFactor(totalReturn: number, maxDrawdownValue: number): number {
  if (maxDrawdownValue === 0) return 0;
  return totalReturn / maxDrawdownValue;
}

// ==================== PROFIT FACTOR ====================

export function profitFactor(trades: Trade[]): number {
  const grossProfit = trades
    .filter(t => t.pnl > 0)
    .reduce((sum, t) => sum + t.pnl, 0);
  
  const grossLoss = Math.abs(
    trades
      .filter(t => t.pnl < 0)
      .reduce((sum, t) => sum + t.pnl, 0)
  );
  
  if (grossLoss === 0) return grossProfit > 0 ? Infinity : 0;
  return grossProfit / grossLoss;
}

// ==================== WIN RATE ====================

export function winRate(trades: Trade[]): number {
  if (trades.length === 0) return 0;
  const wins = trades.filter(t => t.pnl > 0).length;
  return (wins / trades.length) * 100;
}

// ==================== AVERAGE WIN/LOSS ====================

export function avgWinLoss(trades: Trade[]): { avgWin: number; avgLoss: number; ratio: number } {
  const wins = trades.filter(t => t.pnl > 0);
  const losses = trades.filter(t => t.pnl < 0);
  
  const avgWin = wins.length > 0 
    ? wins.reduce((sum, t) => sum + t.pnl, 0) / wins.length 
    : 0;
  
  const avgLoss = losses.length > 0 
    ? Math.abs(losses.reduce((sum, t) => sum + t.pnl, 0) / losses.length) 
    : 0;
  
  const ratio = avgLoss > 0 ? avgWin / avgLoss : avgWin > 0 ? Infinity : 0;
  
  return { avgWin, avgLoss, ratio };
}

// ==================== RISK OF RUIN ====================

export function riskOfRuin(winRate: number, avgWinLossRatio: number, capitalPercent: number): number {
  // Simplified Kelly-based risk of ruin calculation
  const p = winRate / 100;
  const q = 1 - p;
  const b = avgWinLossRatio;
  
  if (b === 0) return 100;
  
  // Kelly fraction
  const kelly = (b * p - q) / b;
  
  if (kelly <= 0) return 100;
  
  // Risk of ruin based on fraction of Kelly being used
  const kellyFraction = capitalPercent / (kelly * 100);
  
  if (kellyFraction >= 1) return 50; // Overbetting
  if (kellyFraction >= 0.5) return 10;
  if (kellyFraction >= 0.25) return 1;
  
  return 0.1;
}

// ==================== CALMAR RATIO ====================

export function calmarRatio(annualizedReturn: number, maxDDPercent: number): number {
  if (maxDDPercent === 0) return 0;
  return annualizedReturn / maxDDPercent;
}

// ==================== TREYNOR RATIO ====================

export function treynorRatio(portfolioReturn: number, riskFreeRate: number, beta: number): number {
  if (beta === 0) return 0;
  return (portfolioReturn - riskFreeRate) / beta;
}

// ==================== INFORMATION RATIO ====================

export function informationRatio(portfolioReturns: number[], benchmarkReturns: number[]): number {
  if (portfolioReturns.length !== benchmarkReturns.length || portfolioReturns.length === 0) return 0;
  
  const excessReturns = portfolioReturns.map((r, i) => r - benchmarkReturns[i]);
  const avgExcess = excessReturns.reduce((a, b) => a + b, 0) / excessReturns.length;
  const trackingError = Math.sqrt(
    excessReturns.reduce((sum, r) => sum + Math.pow(r - avgExcess, 2), 0) / (excessReturns.length - 1)
  );
  
  if (trackingError === 0) return 0;
  return avgExcess / trackingError;
}

// ==================== ALPHA & BETA ====================

export function calculateAlphaBeta(
  portfolioReturns: number[],
  benchmarkReturns: number[],
  riskFreeRate: number = 0.02
): { alpha: number; beta: number } {
  if (portfolioReturns.length !== benchmarkReturns.length || portfolioReturns.length < 2) {
    return { alpha: 0, beta: 1 };
  }
  
  const n = portfolioReturns.length;
  const avgPortfolio = portfolioReturns.reduce((a, b) => a + b, 0) / n;
  const avgBenchmark = benchmarkReturns.reduce((a, b) => a + b, 0) / n;
  
  // Covariance
  const covariance = portfolioReturns.reduce((sum, rp, i) => {
    return sum + (rp - avgPortfolio) * (benchmarkReturns[i] - avgBenchmark);
  }, 0) / (n - 1);
  
  // Variance of benchmark
  const benchmarkVariance = benchmarkReturns.reduce((sum, rb) => {
    return sum + Math.pow(rb - avgBenchmark, 2);
  }, 0) / (n - 1);
  
  const beta = benchmarkVariance > 0 ? covariance / benchmarkVariance : 1;
  
  // Jensen's Alpha (annualized)
  const dailyRf = riskFreeRate / 252;
  const alpha = (avgPortfolio - dailyRf) - beta * (avgBenchmark - dailyRf);
  const annualizedAlpha = alpha * 252;
  
  return { alpha: annualizedAlpha, beta };
}

// ==================== COMPREHENSIVE RISK METRICS ====================

export function calculateRiskMetrics(
  equityCurve: number[],
  trades: Trade[],
  benchmarkReturns?: number[]
): RiskMetrics {
  if (equityCurve.length < 2) {
    return {
      valueAtRisk: 0,
      valueAtRiskPercent: 0,
      expectedShortfall: 0,
      sharpeRatio: 0,
      sortinoRatio: 0,
      maxDrawdown: 0,
      maxDrawdownPercent: 0,
      recoveryFactor: 0,
      profitFactor: 0,
      winRate: 0,
      avgWin: 0,
      avgLoss: 0,
      riskOfRuin: 0,
      kellyPercentage: 0,
    };
  }
  
  // Calculate returns from equity curve
  const returns: number[] = [];
  for (let i = 1; i < equityCurve.length; i++) {
    returns.push((equityCurve[i] - equityCurve[i - 1]) / equityCurve[i - 1]);
  }
  
  const { maxDD, maxDDPercent } = maxDrawdown(equityCurve);
  const { avgWin, avgLoss, ratio: avgWinLossRatio } = avgWinLoss(trades);
  const wr = winRate(trades);
  
  // Kelly percentage
  const p = wr / 100;
  const q = 1 - p;
  const kellyPercentage = avgWinLossRatio > 0 ? ((avgWinLossRatio * p - q) / avgWinLossRatio) * 100 : 0;
  
  // VaR (95% confidence)
  const sortedReturns = [...returns].sort((a, b) => a - b);
  const varIndex = Math.floor(sortedReturns.length * 0.05);
  const var95 = -sortedReturns[varIndex];
  const esReturns = sortedReturns.slice(0, varIndex);
  const expectedShortfall = -esReturns.reduce((a, b) => a + b, 0) / esReturns.length;
  
  return {
    valueAtRisk: var95 * equityCurve[equityCurve.length - 1],
    valueAtRiskPercent: var95 * 100,
    expectedShortfall: expectedShortfall * equityCurve[equityCurve.length - 1],
    sharpeRatio: sharpeRatio(returns),
    sortinoRatio: sortinoRatio(returns),
    maxDrawdown: maxDD,
    maxDrawdownPercent: maxDDPercent,
    recoveryFactor: recoveryFactor(equityCurve[equityCurve.length - 1] - equityCurve[0], maxDD),
    profitFactor: profitFactor(trades),
    winRate: wr,
    avgWin,
    avgLoss,
    riskOfRuin: riskOfRuin(wr, avgWinLossRatio, 2), // Assuming 2% risk per trade
    kellyPercentage: Math.max(0, Math.min(25, kellyPercentage)), // Cap at 25%
  };
}

// ==================== PERFORMANCE METRICS ====================

export function calculatePerformance(
  equityCurve: number[],
  benchmarkReturns?: number[]
): Performance {
  if (equityCurve.length < 2) {
    return {
      totalReturn: 0,
      totalReturnPercent: 0,
      annualizedReturn: 0,
      volatility: 0,
      beta: 1,
      alpha: 0,
      informationRatio: 0,
      trackingError: 0,
      calmarRatio: 0,
      treynorRatio: 0,
    };
  }
  
  const returns: number[] = [];
  for (let i = 1; i < equityCurve.length; i++) {
    returns.push((equityCurve[i] - equityCurve[i - 1]) / equityCurve[i - 1]);
  }
  
  const totalReturn = equityCurve[equityCurve.length - 1] - equityCurve[0];
  const totalReturnPercent = (totalReturn / equityCurve[0]) * 100;
  
  // Annualize based on days
  const days = equityCurve.length;
  const annualizedReturn = (Math.pow(1 + totalReturnPercent / 100, 365 / days) - 1) * 100;
  
  // Volatility (annualized)
  const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
  const variance = returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / (returns.length - 1);
  const volatility = Math.sqrt(variance) * Math.sqrt(252) * 100;
  
  const { maxDDPercent } = maxDrawdown(equityCurve);
  
  return {
    totalReturn,
    totalReturnPercent,
    annualizedReturn,
    volatility,
    beta: 1,
    alpha: 0,
    informationRatio: 0,
    trackingError: volatility,
    calmarRatio: maxDDPercent > 0 ? annualizedReturn / maxDDPercent : 0,
    treynorRatio: 0,
  };
}

// ==================== EXPECTED SHORTFALL (CVaR) ====================

export function expectedShortfall(returns: number[], confidenceLevel: number = 0.95): number {
  const sortedReturns = [...returns].sort((a, b) => a - b);
  const cutoffIndex = Math.floor(sortedReturns.length * (1 - confidenceLevel));
  
  const tailReturns = sortedReturns.slice(0, cutoffIndex + 1);
  return -tailReturns.reduce((a, b) => a + b, 0) / tailReturns.length;
}
