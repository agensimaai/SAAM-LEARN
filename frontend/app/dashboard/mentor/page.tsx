'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useState } from 'react'
import { api } from '@/lib/api'
import { useToast } from '@/components/Toast'
import { useStudent } from '@/components/StudentContext'

export default function MentorPage() {
    const { studentId } = useStudent()
    const { showToast } = useToast()
    const [topic, setTopic] = useState('study_habits')
    const [question, setQuestion] = useState('')
    const [loading, setLoading] = useState(false)
    const [response, setResponse] = useState<any>(null)

    const topics = [
        { value: 'study_habits', label: '📚 Study Habits', color: 'from-blue-500 to-cyan-500' },
        { value: 'goal_setting', label: '🎯 Goal Setting', color: 'from-purple-500 to-pink-500' },
        { value: 'career_exploration', label: '🚀 Career Exploration', color: 'from-green-500 to-emerald-500' },
        { value: 'discipline', label: '💪 Discipline', color: 'from-orange-500 to-red-500' },
        { value: 'time_management', label: '⏰ Time Management', color: 'from-indigo-500 to-purple-500' },
    ]

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!studentId) { showToast('Please complete setup first.', 'error'); return }
        setLoading(true)
        try {
            const result = await api.callMentor({ student_id: studentId, topic, specific_question: question })
            setResponse(result)
            showToast('Mentorship guidance ready! 🎯', 'success')
        } catch (error: any) {
            showToast(error?.message || 'Failed to connect to the backend.', 'error')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-orange-900 to-slate-900">
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
            </div>

            <div className="relative z-10 py-12">
                <main className="container mx-auto px-4 max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-3xl">
                                🎯
                            </div>
                            <div>
                                <h1 className="text-4xl font-display font-bold text-white">Mentor Agent</h1>
                                <p className="text-gray-300">Get guidance on goals and habits</p>
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
                                <label className="block text-white font-semibold mb-4">What would you like guidance on?</label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {topics.map((t) => (
                                        <button
                                            key={t.value}
                                            type="button"
                                            onClick={() => setTopic(t.value)}
                                            className={`px-4 py-3 rounded-lg font-semibold transition-all text-left ${topic === t.value
                                                ? `bg-gradient-to-r ${t.color} text-white shadow-lg`
                                                : 'bg-white/10 text-gray-300 hover:bg-white/20'
                                                }`}
                                        >
                                            {t.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-white font-semibold mb-2">Your Question (optional)</label>
                                <textarea
                                    value={question}
                                    onChange={(e) => setQuestion(e.target.value)}
                                    placeholder="Ask anything about your goals, habits, or future plans..."
                                    rows={4}
                                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={loading}
                                className="w-full px-6 py-4 bg-gradient-to-r from-orange-600 to-red-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-orange-500/50 transition-all duration-300 disabled:opacity-50"
                            >
                                {loading ? 'Getting Guidance...' : 'Get Mentorship 🎯'}
                            </motion.button>
                        </form>
                    </motion.div>

                    {response && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-6"
                        >
                            <div className="glass rounded-2xl p-8">
                                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                                    <span>💡</span> Guidance
                                </h2>
                                <p className="text-gray-200 text-lg leading-relaxed">{response.guidance}</p>
                            </div>

                            {response.action_items && response.action_items.length > 0 && (
                                <div className="glass rounded-2xl p-8">
                                    <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                                        <span>✅</span> Action Items
                                    </h2>
                                    <div className="space-y-3">
                                        {response.action_items.map((item: string, index: number) => (
                                            <div key={index} className="flex items-start gap-3">
                                                <div className="w-6 h-6 rounded-full bg-orange-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                    <span className="text-orange-300 text-sm">{index + 1}</span>
                                                </div>
                                                <p className="text-gray-200">{item}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {response.resources && response.resources.length > 0 && (
                                <div className="glass rounded-2xl p-8">
                                    <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                                        <span>📚</span> Helpful Resources
                                    </h2>
                                    <div className="space-y-2">
                                        {response.resources.map((resource: string, index: number) => (
                                            <div key={index} className="bg-white/5 rounded-lg p-3 border border-white/10">
                                                <p className="text-gray-200">{resource}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {response.follow_up_suggestions && (
                                <div className="glass rounded-2xl p-8 bg-gradient-to-r from-orange-500/10 to-red-500/10">
                                    <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                                        <span>🔄</span> Next Time
                                    </h2>
                                    <p className="text-gray-200">{response.follow_up_suggestions}</p>
                                </div>
                            )}
                        </motion.div>
                    )}
                </main>
            </div>
        </div>
    )
}
