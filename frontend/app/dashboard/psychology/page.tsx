'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useState } from 'react'
import { api } from '@/lib/api'
import { useToast } from '@/components/Toast'
import { useStudent } from '@/components/StudentContext'

export default function PsychologyPage() {
    const { studentId } = useStudent()
    const { showToast } = useToast()
    const [concernType, setConcernType] = useState('motivation')
    const [description, setDescription] = useState('')
    const [loading, setLoading] = useState(false)
    const [response, setResponse] = useState<any>(null)

    const concernTypes = [
        { value: 'motivation', label: '🎯 Motivation', color: 'from-green-500 to-teal-500' },
        { value: 'stress', label: '😰 Stress', color: 'from-orange-500 to-red-500' },
        { value: 'anxiety', label: '😟 Anxiety', color: 'from-purple-500 to-pink-500' },
        { value: 'focus', label: '🎯 Focus', color: 'from-blue-500 to-cyan-500' },
        { value: 'confidence', label: '💪 Confidence', color: 'from-yellow-500 to-orange-500' },
    ]

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!studentId) { showToast('Please complete setup first.', 'error'); return }
        setLoading(true)
        try {
            const result = await api.callPsychology({
                student_id: studentId,
                concern_type: concernType,
                description,
            })
            setResponse(result)
            showToast('Support ready for you! 💚', 'success')
        } catch (error: any) {
            showToast(error?.message || 'Failed to connect to the backend.', 'error')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-teal-900 to-slate-900">
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
            </div>

            <div className="relative z-10 py-12">
                <main className="container mx-auto px-4 max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-teal-500 to-green-500 flex items-center justify-center text-3xl">
                                💚
                            </div>
                            <div>
                                <h1 className="text-4xl font-display font-bold text-white">Well-being Support</h1>
                                <p className="text-gray-300">Get support for confidence and motivation</p>
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
                                <label className="block text-white font-semibold mb-4">What would you like support with?</label>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {concernTypes.map((type) => (
                                        <button
                                            key={type.value}
                                            type="button"
                                            onClick={() => setConcernType(type.value)}
                                            className={`px-4 py-3 rounded-lg font-semibold transition-all ${concernType === type.value
                                                ? `bg-gradient-to-r ${type.color} text-white shadow-lg`
                                                : 'bg-white/10 text-gray-300 hover:bg-white/20'
                                                }`}
                                        >
                                            {type.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-white font-semibold mb-2">Tell us more (optional)</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Share what you're experiencing... (This is confidential and supportive)"
                                    rows={4}
                                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                                />
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={loading}
                                className="w-full px-6 py-4 bg-gradient-to-r from-teal-600 to-green-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-teal-500/50 transition-all duration-300 disabled:opacity-50"
                            >
                                {loading ? 'Getting Support...' : 'Get Support 💚'}
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
                            {/* Support Message */}
                            <div className="glass rounded-2xl p-8 border-l-4 border-teal-500">
                                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                                    <span>💚</span> Support Message
                                </h2>
                                <p className="text-gray-200 text-lg leading-relaxed">{response.support_message}</p>
                            </div>

                            {/* Techniques */}
                            {response.techniques && response.techniques.length > 0 && (
                                <div className="glass rounded-2xl p-8">
                                    <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                                        <span>🛠️</span> Helpful Techniques
                                    </h2>
                                    <div className="space-y-3">
                                        {response.techniques.map((technique: string, index: number) => (
                                            <div key={index} className="flex items-start gap-3">
                                                <div className="w-6 h-6 rounded-full bg-teal-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                    <span className="text-teal-300 text-sm">{index + 1}</span>
                                                </div>
                                                <p className="text-gray-200">{technique}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Exercises */}
                            {response.exercises && response.exercises.length > 0 && (
                                <div className="glass rounded-2xl p-8">
                                    <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                                        <span>🧘</span> Try These Exercises
                                    </h2>
                                    <div className="space-y-3">
                                        {response.exercises.map((exercise: string, index: number) => (
                                            <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10">
                                                <p className="text-gray-200">{exercise}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Encouragement */}
                            {response.encouragement && (
                                <div className="glass rounded-2xl p-8 bg-gradient-to-r from-teal-500/10 to-green-500/10">
                                    <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                                        <span>✨</span> You've Got This!
                                    </h2>
                                    <p className="text-gray-200 text-lg">{response.encouragement}</p>
                                </div>
                            )}

                            {/* Disclaimer */}
                            {response.disclaimer && (
                                <div className="glass rounded-2xl p-6 bg-yellow-500/10 border border-yellow-500/30">
                                    <p className="text-yellow-200 text-sm flex items-start gap-2">
                                        <span className="text-lg">ℹ️</span>
                                        <span>{response.disclaimer}</span>
                                    </p>
                                </div>
                            )}
                        </motion.div>
                    )}
                </main>
            </div>
        </div>
    )
}
