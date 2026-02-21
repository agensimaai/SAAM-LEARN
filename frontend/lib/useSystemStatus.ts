import { useState, useEffect, useCallback } from 'react'

export type HealthStatus = 'healthy' | 'degraded' | 'offline' | 'loading'

export interface SystemStatus {
    overall: HealthStatus
    backend: {
        status: HealthStatus
        apiKey: 'ok' | 'missing' | 'unknown'
        database: 'ok' | 'error' | 'unknown'
        ready: boolean
        latencyMs: number | null
        timestamp: string | null
    }
    frontend: {
        status: 'online'
        version: string
    }
    lastChecked: Date | null
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

const DEFAULT_STATUS: SystemStatus = {
    overall: 'loading',
    backend: {
        status: 'loading',
        apiKey: 'unknown',
        database: 'unknown',
        ready: false,
        latencyMs: null,
        timestamp: null,
    },
    frontend: {
        status: 'online',
        version: '1.0.0',
    },
    lastChecked: null,
}

export function useSystemStatus(pollIntervalMs = 30_000) {
    const [status, setStatus] = useState<SystemStatus>(DEFAULT_STATUS)

    const check = useCallback(async () => {
        const t0 = Date.now()
        try {
            const [healthRes, readyRes] = await Promise.allSettled([
                fetch(`${BASE_URL}/health`, { signal: AbortSignal.timeout(8000) }),
                fetch(`${BASE_URL}/ready`, { signal: AbortSignal.timeout(8000) }),
            ])

            const latencyMs = Date.now() - t0

            // Parse health
            let healthData: any = {}
            let backendStatus: HealthStatus = 'offline'
            if (healthRes.status === 'fulfilled' && healthRes.value.ok) {
                healthData = await healthRes.value.json()
                backendStatus = healthData.status === 'healthy' ? 'healthy' : 'degraded'
            }

            // Parse ready
            let isReady = false
            if (readyRes.status === 'fulfilled' && readyRes.value.ok) {
                const readyData = await readyRes.value.json()
                isReady = readyData.status === 'ready'
            }

            const apiKey: SystemStatus['backend']['apiKey'] =
                healthData.checks?.api_key === 'ok' ? 'ok' :
                    healthData.checks?.api_key === 'missing' ? 'missing' : 'unknown'

            const database: SystemStatus['backend']['database'] =
                healthData.checks?.database === 'ok' ? 'ok' :
                    healthData.checks?.database ? 'error' : 'unknown'

            const overall: HealthStatus =
                backendStatus === 'healthy' && isReady ? 'healthy' :
                    backendStatus !== 'offline' ? 'degraded' : 'offline'

            setStatus({
                overall,
                backend: {
                    status: backendStatus,
                    apiKey,
                    database,
                    ready: isReady,
                    latencyMs,
                    timestamp: healthData.timestamp ?? null,
                },
                frontend: { status: 'online', version: '1.0.0' },
                lastChecked: new Date(),
            })
        } catch {
            setStatus(prev => ({
                ...prev,
                overall: 'offline',
                backend: {
                    ...prev.backend,
                    status: 'offline',
                    ready: false,
                    latencyMs: null,
                },
                lastChecked: new Date(),
            }))
        }
    }, [])

    useEffect(() => {
        check()
        const id = setInterval(check, pollIntervalMs)
        return () => clearInterval(id)
    }, [check, pollIntervalMs])

    return { status, refresh: check }
}
