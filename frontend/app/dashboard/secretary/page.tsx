'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useState } from 'react'
import { api } from '@/lib/api'
import { useToast } from '@/components/Toast'
import { useStudent } from '@/components/StudentContext'

export default function SecretaryPage() {
    const { studentId } = useStudent()
    const { showToast } = useToast()
    const [requestType, setRequestType] = useState('summary')
    const [timePeriod, setTimePeriod] = useState('this_week')
    const [loading, setLoading] = useState(false)
    const [response, setResponse] = useState<any>(null)

    const requestTypes = [
        { value: 'summary', label: '📊 Progress Summary', icon: '📊' },
        { value: 'tasks', label: '✅ Task List', icon: '✅' },
        { value: 'report', label: '📄 Full Report', icon: '📄' },
        { value: 'reminders', label: '🔔 Reminders', icon: '🔔' },
    ]

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!studentId) { showToast('Please complete setup first.', 'error'); return }
        setLoading(true)
        try {
            const result = await api.callSecretary({
                student_id: studentId,
                request_type: requestType,
                time_period: timePeriod,
            })
            setResponse(result)
            showToast('Report ready! 📊', 'success')
        } catch (error: any) {
            showToast(error?.message || 'Failed to connect to the backend.', 'error')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900">
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
            </div>

            <div className="relative z-10 py-12">
                <main className="container mx-auto px-4 max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-3xl">
                                📊
                            </div>
                            <div>
                                <h1 className="text-4xl font-display font-bold text-white">Secretary Agent</h1>
                                <p className="text-gray-300">Track progress and manage tasks</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="glass rounded-2xl p-8 mb-8"
                    >
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-white font-semibold mb-4">What would you like to see?</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {requestTypes.map((type) => (
                                        <button
                                            key={type.value}
                                            type="button"
                                            onClick={() => setRequestType(type.value)}
                                            className={`px-4 py-3 rounded-lg font-semibold transition-all ${requestType === type.value
                                                ? 'bg-indigo-600 text-white shadow-lg'
                                                : 'bg-white/10 text-gray-300 hover:bg-white/20'
                                                }`}
                                        >
                                            {type.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-white font-semibold mb-2">Time Period</label>
                                <select
                                    value={timePeriod}
                                    onChange={(e) => setTimePeriod(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="today">Today</option>
                                    <option value="this_week">This Week</option>
                                    <option value="this_month">This Month</option>
                                    <option value="all_time">All Time</option>
                                </select>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={loading}
                                className="w-full px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-indigo-500/50 transition-all duration-300 disabled:opacity-50"
                            >
                                {loading ? 'Loading...' : 'Get Information 📊'}
                            </motion.button>
                        </form>
                    </motion.div>

                    {response && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-6"
                        >
                            {response.summary && (
                                <div className="glass rounded-2xl p-8">
                                    <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                                        <span>📊</span> Summary
                                    </h2>
                                    <p className="text-gray-200 text-lg">{response.summary}</p>
                                </div>
                            )}

                            {response.progress_metrics && Object.keys(response.progress_metrics).length > 0 && (
                                <div className="glass rounded-2xl p-8">
                                    <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                                        <span>📈</span> Metrics
                                    </h2>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {Object.entries(response.progress_metrics).map(([key, value]: [string, any]) => (
                                            <div key={key} className="bg-white/5 rounded-lg p-4 border border-white/10">
                                                <div className="text-sm text-gray-400 mb-1 capitalize">{key.replace(/_/g, ' ')}</div>
                                                <div className="text-2xl font-bold text-white">{value}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {response.tasks && response.tasks.length > 0 && (
                                <div className="glass rounded-2xl p-8">
                                    <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                                        <span>✅</span> Tasks
                                    </h2>
                                    <div className="space-y-3">
                                        {response.tasks.map((task: any, index: number) => (
                                            <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10">
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <h3 className="text-white font-semibold">{task.title || task}</h3>
                                                        {task.description && <p className="text-gray-300 text-sm mt-1">{task.description}</p>}
                                                    </div>
                                                    {task.is_completed !== undefined && (
                                                        <span className={`px-2 py-1 rounded text-xs ${task.is_completed ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'
                                                            }`}>
                                                            {task.is_completed ? 'Done' : 'Pending'}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {response.upcoming_deadlines && response.upcoming_deadlines.length > 0 && (
                                <div className="glass rounded-2xl p-8">
                                    <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                                        <span>📅</span> Upcoming Deadlines
                                    </h2>
                                    <div className="space-y-2">
                                        {response.upcoming_deadlines.map((deadline: any, index: number) => (
                                            <div key={index} className="bg-white/5 rounded-lg p-3 border border-white/10 flex items-center justify-between">
                                                <span className="text-gray-200">{deadline.title || deadline}</span>
                                                {deadline.date && <span className="text-indigo-400 text-sm">{deadline.date}</span>}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )}
                </main>
            </div>
        </div>
    )
}
