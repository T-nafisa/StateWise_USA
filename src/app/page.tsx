'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

type Weather = {
    weather?: Array<{ description?: string; main?: string }>;
    main?: { temp?: number; humidity?: number; pressure?: number };
    wind?: { speed?: number };
    name?: string;
};

type NpsPark = {
    fullName?: string;
    name?: string;
    url?: string;
    states?: string;
    designation?: string;
    [k: string]: unknown;
};

type SnapshotResponse = {
    savedId?: number;
    weather?: Weather;
    activities?: NpsPark[];
    error?: string;
};

const POPULAR = ['California', 'New York', 'Texas', 'Florida', 'Washington', 'Arizona'];

function moodFromWeather(w?: Weather): 'base' | 'clear' | 'clouds' | 'rain' | 'snow' | 'storm' | 'mist' {
    const s = `${w?.weather?.[0]?.main || ''} ${w?.weather?.[0]?.description || ''}`.toLowerCase();
    if (s.includes('thunder')) return 'storm';
    if (s.includes('drizzle') || s.includes('rain')) return 'rain';
    if (s.includes('snow') || s.includes('sleet')) return 'snow';
    if (s.includes('fog') || s.includes('mist') || s.includes('haze') || s.includes('smoke')) return 'mist';
    if (s.includes('cloud')) return 'clouds';
    if (s.includes('clear') || s.includes('sun')) return 'clear';
    return 'base';
}

export default function Home() {
    const [stateInput, setStateInput] = useState<string>('New York');
    const [weather, setWeather] = useState<Weather | null>(null);
    const [activities, setActivities] = useState<NpsPark[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [err, setErr] = useState<string>('');
    const [touched, setTouched] = useState(false);
    const inputRef = useRef<HTMLInputElement | null>(null);

    const canSearch = useMemo(() => stateInput.trim().length > 0, [stateInput]);

    // Theme on <html data-theme="">
    const theme = moodFromWeather(weather || undefined);
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    useEffect(() => { inputRef.current?.focus(); }, []);

    const fetchData = async () => {
        if (!canSearch) {
            setErr('Please enter a U.S. state.');
            return;
        }
        setTouched(true);
        setLoading(true);
        setErr('');
        setWeather(null);
        setActivities([]);

        try {
            const res = await fetch(`/api/snapshot?state=${encodeURIComponent(stateInput)}`);
            const data: SnapshotResponse = await res.json();
            if (!res.ok) {
                setErr(data?.error ?? 'Something went wrong. Please try again.');
            } else {
                setWeather(data.weather ?? null);
                setActivities(Array.isArray(data.activities) ? data.activities : []);
            }
        } catch {
            setErr('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            void fetchData();
        }
    };

    return (
        <div className="container">
            {/* HERO */}
            <section className="hero">
                <div className="hero-inner">
                    <h1 className="hero-title">
                        <span className="hero-kicker">Plan your next day out with</span>
                        <span className="hero-gradient"> Live Weather &amp; Outdoor Places</span>
                    </h1>
                    <p className="hero-sub">
                        Search any U.S. state to see today’s conditions and discover parks, trails, and historic sites nearby.
                    </p>

                    <div className="searchbar">
                        <input
                            ref={inputRef}
                            className="search-input"
                            placeholder="Try “California”, “NY”, “Texas”…"
                            value={stateInput}
                            onChange={(e) => setStateInput(e.target.value)}
                            onKeyDown={onKeyDown}
                        />
                        <button className="btn btn-primary" onClick={fetchData} disabled={!canSearch || loading}>
                            {loading ? 'Searching…' : 'Search'}
                        </button>
                    </div>

                    <div className="chips">
                        {!touched && <span className="chip-label">Popular:</span>}
                        {POPULAR.map((s) => (
                            <button
                                key={s}
                                className="chip"
                                onClick={() => { setStateInput(s); setTouched(true); void fetchData(); }}
                            >
                                {s}
                            </button>
                        ))}
                    </div>

                    {err && (
                        <div className="alert">
                            <span>{err}</span>
                            <button className="alert-close" onClick={() => setErr('')}>✕</button>
                        </div>
                    )}
                </div>
            </section>

            {/* RESULTS */}
            <section className="grid">
                {/* Weather */}
                <article className="card">
                    <div className="card-head">
                        <h2>Current Weather</h2>
                    </div>

                    {!weather && !loading && (
                        <div className="empty">
                            <p>Search a state to see the latest weather.</p>
                        </div>
                    )}
                    {loading && <div className="skeleton weather-skel" />}

                    {weather && !loading && (
                        <div className="weather">
                            <div className="weather-top">
                                <div className="temp">
                                    {typeof weather.main?.temp === 'number' ? `${Math.round(weather.main.temp)}°C` : '—'}
                                </div>
                                <div className="desc">{weather.weather?.[0]?.description ?? '—'}</div>
                            </div>
                            <div className="stats">
                                <div className="stat">
                                    <span className="s-label">Humidity</span>
                                    <span className="s-value">
                    {typeof weather.main?.humidity === 'number' ? `${weather.main.humidity}%` : '—'}
                  </span>
                                </div>
                                <div className="stat">
                                    <span className="s-label">Wind</span>
                                    <span className="s-value">
                    {typeof weather.wind?.speed === 'number' ? `${weather.wind.speed} m/s` : '—'}
                  </span>
                                </div>
                                <div className="stat">
                                    <span className="s-label">Pressure</span>
                                    <span className="s-value">
                    {typeof weather.main?.pressure === 'number' ? `${weather.main.pressure} hPa` : '—'}
                  </span>
                                </div>
                                <div className="stat">
                                    <span className="s-label">Location</span>
                                    <span className="s-value">{weather.name ?? stateInput.toUpperCase()}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </article>

                {/* Activities */}
                <article className="card">
                    <div className="card-head">
                        <h2>Outdoor Activities</h2>
                    </div>

                    {!activities.length && !loading && (
                        <div className="empty">
                            <p>We’ll show parks, trails, and historic sites from the National Park Service here.</p>
                        </div>
                    )}
                    {loading && <div className="skeleton list-skel" />}

                    {activities.length > 0 && !loading && (
                        <ul className="activity-grid">
                            {activities.slice(0, 12).map((a, i) => {
                                const title = a.fullName || a.name || 'Park';
                                const href = (a.url as string | undefined) || '#';
                                const states = (a.states as string | undefined) || '';
                                const badge = a.designation || 'Park';
                                return (
                                    <li key={i} className="activity-card">
                                        <div className="activity-bar" aria-hidden />
                                        <div className="activity-content">
                                            <a className="a-title" href={href} target="_blank" rel="noopener noreferrer">
                                                {title}
                                            </a>
                                            <div className="a-meta">
                                                {states && <span className="tag">{states}</span>}
                                                {badge && <span className="tag">{badge}</span>}
                                            </div>
                                        </div>
                                        <a className="a-cta" href={href} target="_blank" rel="noopener noreferrer">Visit →</a>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </article>
            </section>
        </div>
    );
}
