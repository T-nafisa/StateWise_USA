import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const state = req.nextUrl.searchParams.get('state');
    if (!state) return NextResponse.json({ error: 'Missing state' }, { status: 400 });

    const apiKey = process.env.NPS_API_KEY;
    const url = `https://developer.nps.gov/api/v1/parks?stateCode=${state}&api_key=${apiKey}`;

    try {
        const res = await fetch(url);
        const data = await res.json();
        return NextResponse.json(data.data);

    } catch (e) {
        return NextResponse.json({ error: 'Failed to fetch activities' }, { status: 500 });
    }
}
