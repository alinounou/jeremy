import { NextRequest, NextResponse } from 'next/server';

const GATEWAY_URL = 'https://internal-api.z.ai';
const API_PREFIX = '/external/finance';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const ticker = searchParams.get('ticker');
  const type = searchParams.get('type') || 'STOCKS';
  
  if (!ticker) {
    return NextResponse.json({ error: 'Ticker is required' }, { status: 400 });
  }
  
  try {
    const response = await fetch(
      `${GATEWAY_URL}${API_PREFIX}/v1/markets/quote?ticker=${ticker}&type=${type}`,
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
    console.error('Quote API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quote' },
      { status: 500 }
    );
  }
}
