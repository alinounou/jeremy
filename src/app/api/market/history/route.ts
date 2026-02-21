import { NextRequest, NextResponse } from 'next/server';

const GATEWAY_URL = 'https://internal-api.z.ai';
const API_PREFIX = '/external/finance';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const ticker = searchParams.get('ticker');
  const interval = searchParams.get('interval') || '1d';
  const limit = searchParams.get('limit') || '100';
  
  if (!ticker) {
    return NextResponse.json({ error: 'Ticker is required' }, { status: 400 });
  }
  
  try {
    const response = await fetch(
      `${GATEWAY_URL}${API_PREFIX}/v2/markets/stock/history?symbol=${ticker}&interval=${interval}&limit=${limit}`,
      {
        headers: {
          'X-Z-AI-From': 'Z',
        },
      }
    );
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('History API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch history' },
      { status: 500 }
    );
  }
}
