'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { SystemStatusBadge } from '@/components/SystemStatusBadge'
import { useStudent } from '@/components/StudentContext'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

const NAV_LINKS = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/status', label: 'System Status' },
]

export function Navbar() {
    const pathname = usePathname()
    const { studentName, setStudent } = useStudent()
    const [menuOpen, setMenuOpen] = useState(false)

    const handleResetProfile = () => {
        if (confirm('Reset your profile? You will be asked to enter your name again.')) {
            localStorage.clear()
            window.location.reload()
        }
        setMenuOpen(false)
    }

    return (
        <header className="sticky top-0 z-40 border-b border-white/10 backdrop-blur-xl bg-black/20">
            <nav className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">

                {/* Logo */}
                <Link href="/" className="flex items-center gap-2.5 shrink-0">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-sm font-bold text-white shadow-lg">
                        AI
                    </div>
                    <span className="font-display font-bold text-white text-lg hidden sm:block">
                        Learning System
                    </span>
                </Link>

                {/* Center Nav */}
                <div className="hidden md:flex items-center gap-1">
                    {NAV_LINKS.map(link => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${pathname === link.href
                                    ? 'bg-white/20 text-white'
                                    : 'text-gray-400 hover:text-white hover:bg-white/10'
                                }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                    <a
                        href={`${API_BASE}/docs`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-200 flex items-center gap-1.5"
                    >
                        API Docs
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                    </a>
                </div>

                {/* Right Side */}
                <div className="flex items-center gap-3">
                    {/* Live Status Badge */}
                    <SystemStatusBadge />

                    {/* Student Profile */}
                    <div className="relative">
                        <button
                            onClick={() => setMenuOpen(o => !o)}
                            className="flex items-center gap-2 glass rounded-full px-3 py-1.5 hover:bg-white/20 transition-all duration-300"
                        >
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xs font-bold text-white">
                                {studentName ? studentName[0].toUpperCase() : '?'}
                            </div>
                            <span className="text-sm text-white hidden sm:block max-w-[120px] truncate">
                                {studentName || 'Student'}
                            </span>
                            <svg
                                className={`w-3 h-3 text-gray-400 transition-transform ${menuOpen ? 'rotate-180' : ''}`}
                                fill="none" stroke="currentColor" viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {menuOpen && (
                            <>
                                <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                                <div className="absolute right-0 top-full mt-2 z-50 w-52 glass rounded-xl border border-white/20 shadow-2xl overflow-hidden">
                                    <div className="px-4 py-3 border-b border-white/10">
                                        <p className="text-xs text-gray-400">Signed in as</p>
                                        <p className="text-sm font-semibold text-white truncate">{studentName || 'Student'}</p>
                                    </div>
                                    <div className="p-2 space-y-1">
                                        <Link
                                            href="/dashboard"
                                            onClick={() => setMenuOpen(false)}
                                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-colors w-full"
                                        >
                                            <span>🏠</span> Dashboard
                                        </Link>
                                        <Link
                                            href="/status"
                                            onClick={() => setMenuOpen(false)}
                                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-colors w-full"
                                        >
                                            <span>🔌</span> System Status
                                        </Link>
                                        <a
                                            href={`${API_BASE}/docs`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={() => setMenuOpen(false)}
                                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-colors w-full"
                                        >
                                            <span>📖</span> API Docs ↗
                                        </a>
                                        <div className="border-t border-white/10 my-1" />
                                        <button
                                            onClick={handleResetProfile}
                                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors w-full"
                                        >
                                            <span>🔄</span> Reset Profile
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </nav>
        </header>
    )
}
