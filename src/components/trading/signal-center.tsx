'use client';

import { useMemo, useEffect, useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Pause,
  Target,
  Shield,
  AlertTriangle,
  Brain,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useSignals } from '@/hooks/use-market-data';
import { useMarketHistory } from '@/hooks/use-market-data';
import { generateSignal } from '@/lib/ai-engine';
import type { Signal, SignalType, AssetClass, Candle } from '@/types/trading';
import { cn } from '@/lib/utils';

interface SignalCenterProps {
  symbol: string;
  type: AssetClass;
}

export function SignalCenter({ symbol, type }: SignalCenterProps) {
  const [signal, setSignal] = useState<Signal | null>(null);
  const [loading, setLoading] = useState(true);
  const { data: candles } = useMarketHistory(symbol, type, '1h', 150);

  useEffect(() => {
    if (!candles || candles.length === 0) return;

    const generateNewSignal = async () => {
      setLoading(true);
      try {
        const currentPrice = candles[candles.length - 1]?.close || 0;
        const newSignal = generateSignal(symbol, candles, currentPrice);
        setSignal(newSignal);
      } catch (error) {
        console.error('Failed to generate signal:', error);
      } finally {
        setLoading(false);
      }
    };

    generateNewSignal();
    const interval = setInterval(generateNewSignal, 30000);
    return () => clearInterval(interval);
  }, [symbol, candles]);

  const getSignalIcon = (type: SignalType) => {
    switch (type) {
      case 'BUY':
        return <TrendingUp className="h-5 w-5" />;
      case 'SELL':
        return <TrendingDown className="h-5 w-5" />;
      default:
        return <Pause className="h-5 w-5" />;
    }
  };

  const getSignalColor = (type: SignalType) => {
    switch (type) {
      case 'BUY':
        return 'text-trading-green';
      case 'SELL':
        return 'text-trading-red';
      default:
        return 'text-muted-foreground';
    }
  };

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case 'STRONG':
        return 'bg-trading-green text-white';
      case 'MODERATE':
        return 'bg-yellow-500 text-black';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const formatPrice = (price: number) => {
    if (type === 'FOREX') return price.toFixed(5);
    if (type === 'CRYPTO' && price < 1) return price.toFixed(6);
    if (price > 1000) return price.toFixed(2);
    return price.toFixed(4);
  };

  if (loading) {
    return (
      <Card className="h-full border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-48 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!signal) {
    return (
      <Card className="h-full border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            AI Signal Center
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground py-8">
            No signal available. Select a symbol to generate AI analysis.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full border-border/50 bg-card/50 backdrop-blur-sm flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Brain className="h-5 w-5 text-primary" />
            AI Signal
          </CardTitle>
          <Badge className={getStrengthColor(signal.strength)}>
            {signal.strength}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-1 space-y-4 overflow-hidden">
        {/* Main Signal */}
        <div className={cn(
          "rounded-xl p-4 text-center transition-all duration-300",
          signal.type === 'BUY' && "bg-trading-green/10 border border-trading-green/30",
          signal.type === 'SELL' && "bg-trading-red/10 border border-trading-red/30",
          signal.type === 'WAIT' && "bg-muted/10 border border-muted/30"
        )}>
          <div className={cn(
            "flex items-center justify-center gap-2 mb-2",
            getSignalColor(signal.type)
          )}>
            {getSignalIcon(signal.type)}
            <span className="text-2xl font-bold">{signal.type}</span>
          </div>
          
          <div className="flex items-center justify-center gap-2 mb-3">
            <Sparkles className="h-4 w-4 text-yellow-500" />
            <span className="text-sm text-muted-foreground">AI Confidence</span>
          </div>
          
          <div className="flex items-center gap-3">
            <Progress 
              value={signal.confidence} 
              className="flex-1 h-2"
            />
            <span className="font-mono text-lg font-bold">{signal.confidence}%</span>
          </div>
        </div>

        {/* Entry/SL/TP Levels */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-background/50 rounded-lg p-3 text-center">
            <div className="flex items-center justify-center gap-1 text-muted-foreground text-xs mb-1">
              <Target className="h-3 w-3" />
              Entry
            </div>
            <div className="font-mono text-sm font-semibold">
              {formatPrice(signal.entryPrice)}
            </div>
          </div>
          
          <div className="bg-trading-red/10 rounded-lg p-3 text-center border border-trading-red/20">
            <div className="flex items-center justify-center gap-1 text-trading-red text-xs mb-1">
              <Shield className="h-3 w-3" />
              Stop Loss
            </div>
            <div className="font-mono text-sm font-semibold text-trading-red">
              {formatPrice(signal.stopLoss)}
            </div>
          </div>
          
          <div className="bg-trading-green/10 rounded-lg p-3 text-center border border-trading-green/20">
            <div className="flex items-center justify-center gap-1 text-trading-green text-xs mb-1">
              <TrendingUp className="h-3 w-3" />
              Take Profit
            </div>
            <div className="font-mono text-sm font-semibold text-trading-green">
              {formatPrice(signal.takeProfit)}
            </div>
          </div>
        </div>

        {/* Risk/Reward Ratio */}
        <div className="flex items-center justify-between bg-background/50 rounded-lg p-3">
          <span className="text-sm text-muted-foreground">Risk/Reward Ratio</span>
          <Badge variant="outline" className="font-mono">
            1 : {signal.riskRewardRatio}
          </Badge>
        </div>

        {/* Indicator Breakdown */}
        <div>
          <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
            Indicator Analysis
          </h4>
          <ScrollArea className="h-40">
            <div className="space-y-2 pr-4">
              {signal.indicators.map((indicator, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between bg-background/30 rounded-lg p-2"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground w-28 truncate">
                      {indicator.name}
                    </span>
                    <Badge 
                      variant="outline" 
                      className={cn(
                        "text-xs",
                        indicator.signal === 'BUY' && "border-trading-green text-trading-green",
                        indicator.signal === 'SELL' && "border-trading-red text-trading-red"
                      )}
                    >
                      {indicator.signal}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-muted/50 rounded-full h-1.5">
                      <div 
                        className={cn(
                          "h-full rounded-full",
                          indicator.signal === 'BUY' && "bg-trading-green",
                          indicator.signal === 'SELL' && "bg-trading-red"
                        )}
                        style={{ width: `${indicator.weight}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground w-6">
                      {indicator.weight}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Reasoning */}
        <div className="bg-primary/5 rounded-lg p-3 border border-primary/10">
          <h4 className="text-xs font-medium mb-1 text-primary">AI Reasoning</h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {signal.reasoning}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
