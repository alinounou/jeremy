'use client';

import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, Shield, Zap, Users, Award, ChevronRight, Check, 
  Play, Star, Clock, DollarSign, Target, BarChart3, Globe,
  Menu, X, ArrowRight, ChevronDown, Calculator, Activity,
  Layers, LineChart, PieChart, Settings, ExternalLink, Sparkles,
  BookOpen, Download, ShoppingBag, Percent, TrendingDown
} from 'lucide-react';

// Helper function to safely parse numbers
const parseNum = (value: string, fallback: number): number => {
  const parsed = parseFloat(value);
  return isNaN(parsed) ? fallback : parsed;
};

// ==================== LIVE CLOCK COMPONENT ====================
function LiveClock() {
  const [time, setTime] = useState<string>('');
  const [date, setDate] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Add 1 hour
      const futureTime = new Date(now.getTime() + 60 * 60 * 1000);
      
      const hours = futureTime.getHours().toString().padStart(2, '0');
      const minutes = futureTime.getMinutes().toString().padStart(2, '0');
      const seconds = futureTime.getSeconds().toString().padStart(2, '0');
      
      setTime(`${hours}:${minutes}:${seconds}`);
      
      const options: Intl.DateTimeFormatOptions = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      };
      setDate(futureTime.toLocaleDateString('en-US', options));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-cyan-600/20 rounded-xl p-6 border border-white/10">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-purple-400 font-semibold mb-1">CURRENT TIME (+1 HOUR)</div>
          <div className="text-4xl font-mono font-bold text-white">{time}</div>
          <div className="text-sm text-gray-400 mt-1">{date}</div>
        </div>
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-cyan-400 flex items-center justify-center">
          <Clock className="w-8 h-8 text-white" />
        </div>
      </div>
    </div>
  );
}

// ==================== TRADING CALCULATORS ====================

// Pivot Point Calculator
function PivotCalculator() {
  const [high, setHigh] = useState(1.0950);
  const [low, setLow] = useState(1.0850);
  const [close, setClose] = useState(1.0900);

  const pivot = (high + low + close) / 3;
  const r1 = (2 * pivot) - low;
  const s1 = (2 * pivot) - high;
  const r2 = pivot + (high - low);
  const s2 = pivot - (high - low);
  const r3 = high + 2 * (pivot - low);
  const s3 = low - 2 * (high - pivot);

  return (
    <div className="bg-[#12121a] rounded-xl p-4 border border-white/10">
      <h4 className="font-semibold mb-3 flex items-center gap-2 text-cyan-400">
        <Layers size={18} /> Pivot Points
      </h4>
      <div className="grid grid-cols-3 gap-2 mb-3">
        <input type="number" step="0.0001" value={high} 
          onChange={(e) => setHigh(parseNum(e.target.value, high))}
          className="p-2 rounded bg-white/5 border border-white/10 text-sm" placeholder="High" />
        <input type="number" step="0.0001" value={low} 
          onChange={(e) => setLow(parseNum(e.target.value, low))}
          className="p-2 rounded bg-white/5 border border-white/10 text-sm" placeholder="Low" />
        <input type="number" step="0.0001" value={close} 
          onChange={(e) => setClose(parseNum(e.target.value, close))}
          className="p-2 rounded bg-white/5 border border-white/10 text-sm" placeholder="Close" />
      </div>
      <div className="space-y-1 text-xs">
        <div className="flex justify-between"><span className="text-gray-400">R3:</span><span className="text-red-400 font-mono">{r3.toFixed(5)}</span></div>
        <div className="flex justify-between"><span className="text-gray-400">R2:</span><span className="text-red-400 font-mono">{r2.toFixed(5)}</span></div>
        <div className="flex justify-between"><span className="text-gray-400">R1:</span><span className="text-orange-400 font-mono">{r1.toFixed(5)}</span></div>
        <div className="flex justify-between font-semibold"><span className="text-white">PIVOT:</span><span className="text-yellow-400 font-mono">{pivot.toFixed(5)}</span></div>
        <div className="flex justify-between"><span className="text-gray-400">S1:</span><span className="text-green-400 font-mono">{s1.toFixed(5)}</span></div>
        <div className="flex justify-between"><span className="text-gray-400">S2:</span><span className="text-green-400 font-mono">{s2.toFixed(5)}</span></div>
        <div className="flex justify-between"><span className="text-gray-400">S3:</span><span className="text-green-400 font-mono">{s3.toFixed(5)}</span></div>
      </div>
    </div>
  );
}

