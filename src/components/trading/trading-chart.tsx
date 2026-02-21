'use client';

import { useState, useMemo } from 'react';
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Area,
} from 'recharts';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw,
  TrendingUp,
  TrendingDown,
  Layers,
  Grid3X3
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Skeleton } from '@/components/ui/skeleton';
import { useMarketHistory, useMarketData } from '@/hooks/use-market-data';
import { 
  SMA, 
  EMA, 
  BollingerBandsIndicator, 
  RSI, 
  MACD 
} from '@/lib/technical-analysis';
import { 
  type Timeframe, 
  type AssetClass, 
  type Candle,
  TIMEFRAME_MAP 
} from '@/types/trading';
import { cn } from '@/lib/utils';

interface TradingChartProps {
  symbol: string;
  type: AssetClass;
}

const TIMEFRAMES: Timeframe[] = ['1m', '5m', '15m', '1h', '4h', '1d'];

export function TradingChart({ symbol, type }: TradingChartProps) {
  const [timeframe, setTimeframe] = useState<Timeframe>('1h');
  const [showSMA, setShowSMA] = useState(true);
  const [showEMA, setShowEMA] = useState(false);
  const [showBB, setShowBB] = useState(false);
  const [showVolume, setShowVolume] = useState(true);

  const { data: currentQuote } = useMarketData(symbol, type);
  const { data: candles, loading } = useMarketHistory(symbol, type, timeframe, 200);

  // Calculate technical indicators
  const chartData = useMemo(() => {
    if (!candles || candles.length === 0) return [];

    const closes = candles.map(c => c.close);
    const sma20 = SMA(closes, 20);
    const sma50 = SMA(closes, 50);
    const ema20 = EMA(closes, 20);
    const bb = BollingerBandsIndicator(closes, 20, 2);

    return candles.map((candle, i) => ({
      time: new Date(candle.time * 1000).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      date: new Date(candle.time * 1000).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }),
      open: candle.open,
      high: candle.high,
      low: candle.low,
      close: candle.close,
      volume: candle.volume,
      sma20: sma20[i],
      sma50: sma50[i],
      ema20: ema20[i],
      bbUpper: bb[i]?.upper,
      bbLower: bb[i]?.lower,
      bbMiddle: bb[i]?.middle,
    }));
  }, [candles]);

  // Latest price info
  const latestCandle = chartData[chartData.length - 1];
  const previousCandle = chartData[chartData.length - 2];
  const priceChange = latestCandle && previousCandle 
    ? latestCandle.close - previousCandle.close 
    : 0;
  const priceChangePercent = latestCandle && previousCandle 
    ? (priceChange / previousCandle.close) * 100 
    : 0;
  const isPositive = priceChange >= 0;

  const formatPrice = (price: number) => {
    if (type === 'FOREX') return price.toFixed(5);
    if (type === 'CRYPTO' && price < 1) return price.toFixed(6);
    if (price > 1000) return price.toFixed(2);
    return price.toFixed(2);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;

    const data = payload[0].payload;
    return (
      <div className="bg-card/95 backdrop-blur-sm border border-border rounded-lg p-3 shadow-xl">
        <p className="text-xs text-muted-foreground mb-2">{data.date} {label}</p>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
          <span className="text-muted-foreground">Open:</span>
          <span className="font-mono">{formatPrice(data.open)}</span>
          <span className="text-muted-foreground">High:</span>
          <span className="font-mono text-trading-green">{formatPrice(data.high)}</span>
          <span className="text-muted-foreground">Low:</span>
          <span className="font-mono text-trading-red">{formatPrice(data.low)}</span>
          <span className="text-muted-foreground">Close:</span>
          <span className="font-mono font-semibold">{formatPrice(data.close)}</span>
          <span className="text-muted-foreground">Volume:</span>
          <span className="font-mono">{(data.volume / 1000000).toFixed(2)}M</span>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <Card className="h-full border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <Skeleton className="h-8 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[400px] w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full border-border/50 bg-card/50 backdrop-blur-sm flex flex-col">
      {/* Header */}
      <CardHeader className="pb-2 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <CardTitle className="text-xl font-bold">
              {symbol}
            </CardTitle>
            {latestCandle && (
              <div className="flex items-center gap-3">
                <span className="text-2xl font-mono font-bold">
                  {formatPrice(latestCandle.close)}
                </span>
                <Badge 
                  variant={isPositive ? "default" : "destructive"}
                  className={cn(
                    "font-mono",
                    isPositive 
                      ? "bg-trading-green/20 text-trading-green hover:bg-trading-green/30" 
                      : "bg-trading-red/20 text-trading-red hover:bg-trading-red/30"
                  )}
                >
                  {isPositive ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                  {isPositive ? '+' : ''}{priceChangePercent.toFixed(2)}%
                </Badge>
              </div>
            )}
          </div>

          {/* Timeframe selector */}
          <ToggleGroup 
            type="single" 
            value={timeframe} 
            onValueChange={(v) => v && setTimeframe(v as Timeframe)}
            className="border border-border/50 rounded-lg"
          >
            {TIMEFRAMES.map(tf => (
              <ToggleGroupItem 
                key={tf} 
                value={tf} 
                className="text-xs px-3 data-[state=on]:bg-primary/20"
              >
                {tf}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>

        {/* Indicator toggles */}
        <div className="flex items-center gap-2">
          <Button
            variant={showSMA ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setShowSMA(!showSMA)}
            className="h-7 text-xs"
          >
            SMA
          </Button>
          <Button
            variant={showEMA ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setShowEMA(!showEMA)}
            className="h-7 text-xs"
          >
            EMA
          </Button>
          <Button
            variant={showBB ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setShowBB(!showBB)}
            className="h-7 text-xs"
          >
            BB
          </Button>
          <Button
            variant={showVolume ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setShowVolume(!showVolume)}
            className="h-7 text-xs"
          >
            Volume
          </Button>
          <div className="flex-1" />
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Grid3X3 className="h-3 w-3" />
            <Layers className="h-3 w-3" />
          </div>
        </div>
      </CardHeader>

      {/* Chart */}
      <CardContent className="flex-1 pb-4">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart 
            data={chartData} 
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00c853" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#00c853" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2979ff" stopOpacity={0.5} />
                <stop offset="95%" stopColor="#2979ff" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            
            <XAxis 
              dataKey="time" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: '#8b8b9e' }}
              interval="preserveStartEnd"
            />
            
            <YAxis 
              yAxisId="price"
              domain={['dataMin - 0.5%', 'dataMax + 0.5%']}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: '#8b8b9e' }}
              tickFormatter={formatPrice}
              width={80}
            />
            
            {showVolume && (
              <YAxis
                yAxisId="volume"
                orientation="right"
                domain={[0, 'dataMax']}
                axisLine={false}
                tickLine={false}
                tick={false}
                width={0}
              />
            )}
            
            <Tooltip content={<CustomTooltip />} />
            
            {/* Volume bars */}
            {showVolume && (
              <Bar
                yAxisId="volume"
                dataKey="volume"
                fill="url(#volumeGradient)"
                opacity={0.5}
                barSize={2}
              />
            )}
            
            {/* Bollinger Bands */}
            {showBB && (
              <>
                <Line
                  yAxisId="price"
                  type="monotone"
                  dataKey="bbUpper"
                  stroke="#9c27b0"
                  strokeDasharray="3 3"
                  dot={false}
                  strokeWidth={1}
                />
                <Line
                  yAxisId="price"
                  type="monotone"
                  dataKey="bbLower"
                  stroke="#9c27b0"
                  strokeDasharray="3 3"
                  dot={false}
                  strokeWidth={1}
                />
                <Line
                  yAxisId="price"
                  type="monotone"
                  dataKey="bbMiddle"
                  stroke="#9c27b0"
                  strokeDasharray="5 5"
                  dot={false}
                  strokeWidth={1}
                />
              </>
            )}
            
            {/* Price line */}
            <Line
              yAxisId="price"
              type="monotone"
              dataKey="close"
              stroke="#00c853"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: '#00c853' }}
            />
            
            {/* SMA lines */}
            {showSMA && (
              <>
                <Line
                  yAxisId="price"
                  type="monotone"
                  dataKey="sma20"
                  stroke="#ff9800"
                  strokeWidth={1}
                  dot={false}
                />
                <Line
                  yAxisId="price"
                  type="monotone"
                  dataKey="sma50"
                  stroke="#2196f3"
                  strokeWidth={1}
                  dot={false}
                />
              </>
            )}
            
            {/* EMA line */}
            {showEMA && (
              <Line
                yAxisId="price"
                type="monotone"
                dataKey="ema20"
                stroke="#e91e63"
                strokeWidth={1}
                dot={false}
              />
            )}
            
            {/* Current price line */}
            {latestCandle && (
              <ReferenceLine
                yAxisId="price"
                y={latestCandle.close}
                stroke="#00c853"
                strokeDasharray="3 3"
                strokeWidth={1}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
