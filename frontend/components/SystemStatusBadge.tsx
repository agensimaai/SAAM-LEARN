'use client'

import { useSystemStatus, type HealthStatus } from '@/lib/useSystemStatus'
import Link from 'next/link'

const DOT_COLOR: Record<HealthStatus, string> = {
    healthy: 'bg-emerald-400 shadow-emerald-400/60',
    degraded: 'bg-yellow-400 shadow-yellow-400/60',
    offline: 'bg-red-500 shadow-red-500/60',
    loading: 'bg-gray-400',
}

const LABEL: Record<HealthStatus, string> = {
    healthy: 'All Systems Operational',
    degraded: 'Degraded',
    offline: 'Backend Offline',
    loading: 'Checking…',
}

export function SystemStatusBadge() {
    const { status } = useSystemStatus()
    const { overall } = status

    return (
        <Link
            href="/status"
            className="flex items-center gap-2 glass rounded-full px-3 py-1.5 hover:bg-white/20 transition-all duration-300 group"
            title="View full system status"
        >
            {/* Pulsing dot */}
            <span className="relative flex h-2.5 w-2.5">
                {overall === 'healthy' && (
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${DOT_COLOR[overall]} opacity-75`} />
                )}
                <span className={`relative inline-flex rounded-full h-2.5 w-2.5 shadow-md ${DOT_COLOR[overall]}`} />
            </span>

            <span className="text-xs font-medium text-white/80 group-hover:text-white hidden sm:block">
                {LABEL[overall]}
            </span>

            {status.backend.latencyMs !== null && overall === 'healthy' && (
                <span className="text-xs text-emerald-400/70 hidden md:block">
                    {status.backend.latencyMs}ms
                </span>
            )}
        </Link>
    )
}
