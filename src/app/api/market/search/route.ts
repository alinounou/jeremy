import { NextRequest, NextResponse } from 'next/server';
import { FOREX_PAIRS, CRYPTO_ASSETS, STOCKS, INDICES } from '@/types/trading';

const FINANCE_API_BASE = 'https://internal-api.z.ai/external/finance/v1';
const API_HEADERS = {
  'X-Z-AI-From': 'Z',
  'Content-Type': 'application/json',
};

// Local symbols database
const LOCAL_SYMBOLS = [
  ...FOREX_PAIRS.map(p => ({ symbol: p.symbol, name: p.name, type: p.symbol.includes('XAU') || p.symbol.includes('XAG') ? 'metal' : 'forex', exchange: 'FX' })),
  ...CRYPTO_ASSETS.map(c => ({ symbol: c.symbol, name: c.name, type: 'crypto', exchange: 'Crypto' })),
  ...STOCKS.map(s => ({ symbol: s.symbol, name: s.name, type: 'stock', exchange: 'NASDAQ' })),
  ...INDICES.map(i => ({ symbol: i.symbol, name: i.name, type: 'index', exchange: 'US' })),
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q')?.toLowerCase() || '';
  const type = searchParams.get('type');

  try {
    const response = await fetch(
      `${FINANCE_API_BASE}/markets/search?q=${encodeURIComponent(query)}${type ? `&type=${type}` : ''}`,
      {
        headers: API_HEADERS,
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      return NextResponse.json(searchLocal(query, type));
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(searchLocal(query, type));
  }
}

function searchLocal(query: string, type?: string | null) {
  let results = [...LOCAL_SYMBOLS];
  
  if (type) {
    results = results.filter(s => s.type === type);
  }
  
  if (query) {
    results = results.filter(s => 
      s.symbol.toLowerCase().includes(query) ||
      s.name.toLowerCase().includes(query)
    );
  }
  
  return {
    results: results.map(s => ({
      symbol: s.symbol,
      name: s.name,
      type: s.type,
      exchange: s.exchange,
    })),
  };
}
