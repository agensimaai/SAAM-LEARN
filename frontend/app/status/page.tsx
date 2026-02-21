'use client'

import { motion } from 'framer-motion'
import { useSystemStatus } from '@/lib/useSystemStatus'
import { Navbar } from '@/components/Navbar'

export default function StatusPage() {
    const { status, refresh } = useSystemStatus(10000) // Faster polling on this page

    const backendChecks = [
        { label: 'API Identity', value: status.backend.apiKey === 'ok' ? 'Verified' : 'Missing Key', success: status.backend.apiKey === 'ok' },
        { label: 'Database', value: status.backend.database === 'ok' ? 'Connected' : 'Error', success: status.backend.database === 'ok' },
        { label: 'Readiness', value: status.backend.ready ? 'Ready to Serve' : 'Not Ready', success: status.backend.ready },
        { label: 'Latency', value: status.backend.latencyMs ? `${status.backend.latencyMs}ms` : 'N/A', success: (status.backend.latencyMs || 999) < 500 },
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900">
            <Navbar />

            <main className="container mx-auto px-4 py-12 max-w-4xl relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12 text-center"
                >
                    <h1 className="text-4xl font-display font-bold text-white mb-4">System Status</h1>
                    <p className="text-gray-300">Real-time health monitoring of our AI agents and infrastructure</p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Overall Status Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass rounded-3xl p-8 flex flex-col items-center justify-center text-center space-y-4"
                    >
                        <div className={`w-24 h-24 rounded-full flex items-center justify-center text-4xl shadow-2xl ${status.overall === 'healthy' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' :
                                status.overall === 'degraded' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/40' :
                                    'bg-red-500/20 text-red-400 border border-red-500/40'
                            }`}>
                            {status.overall === 'healthy' ? '✓' : status.overall === 'degraded' ? '!' : '×'}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white capitalize">{status.overall}</h2>
                            <p className="text-gray-400 text-sm">Overall System Health</p>
                        </div>
                        <button
                            onClick={() => refresh()}
                            className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-full text-xs text-white transition-colors border border-white/10"
                        >
                            🔄 Refresh Now
                        </button>
                    </motion.div>

                    {/* Technical Details */}
                    <div className="space-y-4">
                        <div className="glass rounded-2xl p-6">
                            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                                Backend Services
                            </h3>
                            <div className="space-y-3">
                                {backendChecks.map((check, i) => (
                                    <div key={i} className="flex justify-between items-center text-sm">
                                        <span className="text-gray-400">{check.label}</span>
                                        <span className={`font-medium ${check.success ? 'text-emerald-400' : 'text-red-400'}`}>
                                            {check.value}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="glass rounded-2xl p-6">
                            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                                Frontend Platform
                            </h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400">Status</span>
                                    <span className="text-emerald-400 font-medium font-mono">ONLINE</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400">Version</span>
                                    <span className="text-white font-medium">{status.frontend.version}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400">Environment</span>
                                    <span className="text-white font-medium capitalize">{process.env.NODE_ENV}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Agent Health Grid */}
                <div className="mt-12">
                    <h3 className="text-xl font-bold text-white mb-6">Agent Integration Status</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                        {['Teacher', 'Planner', 'Assessment', 'Mentor', 'Psychology', 'Secretary'].map((agent) => (
                            <div key={agent} className="glass rounded-xl p-4 text-center">
                                <div className={`w-3 h-3 rounded-full mx-auto mb-3 ${status.overall === 'healthy' ? 'bg-emerald-500' : 'bg-gray-600'}`}></div>
                                <span className="text-xs text-white font-medium">{agent}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-12 text-center">
                    <p className="text-gray-500 text-xs">
                        Last checked: {status.lastChecked?.toLocaleTimeString() || 'Never'} •
                        Polling every 10 seconds while on this page
                    </p>
                </div>
            </main>
        </div>
    )
}
