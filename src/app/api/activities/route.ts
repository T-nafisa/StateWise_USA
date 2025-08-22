import { NextRequest, NextResponse } from 'next/server';
import { normalizeToStateCode } from '../../../lib/stateMap';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const state = req.nextUrl.searchParams.get('state');
  if (!state) return NextResponse.json({ error: 'Missing state' }, { status: 400 });

  const apiKey = process.env.NPS_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'Missing NPS_API_KEY in environment' }, { status: 500 });
  }

  const stateCode = normalizeToStateCode(state);
  const url = `https://developer.nps.gov/api/v1/parks?stateCode=${encodeURIComponent(
    stateCode
  )}&limit=25&api_key=${apiKey}`;

  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) {
      return NextResponse.json({ error: 'NPS API error' }, { status: res.status });
    }
    const data = await res.json();
    return NextResponse.json(Array.isArray(data?.data) ? data.data : []);
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch activities' }, { status: 500 });
  }
}
