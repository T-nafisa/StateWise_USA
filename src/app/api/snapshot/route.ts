import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

import { normalizeToStateCode } from '../../../lib/stateMap';

const prisma = new PrismaClient();

type NpsPark = { fullName?: string; name?: string; url?: string };

export async function GET(req: NextRequest) {
    const stateParam = req.nextUrl.searchParams.get('state');
    if (!stateParam) {
        return NextResponse.json({ error: 'Missing state' }, { status: 400 });
    }

    const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
    const NPS_API_KEY = process.env.NPS_API_KEY;

    if (!OPENWEATHER_API_KEY || !NPS_API_KEY) {
        return NextResponse.json(
            { error: 'Missing OPENWEATHER_API_KEY or NPS_API_KEY in .env' },
            { status: 500 }
        );
    }

    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
        stateParam
    )},US&units=metric&appid=${OPENWEATHER_API_KEY}`;

    const code = normalizeToStateCode(stateParam);
    const activitiesUrl = `https://developer.nps.gov/api/v1/parks?stateCode=${encodeURIComponent(
        code
    )}&limit=25&api_key=${NPS_API_KEY}`;

    try {
        const [wRes, aRes] = await Promise.all([fetch(weatherUrl), fetch(activitiesUrl)]);

        const weather = wRes.ok ? await wRes.json() : null;
        const activitiesJson = aRes.ok ? await aRes.json() : null;
        const activities: NpsPark[] = Array.isArray(activitiesJson?.data) ? activitiesJson.data : [];
        
        const saved = await prisma.dailySnapshot.create({
            data: {
                state: stateParam,
                weather,
                activities,
                userNote: null
            }
        });

        return NextResponse.json({
            savedId: saved.id,
            weather,
            activities
        });
    } catch (e) {
        console.error('snapshot route error:', e);
        return NextResponse.json({ error: 'Failed to fetch and save snapshot' }, { status: 500 });
    }
}
