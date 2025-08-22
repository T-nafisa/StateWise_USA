import './globals.css'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import type { Metadata } from 'next'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Streetwise USA — Weather + Outdoor Fun',
    description: 'Real-time weather and public outdoor activities across the U.S.',
}
 
export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
        <div className="bg-aurora" aria-hidden />

        <header className="site-header">
            <div className="container header-inner">
                <Link className="brand" href="/">
                    <span className="brand-logo" aria-hidden>🌤️</span>
                    <span className="brand-name">StateWise USA</span>
                </Link>

                <nav className="nav">
                    <a href="https://www.weather.gov" target="_blank" rel="noreferrer">Weather Safety</a>
                    <a href="https://www.nps.gov/index.htm" target="_blank" rel="noreferrer">National Parks</a>
                    <a href="https://openweathermap.org" target="_blank" rel="noreferrer">OpenWeather</a>
                </nav>
            </div>
        </header>

        <main className="page">{children}</main>

        <footer className="site-footer">
            <div className="container footer-inner">
                <p>&copy; {new Date().getFullYear()} StateWise USA by Nafisa Tabassum </p>
            </div>
        </footer>
        </body>
        </html>
    )
}
