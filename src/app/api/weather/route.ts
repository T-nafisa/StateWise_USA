import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const state = req.nextUrl.searchParams.get('state');
    if (!state) return NextResponse.json({ error: 'Missing state' }, { status: 400 });

    const apiKey = process.env.OPENWEATHER_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${state},US&units=metric&appid=${apiKey}`;

    try {
        const res = await fetch(url);
        const data = await res.json();
        return NextResponse.json(data);
    } catch (e) {
        return NextResponse.json({ error: 'Failed to fetch weather' }, { status: 500 });
    }
}
