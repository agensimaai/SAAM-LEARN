'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useState } from 'react'
import { api } from '@/lib/api'
import { useToast } from '@/components/Toast'
import { useStudent } from '@/components/StudentContext'

export default function PlannerPage() {
    const { studentId } = useStudent()
    const { showToast } = useToast()
    const [planType, setPlanType] = useState<'daily' | 'weekly'>('daily')
    const [availableHours, setAvailableHours] = useState(2)
    const [loading, setLoading] = useState(false)
    const [response, setResponse] = useState<any>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!studentId) { showToast('Please complete setup first.', 'error'); return }
        setLoading(true)
        try {
            const result = await api.callPlanner({
                student_id: studentId,
                plan_type: planType,
                available_hours_per_day: availableHours,
            })
            setResponse(result)
            showToast('Study plan ready! 📅', 'success')
        } catch (error: any) {
            showToast(error?.message || 'Failed to connect to the backend.', 'error')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
            </div>

            <div className="relative z-10 py-12">
                <main className="container mx-auto px-4 max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-3xl">
                                📅
                            </div>
                            <div>
                                <h1 className="text-4xl font-display font-bold text-white">Planner Agent</h1>
                                <p className="text-gray-300">Get your personalized study plan</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Input Form */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="glass rounded-2xl p-8 mb-8"
                    >
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-white font-semibold mb-2">Plan Type</label>
                                <div className="flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setPlanType('daily')}
                                        className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all ${planType === 'daily'
                                            ? 'bg-purple-600 text-white'
                                            : 'bg-white/10 text-gray-300 hover:bg-white/20'
                                            }`}
                                    >
                                        Daily Plan
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setPlanType('weekly')}
                                        className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all ${planType === 'weekly'
                                            ? 'bg-purple-600 text-white'
                                            : 'bg-white/10 text-gray-300 hover:bg-white/20'
                                            }`}
                                    >
                                        Weekly Plan
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-white font-semibold mb-2">
                                    Available Study Hours Per Day: {availableHours} hours
                                </label>
                                <input
                                    type="range"
                                    min="1"
                                    max="6"
                                    step="0.5"
                                    value={availableHours}
                                    onChange={(e) => setAvailableHours(parseFloat(e.target.value))}
                                    className="w-full"
                                />
                                <div className="flex justify-between text-sm text-gray-400 mt-1">
                                    <span>1 hour</span>
                                    <span>6 hours</span>
                                </div>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={loading}
                                className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 disabled:opacity-50"
                            >
                                {loading ? 'Creating Plan...' : 'Generate Study Plan 📅'}
                            </motion.button>
                        </form>
                    </motion.div>

                    {/* Response Display */}
                    {response && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-6"
                        >
                            {/* Weekly Goals */}
                            {response.weekly_goals && response.weekly_goals.length > 0 && (
                                <div className="glass rounded-2xl p-8">
                                    <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                                        <span>🎯</span> Goals
                                    </h2>
                                    <div className="space-y-2">
                                        {response.weekly_goals.map((goal: string, index: number) => (
                                            <div key={index} className="flex items-start gap-3">
                                                <div className="w-6 h-6 rounded-full bg-purple-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                    <span className="text-purple-300 text-sm">{index + 1}</span>
                                                </div>
                                                <p className="text-gray-200">{goal}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Daily Tasks */}
                            {response.daily_tasks && response.daily_tasks.length > 0 && (
                                <div className="glass rounded-2xl p-8">
                                    <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                                        <span>✅</span> Tasks
                                    </h2>
                                    <div className="space-y-3">
                                        {response.daily_tasks.map((task: any, index: number) => (
                                            <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <h3 className="text-white font-semibold mb-1">{task.title}</h3>
                                                        <p className="text-gray-300 text-sm mb-2">{task.description}</p>
                                                        <div className="flex items-center gap-4 text-sm">
                                                            <span className="text-purple-400">📚 {task.subject}</span>
                                                            <span className="text-gray-400">⏱️ {task.estimated_duration_minutes} min</span>
                                                            <span className={`px-2 py-1 rounded ${task.priority === 'high' ? 'bg-red-500/20 text-red-300' :
                                                                task.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
                                                                    'bg-green-500/20 text-green-300'
                                                                }`}>
                                                                {task.priority}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Study Hours & Breaks */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="glass rounded-2xl p-6">
                                    <h3 className="text-xl font-bold text-white mb-2">Total Study Hours</h3>
                                    <p className="text-3xl font-bold text-purple-400">{response.total_study_hours} hours</p>
                                </div>
                                <div className="glass rounded-2xl p-6">
                                    <h3 className="text-xl font-bold text-white mb-2">Break Schedule</h3>
                                    <div className="space-y-1">
                                        {response.break_intervals?.map((interval: string, index: number) => (
                                            <p key={index} className="text-gray-300">{interval}</p>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Notes */}
                            {response.notes && (
                                <div className="glass rounded-2xl p-8">
                                    <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                                        <span>📝</span> Notes
                                    </h2>
                                    <p className="text-gray-200">{response.notes}</p>
                                </div>
                            )}
                        </motion.div>
                    )}
                </main>
            </div>
        </div>
    )
}
