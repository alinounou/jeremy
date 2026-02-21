'use client';

import { useState, useEffect, useMemo } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Star, 
  Search,
  RefreshCw
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMarketData, useRealtimeSimulation, useSearch } from '@/hooks/use-market-data';
import { DEFAULT_SYMBOLS, type AssetClass, type MarketData, type Ticker } from '@/types/trading';
import { cn } from '@/lib/utils';

interface MarketWatchProps {
  onSelectSymbol: (symbol: string, type: AssetClass) => void;
  selectedSymbol: string;
}

const ASSET_TABS: { value: AssetClass; label: string }[] = [
  { value: 'FOREX', label: 'Forex' },
  { value: 'CRYPTO', label: 'Crypto' },
  { value: 'STOCKS', label: 'Stocks' },
  { value: 'METALS', label: 'Metals' },
  { value: 'INDICES', label: 'Indices' },
];

export function MarketWatch({ onSelectSymbol, selectedSymbol }: MarketWatchProps) {
  const [activeTab, setActiveTab] = useState<AssetClass>('FOREX');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [marketDataMap, setMarketDataMap] = useState<Map<string, MarketData>>(new Map());
  
  const { results: searchResults } = useSearch(searchQuery);

  const filteredSymbols = useMemo(() => {
    if (searchQuery) {
      return searchResults.map(r => ({
        symbol: r.symbol,
        name: r.name,
        type: r.type as AssetClass,
      }));
    }
    return DEFAULT_SYMBOLS.filter(s => s.type === activeTab);
  }, [activeTab, searchQuery, searchResults]);

  // Fetch market data for visible symbols
  useEffect(() => {
    const fetchMarketData = async () => {
      const symbolsToFetch = filteredSymbols.slice(0, 20);
      
      for (const symbol of symbolsToFetch) {
        try {
          const response = await fetch(
            `/api/market/quote?ticker=${symbol.symbol}&type=${symbol.type}`
          );
          if (response.ok) {
            const data = await response.json();
            setMarketDataMap(prev => new Map(prev).set(symbol.symbol, {
              symbol: data.ticker,
              name: data.name,
              type: symbol.type,
              price: data.price,
              change: data.change,
              changePercent: data.changePercent,
              high: data.high,
              low: data.low,
              open: data.open,
              previousClose: data.previousClose,
              volume: data.volume,
              timestamp: data.timestamp,
            }));
          }
        } catch (error) {
          console.error('Failed to fetch', symbol.symbol);
        }
      }
    };

    fetchMarketData();
    const interval = setInterval(fetchMarketData, 5000);
    return () => clearInterval(interval);
  }, [filteredSymbols]);

  const toggleFavorite = (symbol: string) => {
    setFavorites(prev => 
      prev.includes(symbol) 
        ? prev.filter(s => s !== symbol)
        : [...prev, symbol]
    );
  };

  const formatPrice = (price: number, type: AssetClass) => {
    if (type === 'FOREX') return price.toFixed(5);
    if (type === 'CRYPTO' && price < 1) return price.toFixed(6);
    if (price > 1000) return price.toFixed(2);
    return price.toFixed(2);
  };

  return (
    <Card className="h-full border-border/50 bg-card/50 backdrop-blur-sm">
      <div className="p-4 border-b border-border/50">
        <h2 className="text-lg font-semibold mb-3 text-foreground">Market Watch</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search symbols..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-background/50 border-border/50"
          />
        </div>
      </div>

      {!searchQuery && (
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as AssetClass)} className="px-4 pt-2">
          <TabsList className="w-full bg-background/50">
            {ASSET_TABS.map(tab => (
              <TabsTrigger key={tab.value} value={tab.value} className="text-xs">
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      )}

      <ScrollArea className="flex-1 h-[calc(100%-140px)]">
        <div className="p-2 space-y-1">
          {filteredSymbols.map((ticker) => {
            const data = marketDataMap.get(ticker.symbol);
            const isPositive = data ? data.change >= 0 : true;
            const isSelected = selectedSymbol === ticker.symbol;
            const isFavorite = favorites.includes(ticker.symbol);

            return (
              <div
                key={ticker.symbol}
                className={cn(
                  "flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all duration-200",
                  "hover:bg-accent/50",
                  isSelected && "bg-accent/70 ring-1 ring-primary/50"
                )}
                onClick={() => onSelectSymbol(ticker.symbol, ticker.type)}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(ticker.symbol);
                  }}
                  className="shrink-0"
                >
                  <Star
                    className={cn(
                      "h-3.5 w-3.5 transition-colors",
                      isFavorite ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground"
                    )}
                  />
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm text-foreground truncate">
                      {ticker.symbol}
                    </span>
                    {data && (
                      <span className={cn(
                        "font-mono text-sm",
                        isPositive ? "text-trading-green" : "text-trading-red"
                      )}>
                        {formatPrice(data.price, ticker.type)}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between mt-0.5">
                    <span className="text-xs text-muted-foreground truncate">
                      {ticker.name}
                    </span>
                    {data && (
                      <div className={cn(
                        "flex items-center gap-1 text-xs",
                        isPositive ? "text-trading-green" : "text-trading-red"
                      )}>
                        {isPositive ? (
                          <TrendingUp className="h-3 w-3" />
                        ) : (
                          <TrendingDown className="h-3 w-3" />
                        )}
                        <span>{isPositive ? '+' : ''}{data.changePercent.toFixed(2)}%</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </Card>
  );
}