// Fibonacci Calculator
function FibonacciCalculator() {
  const [high, setHigh] = useState(1.1000);
  const [low, setLow] = useState(1.0800);
  const [direction, setDirection] = useState<'up' | 'down'>('up');

  const diff = high - low;
  const levels = {
    '0%': direction === 'up' ? low : high,
    '23.6%': direction === 'up' ? low + diff * 0.236 : high - diff * 0.236,
    '38.2%': direction === 'up' ? low + diff * 0.382 : high - diff * 0.382,
    '50%': direction === 'up' ? low + diff * 0.5 : high - diff * 0.5,
    '61.8%': direction === 'up' ? low + diff * 0.618 : high - diff * 0.618,
    '78.6%': direction === 'up' ? low + diff * 0.786 : high - diff * 0.786,
    '100%': direction === 'up' ? high : low,
  };

  return (
    <div className="bg-[#12121a] rounded-xl p-4 border border-white/10">
      <h4 className="font-semibold mb-3 flex items-center gap-2 text-purple-400">
        <LineChart size={18} /> Fibonacci Retracement
      </h4>
      <div className="flex gap-2 mb-3">
        <input type="number" step="0.0001" value={high} 
          onChange={(e) => setHigh(parseNum(e.target.value, high))}
          className="flex-1 p-2 rounded bg-white/5 border border-white/10 text-sm" placeholder="High" />
        <input type="number" step="0.0001" value={low} 
          onChange={(e) => setLow(parseNum(e.target.value, low))}
          className="flex-1 p-2 rounded bg-white/5 border border-white/10 text-sm" placeholder="Low" />
      </div>
      <div className="flex gap-2 mb-3">
        <button onClick={() => setDirection('up')} 
          className={`flex-1 py-1.5 rounded text-xs font-medium ${direction === 'up' ? 'bg-green-500/20 text-green-400' : 'bg-white/5 text-gray-400'}`}>
          Uptrend
        </button>
        <button onClick={() => setDirection('down')}
          className={`flex-1 py-1.5 rounded text-xs font-medium ${direction === 'down' ? 'bg-red-500/20 text-red-400' : 'bg-white/5 text-gray-400'}`}>
          Downtrend
        </button>
      </div>
      <div className="space-y-1 text-xs">
        {Object.entries(levels).map(([level, price]) => (
          <div key={level} className="flex justify-between">
            <span className="text-gray-400">{level}</span>
            <span className="font-mono text-yellow-400">{price.toFixed(5)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Position Size Calculator
function PositionSizeCalculator() {
  const [balance, setBalance] = useState(10000);
  const [risk, setRisk] = useState(2);
  const [entry, setEntry] = useState(1.0900);
  const [stopLoss, setStopLoss] = useState(1.0850);

  const riskAmount = balance * (risk / 100);
  const pipDiff = Math.abs(entry - stopLoss) * 10000;
  const lotSize = pipDiff > 0 ? riskAmount / (pipDiff * 10) : 0;

  return (
    <div className="bg-[#12121a] rounded-xl p-4 border border-white/10">
      <h4 className="font-semibold mb-3 flex items-center gap-2 text-blue-400">
        <Calculator size={18} /> Position Size
      </h4>
      <div className="grid grid-cols-2 gap-2 mb-3">
        <input type="number" value={balance} 
          onChange={(e) => setBalance(parseNum(e.target.value, balance))}
          className="p-2 rounded bg-white/5 border border-white/10 text-sm" placeholder="Balance" />
        <input type="number" value={risk} 
          onChange={(e) => setRisk(parseNum(e.target.value, risk))}
          className="p-2 rounded bg-white/5 border border-white/10 text-sm" placeholder="Risk %" />
        <input type="number" step="0.0001" value={entry} 
          onChange={(e) => setEntry(parseNum(e.target.value, entry))}
          className="p-2 rounded bg-white/5 border border-white/10 text-sm" placeholder="Entry" />
        <input type="number" step="0.0001" value={stopLoss} 
          onChange={(e) => setStopLoss(parseNum(e.target.value, stopLoss))}
          className="p-2 rounded bg-white/5 border border-white/10 text-sm" placeholder="Stop Loss" />
      </div>
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="bg-white/5 rounded p-2">
          <div className="text-xs text-gray-400">Lot Size</div>
          <div className="font-mono text-green-400 font-bold">{lotSize.toFixed(2)}</div>
        </div>
        <div className="bg-white/5 rounded p-2">
          <div className="text-xs text-gray-400">Risk $</div>
          <div className="font-mono text-red-400 font-bold">${riskAmount.toFixed(2)}</div>
        </div>
        <div className="bg-white/5 rounded p-2">
          <div className="text-xs text-gray-400">Pips</div>
          <div className="font-mono text-yellow-400 font-bold">{pipDiff.toFixed(1)}</div>
        </div>
      </div>
    </div>
  );
}

// Risk/Reward Calculator
function RiskRewardCalculator() {
  const [entry, setEntry] = useState(1.0900);
  const [stopLoss, setStopLoss] = useState(1.0850);
  const [takeProfit, setTakeProfit] = useState(1.1000);

  const risk = Math.abs(entry - stopLoss) * 10000;
  const reward = Math.abs(takeProfit - entry) * 10000;
  const ratio = risk > 0 ? reward / risk : 0;

  return (
    <div className="bg-[#12121a] rounded-xl p-4 border border-white/10">
      <h4 className="font-semibold mb-3 flex items-center gap-2 text-orange-400">
        <Target size={18} /> Risk/Reward
      </h4>
      <div className="grid grid-cols-3 gap-2 mb-3">
        <input type="number" step="0.0001" value={entry} 
          onChange={(e) => setEntry(parseNum(e.target.value, entry))}
          className="p-2 rounded bg-white/5 border border-white/10 text-sm" placeholder="Entry" />
        <input type="number" step="0.0001" value={stopLoss} 
          onChange={(e) => setStopLoss(parseNum(e.target.value, stopLoss))}
          className="p-2 rounded bg-white/5 border border-white/10 text-sm" placeholder="SL" />
        <input type="number" step="0.0001" value={takeProfit} 
          onChange={(e) => setTakeProfit(parseNum(e.target.value, takeProfit))}
          className="p-2 rounded bg-white/5 border border-white/10 text-sm" placeholder="TP" />
      </div>
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="bg-red-500/10 rounded p-2">
          <div className="text-xs text-gray-400">Risk (pips)</div>
          <div className="font-mono text-red-400 font-bold">{risk.toFixed(1)}</div>
        </div>
        <div className="bg-green-500/10 rounded p-2">
          <div className="text-xs text-gray-400">Reward (pips)</div>
          <div className="font-mono text-green-400 font-bold">{reward.toFixed(1)}</div>
        </div>
        <div className="bg-yellow-500/10 rounded p-2">
          <div className="text-xs text-gray-400">R:R Ratio</div>
          <div className="font-mono text-yellow-400 font-bold">1:{ratio.toFixed(1)}</div>
        </div>
      </div>
    </div>
  );
}

// Margin Calculator
function MarginCalculator() {
  const [balance, setBalance] = useState(10000);
  const [leverage, setLeverage] = useState(100);
  const [lotSize, setLotSize] = useState(1);
  const [price, setPrice] = useState(1.0900);

  const margin = leverage > 0 ? (lotSize * 100000 * price) / leverage : 0;
  const marginPercent = balance > 0 ? (margin / balance) * 100 : 0;

  return (
    <div className="bg-[#12121a] rounded-xl p-4 border border-white/10">
      <h4 className="font-semibold mb-3 flex items-center gap-2 text-green-400">
        <PieChart size={18} /> Margin Calculator
      </h4>
      <div className="grid grid-cols-2 gap-2 mb-3">
        <input type="number" value={balance} 
          onChange={(e) => setBalance(parseNum(e.target.value, balance))}
          className="p-2 rounded bg-white/5 border border-white/10 text-sm" placeholder="Balance" />
        <input type="number" value={leverage} 
          onChange={(e) => setLeverage(parseNum(e.target.value, leverage))}
          className="p-2 rounded bg-white/5 border border-white/10 text-sm" placeholder="Leverage" />
        <input type="number" step="0.01" value={lotSize} 
          onChange={(e) => setLotSize(parseNum(e.target.value, lotSize))}
          className="p-2 rounded bg-white/5 border border-white/10 text-sm" placeholder="Lots" />
        <input type="number" step="0.0001" value={price} 
          onChange={(e) => setPrice(parseNum(e.target.value, price))}
          className="p-2 rounded bg-white/5 border border-white/10 text-sm" placeholder="Price" />
      </div>
      <div className="grid grid-cols-2 gap-2 text-center">
        <div className="bg-white/5 rounded p-2">
          <div className="text-xs text-gray-400">Required Margin</div>
          <div className="font-mono text-cyan-400 font-bold">${margin.toFixed(2)}</div>
        </div>
        <div className="bg-white/5 rounded p-2">
          <div className="text-xs text-gray-400">Margin %</div>
          <div className="font-mono text-purple-400 font-bold">{marginPercent.toFixed(2)}%</div>
        </div>
      </div>
    </div>
  );
}

// Profit Calculator
function ProfitCalculator() {
  const [entry, setEntry] = useState(1.0900);
  const [exit, setExit] = useState(1.1000);
  const [lots, setLots] = useState(1);
  const [type, setType] = useState<'buy' | 'sell'>('buy');

  const pips = type === 'buy' ? (exit - entry) * 10000 : (entry - exit) * 10000;
  const profit = pips * 10 * lots;

  return (
    <div className="bg-[#12121a] rounded-xl p-4 border border-white/10">
      <h4 className="font-semibold mb-3 flex items-center gap-2 text-yellow-400">
        <DollarSign size={18} /> Profit Calculator
      </h4>
      <div className="flex gap-2 mb-3">
        <button onClick={() => setType('buy')}
          className={`flex-1 py-1.5 rounded text-xs font-medium ${type === 'buy' ? 'bg-green-500/20 text-green-400' : 'bg-white/5 text-gray-400'}`}>
          BUY
        </button>
        <button onClick={() => setType('sell')}
          className={`flex-1 py-1.5 rounded text-xs font-medium ${type === 'sell' ? 'bg-red-500/20 text-red-400' : 'bg-white/5 text-gray-400'}`}>
          SELL
        </button>
      </div>
      <div className="grid grid-cols-3 gap-2 mb-3">
        <input type="number" step="0.0001" value={entry} 
          onChange={(e) => setEntry(parseNum(e.target.value, entry))}
          className="p-2 rounded bg-white/5 border border-white/10 text-sm" placeholder="Entry" />
        <input type="number" step="0.0001" value={exit} 
          onChange={(e) => setExit(parseNum(e.target.value, exit))}
          className="p-2 rounded bg-white/5 border border-white/10 text-sm" placeholder="Exit" />
        <input type="number" step="0.01" value={lots} 
          onChange={(e) => setLots(parseNum(e.target.value, lots))}
          className="p-2 rounded bg-white/5 border border-white/10 text-sm" placeholder="Lots" />
      </div>
      <div className="grid grid-cols-2 gap-2 text-center">
        <div className="bg-white/5 rounded p-2">
          <div className="text-xs text-gray-400">Pips</div>
          <div className={`font-mono font-bold ${pips >= 0 ? 'text-green-400' : 'text-red-400'}`}>{pips.toFixed(1)}</div>
        </div>
        <div className="bg-white/5 rounded p-2">
          <div className="text-xs text-gray-400">Profit</div>
          <div className={`font-mono font-bold ${profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>${profit.toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
}

// ==================== ADDITIONAL CALCULATORS ====================

// Pip Value Calculator
function PipValueCalculator() {
  const [lotSize, setLotSize] = useState(1);
  const [pair, setPair] = useState('EURUSD');

  const pipValues: Record<string, number> = {
    'EURUSD': 10, 'GBPUSD': 10, 'AUDUSD': 10, 'NZDUSD': 10,
    'USDJPY': 6.75, 'EURJPY': 6.75, 'GBPJPY': 6.75,
    'USDCHF': 11.20, 'EURCHF': 11.20,
    'USDCAD': 7.35, 'XAUUSD': 10
  };

  const pipValue = lotSize * (pipValues[pair] || 10);

  return (
    <div className="bg-[#12121a] rounded-xl p-4 border border-white/10">
      <h4 className="font-semibold mb-3 flex items-center gap-2 text-pink-400">
        <Activity size={18} /> Pip Value
      </h4>
      <div className="grid grid-cols-2 gap-2 mb-3">
        <input type="number" step="0.01" value={lotSize} 
          onChange={(e) => setLotSize(parseNum(e.target.value, lotSize))}
          className="p-2 rounded bg-white/5 border border-white/10 text-sm" placeholder="Lot Size" />
        <select value={pair} onChange={(e) => setPair(e.target.value)}
          className="p-2 rounded bg-white/5 border border-white/10 text-sm text-white">
          <option value="EURUSD">EUR/USD</option>
          <option value="GBPUSD">GBP/USD</option>
          <option value="USDJPY">USD/JPY</option>
          <option value="AUDUSD">AUD/USD</option>
          <option value="USDCAD">USD/CAD</option>
          <option value="XAUUSD">XAU/USD</option>
        </select>
      </div>
      <div className="bg-white/5 rounded p-3 text-center">
        <div className="text-xs text-gray-400">Pip Value (per lot)</div>
        <div className="font-mono text-pink-400 font-bold text-xl">${pipValue.toFixed(2)}</div>
      </div>
    </div>
  );
}

// Compounding Calculator
function CompoundingCalculator() {
  const [initial, setInitial] = useState(1000);
  const [monthlyReturn, setMonthlyReturn] = useState(10);
  const [months, setMonths] = useState(12);

  const calculateCompound = () => {
    let total = initial;
    for (let i = 0; i < months; i++) {
      total += total * (monthlyReturn / 100);
    }
    return total;
  };

  const finalAmount = calculateCompound();
  const profit = finalAmount - initial;

  return (
    <div className="bg-[#12121a] rounded-xl p-4 border border-white/10">
      <h4 className="font-semibold mb-3 flex items-center gap-2 text-indigo-400">
        <TrendingUp size={18} /> Compounding
      </h4>
      <div className="grid grid-cols-3 gap-2 mb-3">
        <input type="number" value={initial} 
          onChange={(e) => setInitial(parseNum(e.target.value, initial))}
          className="p-2 rounded bg-white/5 border border-white/10 text-sm" placeholder="Initial $" />
        <input type="number" value={monthlyReturn} 
          onChange={(e) => setMonthlyReturn(parseNum(e.target.value, monthlyReturn))}
          className="p-2 rounded bg-white/5 border border-white/10 text-sm" placeholder="Return %" />
        <input type="number" value={months} 
          onChange={(e) => setMonths(parseNum(e.target.value, months))}
          className="p-2 rounded bg-white/5 border border-white/10 text-sm" placeholder="Months" />
      </div>
      <div className="grid grid-cols-2 gap-2 text-center">
        <div className="bg-white/5 rounded p-2">
          <div className="text-xs text-gray-400">Final Amount</div>
          <div className="font-mono text-indigo-400 font-bold">${finalAmount.toFixed(2)}</div>
        </div>
        <div className="bg-white/5 rounded p-2">
          <div className="text-xs text-gray-400">Total Profit</div>
          <div className="font-mono text-green-400 font-bold">${profit.toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
}

// Drawdown Calculator
function DrawdownCalculator() {
  const [peak, setPeak] = useState(10000);
  const [current, setCurrent] = useState(8000);

  const drawdown = peak > 0 ? ((peak - current) / peak) * 100 : 0;
  const recoveryPercent = current > 0 ? ((peak - current) / current) * 100 : 0;

  return (
    <div className="bg-[#12121a] rounded-xl p-4 border border-white/10">
      <h4 className="font-semibold mb-3 flex items-center gap-2 text-red-400">
        <TrendingDown size={18} /> Drawdown
      </h4>
      <div className="grid grid-cols-2 gap-2 mb-3">
        <input type="number" value={peak} 
          onChange={(e) => setPeak(parseNum(e.target.value, peak))}
          className="p-2 rounded bg-white/5 border border-white/10 text-sm" placeholder="Peak Balance" />
        <input type="number" value={current} 
          onChange={(e) => setCurrent(parseNum(e.target.value, current))}
          className="p-2 rounded bg-white/5 border border-white/10 text-sm" placeholder="Current Balance" />
      </div>
      <div className="grid grid-cols-2 gap-2 text-center">
        <div className="bg-red-500/10 rounded p-2">
          <div className="text-xs text-gray-400">Drawdown %</div>
          <div className="font-mono text-red-400 font-bold">{drawdown.toFixed(2)}%</div>
        </div>
        <div className="bg-yellow-500/10 rounded p-2">
          <div className="text-xs text-gray-400">Recovery Needed</div>
          <div className="font-mono text-yellow-400 font-bold">{recoveryPercent.toFixed(2)}%</div>
        </div>
      </div>
    </div>
  );
}

// Lot Size from Risk Calculator
function LotSizeFromRiskCalculator() {
  const [balance, setBalance] = useState(10000);
  const [riskPercent, setRiskPercent] = useState(1);
  const [stopLossPips, setStopLossPips] = useState(50);
  const [pipValue, setPipValue] = useState(10);

  const riskAmount = balance * (riskPercent / 100);
  const lotSize = stopLossPips > 0 ? riskAmount / (stopLossPips * pipValue) : 0;

  return (
    <div className="bg-[#12121a] rounded-xl p-4 border border-white/10">
      <h4 className="font-semibold mb-3 flex items-center gap-2 text-teal-400">
        <Percent size={18} /> Lot from Risk
      </h4>
      <div className="grid grid-cols-2 gap-2 mb-3">
        <input type="number" value={balance} 
          onChange={(e) => setBalance(parseNum(e.target.value, balance))}
          className="p-2 rounded bg-white/5 border border-white/10 text-sm" placeholder="Balance" />
        <input type="number" value={riskPercent} 
          onChange={(e) => setRiskPercent(parseNum(e.target.value, riskPercent))}
          className="p-2 rounded bg-white/5 border border-white/10 text-sm" placeholder="Risk %" />
        <input type="number" value={stopLossPips} 
          onChange={(e) => setStopLossPips(parseNum(e.target.value, stopLossPips))}
          className="p-2 rounded bg-white/5 border border-white/10 text-sm" placeholder="SL Pips" />
        <input type="number" value={pipValue} 
          onChange={(e) => setPipValue(parseNum(e.target.value, pipValue))}
          className="p-2 rounded bg-white/5 border border-white/10 text-sm" placeholder="Pip Value" />
      </div>
      <div className="grid grid-cols-2 gap-2 text-center">
        <div className="bg-white/5 rounded p-2">
          <div className="text-xs text-gray-400">Lot Size</div>
          <div className="font-mono text-teal-400 font-bold">{lotSize.toFixed(2)}</div>
        </div>
        <div className="bg-white/5 rounded p-2">
          <div className="text-xs text-gray-400">Risk Amount</div>
          <div className="font-mono text-red-400 font-bold">${riskAmount.toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
}

// ==================== ELITE ANALYTICS CALCULATORS ====================

// Win Rate Calculator
function WinRateCalculator() {
  const [wins, setWins] = useState(60);
  const [losses, setLosses] = useState(40);

  const total = wins + losses;
  const winRate = total > 0 ? (wins / total) * 100 : 0;

  return (
    <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-xl p-4 border border-purple-500/30">
      <h4 className="font-semibold mb-3 flex items-center gap-2 text-purple-300">
        <Award size={18} /> Win Rate Analytics
      </h4>
      <div className="grid grid-cols-2 gap-2 mb-3">
        <input type="number" value={wins} 
          onChange={(e) => setWins(parseNum(e.target.value, wins))}
          className="p-2 rounded bg-white/5 border border-white/10 text-sm" placeholder="Wins" />
        <input type="number" value={losses} 
          onChange={(e) => setLosses(parseNum(e.target.value, losses))}
          className="p-2 rounded bg-white/5 border border-white/10 text-sm" placeholder="Losses" />
      </div>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Total Trades:</span>
          <span className="font-mono text-white">{total}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Win Rate:</span>
          <span className={`font-mono font-bold ${winRate >= 50 ? 'text-green-400' : 'text-red-400'}`}>{winRate.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-2">
          <div className="bg-gradient-to-r from-green-500 to-cyan-400 h-2 rounded-full transition-all" style={{width: `${winRate}%`}}></div>
        </div>
      </div>
    </div>
  );
}

// Expectancy Calculator
function ExpectancyCalculator() {
  const [winRate, setWinRate] = useState(55);
  const [avgWin, setAvgWin] = useState(100);
  const [avgLoss, setAvgLoss] = useState(50);

  const expectancy = (winRate / 100 * avgWin) - ((100 - winRate) / 100 * avgLoss);

  return (
    <div className="bg-gradient-to-br from-cyan-900/30 to-green-900/30 rounded-xl p-4 border border-cyan-500/30">
      <h4 className="font-semibold mb-3 flex items-center gap-2 text-cyan-300">
        <BarChart3 size={18} /> Expectancy
      </h4>
      <div className="grid grid-cols-3 gap-2 mb-3">
        <input type="number" value={winRate} 
          onChange={(e) => setWinRate(parseNum(e.target.value, winRate))}
          className="p-2 rounded bg-white/5 border border-white/10 text-sm" placeholder="Win %" />
        <input type="number" value={avgWin} 
          onChange={(e) => setAvgWin(parseNum(e.target.value, avgWin))}
          className="p-2 rounded bg-white/5 border border-white/10 text-sm" placeholder="Avg Win $" />
        <input type="number" value={avgLoss} 
          onChange={(e) => setAvgLoss(parseNum(e.target.value, avgLoss))}
          className="p-2 rounded bg-white/5 border border-white/10 text-sm" placeholder="Avg Loss $" />
      </div>
      <div className="bg-white/5 rounded p-3 text-center">
        <div className="text-xs text-gray-400">Expectancy per Trade</div>
        <div className={`font-mono font-bold text-xl ${expectancy >= 0 ? 'text-green-400' : 'text-red-400'}`}>
          ${expectancy.toFixed(2)}
        </div>
        <div className="text-xs text-gray-500 mt-1">
          {expectancy > 0 ? 'Profitable System' : 'Unprofitable System'}
        </div>
      </div>
    </div>
  );
}

// Risk of Ruin Calculator
function RiskOfRuinCalculator() {
  const [winRate, setWinRate] = useState(55);
  const [riskPercent, setRiskPercent] = useState(2);
  const [rrRatio, setRrRatio] = useState(2);

  // Simplified risk of ruin formula approximation
  const edge = (winRate / 100 * rrRatio) - ((100 - winRate) / 100);
  const riskOfRuin = edge > 0 ? Math.pow(1 - (edge / (edge + 1)), 100 / riskPercent) * 100 : 100;

  return (
    <div className="bg-gradient-to-br from-red-900/30 to-orange-900/30 rounded-xl p-4 border border-red-500/30">
      <h4 className="font-semibold mb-3 flex items-center gap-2 text-red-300">
        <Shield size={18} /> Risk of Ruin
      </h4>
      <div className="grid grid-cols-3 gap-2 mb-3">
        <input type="number" value={winRate} 
          onChange={(e) => setWinRate(parseNum(e.target.value, winRate))}
          className="p-2 rounded bg-white/5 border border-white/10 text-sm" placeholder="Win %" />
        <input type="number" value={riskPercent} 
          onChange={(e) => setRiskPercent(parseNum(e.target.value, riskPercent))}
          className="p-2 rounded bg-white/5 border border-white/10 text-sm" placeholder="Risk %" />
        <input type="number" value={rrRatio} 
          onChange={(e) => setRrRatio(parseNum(e.target.value, rrRatio))}
          className="p-2 rounded bg-white/5 border border-white/10 text-sm" placeholder="R:R" />
      </div>
      <div className="bg-white/5 rounded p-3 text-center">
        <div className="text-xs text-gray-400">Risk of Ruin</div>
        <div className={`font-mono font-bold text-xl ${riskOfRuin < 1 ? 'text-green-400' : riskOfRuin < 10 ? 'text-yellow-400' : 'text-red-400'}`}>
          {riskOfRuin.toFixed(2)}%
        </div>
        <div className="text-xs text-gray-500 mt-1">
          {riskOfRuin < 1 ? 'Excellent Risk Management' : riskOfRuin < 10 ? 'Acceptable' : 'High Risk'}
        </div>
      </div>
    </div>
  );
}

// Kelly Criterion Calculator
function KellyCriterionCalculator() {
  const [winRate, setWinRate] = useState(55);
  const [avgWin, setAvgWin] = useState(100);
  const [avgLoss, setAvgLoss] = useState(50);

  const winProb = winRate / 100;
  const lossProb = 1 - winProb;
  const ratio = avgWin / avgLoss;
  const kelly = ((winProb * ratio) - lossProb) / ratio;
  const kellyPercent = kelly > 0 ? kelly * 100 : 0;
  const halfKelly = kellyPercent / 2;

  return (
    <div className="bg-gradient-to-br from-yellow-900/30 to-amber-900/30 rounded-xl p-4 border border-yellow-500/30">
      <h4 className="font-semibold mb-3 flex items-center gap-2 text-yellow-300">
        <Sparkles size={18} /> Kelly Criterion
      </h4>
      <div className="grid grid-cols-3 gap-2 mb-3">
        <input type="number" value={winRate} 
          onChange={(e) => setWinRate(parseNum(e.target.value, winRate))}
          className="p-2 rounded bg-white/5 border border-white/10 text-sm" placeholder="Win %" />
        <input type="number" value={avgWin} 
          onChange={(e) => setAvgWin(parseNum(e.target.value, avgWin))}
          className="p-2 rounded bg-white/5 border border-white/10 text-sm" placeholder="Avg Win $" />
        <input type="number" value={avgLoss} 
          onChange={(e) => setAvgLoss(parseNum(e.target.value, avgLoss))}
          className="p-2 rounded bg-white/5 border border-white/10 text-sm" placeholder="Avg Loss $" />
      </div>
      <div className="grid grid-cols-2 gap-2 text-center">
        <div className="bg-white/5 rounded p-2">
          <div className="text-xs text-gray-400">Kelly %</div>
          <div className={`font-mono font-bold ${kellyPercent > 0 ? 'text-yellow-400' : 'text-red-400'}`}>
            {kellyPercent.toFixed(1)}%
          </div>
        </div>
        <div className="bg-white/5 rounded p-2">
          <div className="text-xs text-gray-400">Half Kelly (Safer)</div>
          <div className="font-mono text-green-400 font-bold">{halfKelly.toFixed(1)}%</div>
        </div>
      </div>
    </div>
  );
}

// Profit Factor Calculator
function ProfitFactorCalculator() {
  const [grossProfit, setGrossProfit] = useState(15000);
  const [grossLoss, setGrossLoss] = useState(8000);

  const profitFactor = grossLoss > 0 ? grossProfit / grossLoss : 0;

  return (
    <div className="bg-gradient-to-br from-green-900/30 to-teal-900/30 rounded-xl p-4 border border-green-500/30">
      <h4 className="font-semibold mb-3 flex items-center gap-2 text-green-300">
        <TrendingUp size={18} /> Profit Factor
      </h4>
      <div className="grid grid-cols-2 gap-2 mb-3">
        <input type="number" value={grossProfit} 
          onChange={(e) => setGrossProfit(parseNum(e.target.value, grossProfit))}
          className="p-2 rounded bg-white/5 border border-white/10 text-sm" placeholder="Gross Profit $" />
        <input type="number" value={grossLoss} 
          onChange={(e) => setGrossLoss(parseNum(e.target.value, grossLoss))}
          className="p-2 rounded bg-white/5 border border-white/10 text-sm" placeholder="Gross Loss $" />
      </div>
      <div className="bg-white/5 rounded p-3 text-center">
        <div className="text-xs text-gray-400">Profit Factor</div>
        <div className={`font-mono font-bold text-xl ${profitFactor >= 1.5 ? 'text-green-400' : profitFactor >= 1 ? 'text-yellow-400' : 'text-red-400'}`}>
          {profitFactor.toFixed(2)}
        </div>
        <div className="text-xs text-gray-500 mt-1">
          {profitFactor >= 2 ? 'Excellent' : profitFactor >= 1.5 ? 'Good' : profitFactor >= 1 ? 'Break Even' : 'Losing'}
        </div>
      </div>
    </div>
  );
}

// ==================== MAIN COMPONENT ====================
export default function InfinityAlgo() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Products for marketing - ALL FREE
  const products = [
    { name: 'AI Trading Bot Pro', price: 'FREE', originalPrice: '$0', image: '🤖', tag: 'Free', description: 'Advanced AI-powered trading bot with 95% accuracy' },
    { name: 'Non-Repaint Indicator Pack', price: 'FREE', originalPrice: '$0', image: '📊', tag: 'Free', description: 'Premium indicators that never repaint signals' },
    { name: 'Smart Money Concepts', price: 'FREE', originalPrice: '$0', image: '💎', tag: 'Free', description: 'Institutional trading concepts and strategies' },
    { name: 'TradingView Premium Scripts', price: 'FREE', originalPrice: '$0', image: '📈', tag: 'Free', description: 'Professional TradingView indicators suite' },
    { name: 'MT4/MT5 Expert Advisors', price: 'FREE', originalPrice: '$0', image: '⚡', tag: 'Free', description: 'Complete EA collection for MetaTrader platforms' },
    { name: 'Masterclass Course', price: 'FREE', originalPrice: '$0', image: '🎓', tag: 'Free', description: 'Complete trading education from beginner to pro' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white overflow-x-hidden">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#0a0a0f]/95 backdrop-blur-lg border-b border-white/10' : ''}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="Infinity Algo" className="w-10 h-10 rounded-xl object-cover" />
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  Infinity Algo
                </span>
                <span className="block text-xs text-gray-500">by Jeremy</span>
              </div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center gap-6">
              {['Home', 'Calculators', 'Analytics', 'Products', 'FAQ'].map((item) => (
                <a key={item} href={`#${item.toLowerCase()}`} className="text-gray-300 hover:text-white transition-colors text-sm font-medium">
                  {item}
                </a>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="hidden lg:flex items-center gap-4">
              <a href="https://infinityalgoacademy.net/" target="_blank" rel="noopener noreferrer"
                className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors flex items-center gap-1">
                Academy <ExternalLink size={14} />
              </a>
              <a href="https://infinityalgoacademy.net/shop/" target="_blank" rel="noopener noreferrer"
                className="px-6 py-2.5 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-400 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity">
                Get Products
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button className="lg:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#12121a] border-t border-white/10">
            <div className="px-4 py-4 space-y-3">
              {['Home', 'Calculators', 'Analytics', 'Products', 'FAQ'].map((item) => (
                <a key={item} href={`#${item.toLowerCase()}`} className="block py-2 text-gray-300 hover:text-white">
                  {item}
                </a>
              ))}
              <div className="pt-4 space-y-3">
                <a href="https://infinityalgoacademy.net/" target="_blank" rel="noopener noreferrer" 
                  className="w-full py-2.5 text-gray-300 border border-white/20 rounded-lg flex items-center justify-center gap-2">
                  Academy <ExternalLink size={14} />
                </a>
                <a href="https://infinityalgoacademy.net/shop/" target="_blank" rel="noopener noreferrer"
                  className="w-full py-2.5 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-lg font-semibold text-center">
                  Get Products
                </a>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-blue-900/10 to-transparent" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[128px]" />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNMzAgMzBtLTEgMGExIDEgMCAxIDAgMiAwYTEgMSAwIDEgMCAtMiAwIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDMpIi8+PC9nPjwvc3ZnPg==')] opacity-50" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-gray-300">Professional Trading Tools & Education</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6 leading-tight">
            <span className="block">Trade Smarter with</span>
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Infinity Algo
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto mb-10">
            Professional trading calculators, AI-powered indicators, and expert strategies. 
            Everything you need to elevate your trading to the next level.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <a href="#calculators" className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-400 rounded-xl font-semibold text-lg hover:opacity-90 transition-all hover:scale-105 flex items-center justify-center gap-2">
              <Calculator className="w-5 h-5" />
              Open Calculators
            </a>
            <a href="https://infinityalgoacademy.net/" target="_blank" rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/20 rounded-xl font-semibold text-lg hover:bg-white/10 transition-all flex items-center justify-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              Browse Products
            </a>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap items-center justify-center gap-8 text-gray-500">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-400" />
              <span className="text-sm">Verified Products</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-400" />
              <span className="text-sm">10K+ Traders</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-400" />
              <span className="text-sm">Premium Quality</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-purple-400" />
              <span className="text-sm">Worldwide</span>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-6 h-6 text-gray-500" />
        </div>
      </section>

      {/* Live Clock Section */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <LiveClock />
        </div>
      </section>

      {/* Banner Ad */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <a href="https://infinityalgoacademy.net/shop/" target="_blank" rel="noopener noreferrer"
            className="block relative rounded-2xl overflow-hidden bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-cyan-600/20 border border-white/10 p-8 hover:border-purple-500/50 transition-all">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-400 flex items-center justify-center text-3xl">
                  🚀
                </div>
                <div className="text-left">
                  <div className="text-xs text-purple-400 font-semibold mb-1">LIMITED TIME OFFER</div>
                  <h3 className="text-xl font-bold">Get FREE Access to All Trading Tools</h3>
                  <p className="text-gray-400 text-sm">Premium indicators, EAs, and courses - completely free!</p>
                </div>
              </div>
              <button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-cyan-400 rounded-lg font-semibold flex items-center gap-2 hover:opacity-90">
                Access Now <ArrowRight size={18} />
              </button>
            </div>
          </a>
        </div>
      </section>

      {/* Calculators Section */}
      <section id="calculators" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6">
              <Calculator className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-blue-400">Trading Tools</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold mb-6">
              Professional <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">Calculators</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              Essential trading calculators for risk management, position sizing, and market analysis.
            </p>
          </div>

          {/* Calculators Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <PivotCalculator />
            <FibonacciCalculator />
            <PositionSizeCalculator />
            <RiskRewardCalculator />
            <MarginCalculator />
            <ProfitCalculator />
            <PipValueCalculator />
            <CompoundingCalculator />
            <DrawdownCalculator />
            <LotSizeFromRiskCalculator />
          </div>
        </div>
      </section>

      {/* Elite Analytics Section */}
      <section id="analytics" className="py-24 bg-gradient-to-b from-[#12121a]/50 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-purple-400">Elite Analytics</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold mb-6">
              Elite <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">Analytics</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              Advanced trading analytics for professional risk assessment and performance optimization.
            </p>
          </div>

          {/* Analytics Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <WinRateCalculator />
            <ExpectancyCalculator />
            <RiskOfRuinCalculator />
            <KellyCriterionCalculator />
            <ProfitFactorCalculator />
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 mb-6">
              <ShoppingBag className="w-4 h-4 text-green-400" />
              <span className="text-sm text-green-400">Free Products</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold mb-6">
              Trading Tools & <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">Resources</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              Professional-grade trading tools from InfinityAlgo Academy - All FREE!
            </p>
          </div>

          {/* Products Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <a 
                key={product.name}
                href="https://infinityalgoacademy.net/shop/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-[#12121a] rounded-2xl p-6 border border-white/10 hover:border-green-500/50 transition-all hover:-translate-y-1"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500/20 to-cyan-500/20 flex items-center justify-center text-3xl">
                    {product.image}
                  </div>
                  <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full font-semibold">
                    {product.tag}
                  </span>
                </div>
                <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                <p className="text-gray-400 text-sm mb-4">{product.description}</p>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold text-green-400">{product.price}</span>
                    <span className="text-sm text-gray-500 ml-2">{product.originalPrice}</span>
                  </div>
                  <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                    <ExternalLink size={18} className="text-gray-400" />
                  </button>
                </div>
              </a>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-12">
            <a href="https://infinityalgoacademy.net/shop/" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-green-500 to-cyan-400 rounded-xl font-semibold hover:opacity-90 transition-all">
              Get All Free Products <ArrowRight size={20} />
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-6">
              <Shield className="w-4 h-4 text-cyan-400" />
              <span className="text-sm text-cyan-400">Why Choose Us</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold mb-6">
              Built for <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">Success</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Calculator, title: 'Free Calculators', description: 'Professional trading calculators available 24/7 at no cost.' },
              { icon: Activity, title: 'AI-Powered Tools', description: 'Advanced algorithms for smarter trading decisions.' },
              { icon: BookOpen, title: 'Expert Education', description: 'Learn from professional traders with proven strategies.' },
              { icon: Download, title: 'Instant Download', description: 'Get your products immediately after purchase.' },
              { icon: Shield, title: 'Verified Quality', description: 'All products tested and verified for performance.' },
              { icon: Globe, title: 'Global Community', description: 'Join thousands of traders worldwide.' },
            ].map((feature) => (
              <div key={feature.title} className="bg-[#12121a] rounded-2xl p-6 border border-white/10 hover:border-cyan-500/50 transition-all hover:-translate-y-1">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-cyan-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ad Banner */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <a href="https://infinityalgoacademy.net/" target="_blank" rel="noopener noreferrer"
            className="block relative rounded-2xl overflow-hidden bg-gradient-to-r from-blue-900/50 via-purple-900/50 to-cyan-900/50 border border-white/10 p-8">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNMzAgMzBtLTEgMGExIDEgMCAxIDAgMiAwYTEgMSAwIDEgMCAtMiAwIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIi8+PC9nPjwvc3ZnPg==')] opacity-50" />
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <div className="text-xs text-cyan-400 font-semibold mb-2">INFINITY ALGO ACADEMY</div>
                <h3 className="text-2xl font-bold mb-2">Join Our Trading Community</h3>
                <p className="text-gray-400">Access free resources, premium courses, and professional trading tools</p>
              </div>
              <button className="px-8 py-3 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-100 transition-all flex items-center gap-2">
                Visit Academy <ExternalLink size={18} />
              </button>
            </div>
          </a>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/20 mb-6">
              <Star className="w-4 h-4 text-yellow-400" />
              <span className="text-sm text-yellow-400">FAQ</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold mb-6">
              Frequently Asked <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">Questions</span>
            </h2>
          </div>

          <div className="space-y-4">
            {[
              { q: 'Are the calculators free to use?', a: 'Yes! All our trading calculators are completely free to use. No registration or payment required.' },
              { q: 'What platforms do your products support?', a: 'Our products support MT4, MT5, TradingView, and NinjaTrader platforms. Check individual product pages for specific compatibility.' },
              { q: 'Do indicators repaint?', a: 'No! Our indicators are specifically designed to be non-repainting, ensuring you get accurate signals in real-time.' },
              { q: 'How do I access purchased products?', a: 'After purchase, you\'ll receive instant download links via email. You can also access all your products from your account dashboard.' },
              { q: 'Is there customer support?', a: 'Yes! We provide dedicated support for all premium products. Contact us through our website or Discord community.' },
              { q: 'Do you offer refunds?', a: 'We offer a satisfaction guarantee on all products. If you\'re not happy, contact us within 7 days for a refund.' },
            ].map((faq, index) => (
              <div key={index} className="bg-[#12121a] rounded-xl border border-white/10 overflow-hidden">
                <button
                  className="w-full flex items-center justify-between p-6 text-left"
                  onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                >
                  <span className="font-semibold pr-4">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${activeFaq === index ? 'rotate-180' : ''}`} />
                </button>
                {activeFaq === index && (
                  <div className="px-6 pb-6 text-gray-400">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-500 to-cyan-500" />
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNMzAgMzBtLTEgMGExIDEgMCAxIDAgMiAwYTEgMSAwIDEgMCAtMiAwIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiLz48L2c+PC9zdmc+')] opacity-50" />
            
            <div className="relative z-10 text-center py-16 px-8">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Ready to Level Up Your Trading?
              </h2>
              <p className="text-white/80 max-w-xl mx-auto mb-8">
                Join InfinityAlgo Academy and get access to premium trading tools, education, and community.
              </p>
              <a href="https://infinityalgoacademy.net/" target="_blank" rel="noopener noreferrer"
                className="inline-block px-8 py-4 bg-white text-gray-900 rounded-xl font-semibold hover:bg-gray-100 transition-all hover:scale-105">
                Get Started Now
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-white/10 bg-[#0a0a0f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <img src="/logo.png" alt="Infinity Algo" className="w-10 h-10 rounded-xl object-cover" />
                <div>
                  <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    Infinity Algo
                  </span>
                  <span className="block text-xs text-gray-500">by Jeremy</span>
                </div>
              </div>
              <p className="text-gray-500 text-sm mb-6">
                Professional trading tools and education for traders worldwide.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Tools</h4>
              <ul className="space-y-3 text-gray-500 text-sm">
                <li><a href="#calculators" className="hover:text-white transition-colors">Calculators</a></li>
                <li><a href="#analytics" className="hover:text-white transition-colors">Elite Analytics</a></li>
                <li><a href="https://infinityalgoacademy.net/shop/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Products</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-3 text-gray-500 text-sm">
                <li><a href="#faq" className="hover:text-white transition-colors">FAQ</a></li>
                <li><a href="https://infinityalgoacademy.net/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="https://infinityalgoacademy.net/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-3 text-gray-500 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Risk Disclosure</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 text-center">
            <p className="text-gray-500 text-sm">
              © 2024 Infinity Algo by Jeremy. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
