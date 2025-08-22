import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const state = req.nextUrl.searchParams.get('state');
  if (!state) return NextResponse.json({ error: 'Missing state' }, { status: 400 });

  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'Missing OPENWEATHER_API_KEY in environment' }, { status: 500 });
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
    state
  )},US&units=metric&appid=${apiKey}`;

  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) {
      return NextResponse.json({ error: 'OpenWeather API error' }, { status: res.status });
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch weather' }, { status: 500 });
  }
}
