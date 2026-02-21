'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useState } from 'react'
import { api } from '@/lib/api'
import { useToast } from '@/components/Toast'
import { useStudent } from '@/components/StudentContext'

export default function TeacherPage() {
    const { studentId } = useStudent()
    const { showToast } = useToast()
    const [concept, setConcept] = useState('')
    const [subject, setSubject] = useState('')
    const [topic, setTopic] = useState('')
    const [loading, setLoading] = useState(false)
    const [response, setResponse] = useState<any>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!studentId) { showToast('Please complete setup first.', 'error'); return }
        setLoading(true)
        try {
            const result = await api.callTeacher({ student_id: studentId, concept, subject, topic })
            setResponse(result)
            showToast('Lesson ready! 📚', 'success')
        } catch (error: any) {
            showToast(error?.message || 'Failed to connect to the backend.', 'error')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
            </div>

            <div className="relative z-10 py-12">
                <main className="container mx-auto px-4 max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-3xl">
                                📚
                            </div>
                            <div>
                                <h1 className="text-4xl font-display font-bold text-white">Teacher Agent</h1>
                                <p className="text-gray-300">Learn concepts with personalized explanations</p>
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
                                <label className="block text-white font-semibold mb-2">Subject</label>
                                <input
                                    type="text"
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    placeholder="e.g., Mathematics, Science, History"
                                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-white font-semibold mb-2">Topic</label>
                                <input
                                    type="text"
                                    value={topic}
                                    onChange={(e) => setTopic(e.target.value)}
                                    placeholder="e.g., Algebra, Photosynthesis, World War II"
                                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-white font-semibold mb-2">Concept to Learn</label>
                                <textarea
                                    value={concept}
                                    onChange={(e) => setConcept(e.target.value)}
                                    placeholder="e.g., Quadratic equations, How plants make food, Causes of WWI"
                                    rows={3}
                                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={loading}
                                className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 disabled:opacity-50"
                            >
                                {loading ? 'Teaching...' : 'Teach Me! 🎓'}
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
                            {/* Explanation */}
                            <div className="glass rounded-2xl p-8">
                                <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                                    <span>💡</span> Explanation
                                </h2>
                                <div className="text-gray-200 prose prose-invert max-w-none">
                                    {response.explanation}
                                </div>
                            </div>

                            {/* Examples */}
                            {response.examples && response.examples.length > 0 && (
                                <div className="glass rounded-2xl p-8">
                                    <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                                        <span>📖</span> Examples
                                    </h2>
                                    <div className="space-y-4">
                                        {response.examples.map((example: string, index: number) => (
                                            <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10">
                                                <p className="text-gray-200">{example}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Formative Questions */}
                            {response.formative_questions && response.formative_questions.length > 0 && (
                                <div className="glass rounded-2xl p-8">
                                    <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                                        <span>❓</span> Check Your Understanding
                                    </h2>
                                    <div className="space-y-4">
                                        {response.formative_questions.map((q: any, index: number) => (
                                            <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10">
                                                <p className="text-white font-semibold mb-2">Q{index + 1}. {q.question_text}</p>
                                                {q.options && (
                                                    <div className="space-y-2 mt-3">
                                                        {q.options.map((option: string, i: number) => (
                                                            <div key={i} className="text-gray-300 pl-4">
                                                                {String.fromCharCode(65 + i)}. {option}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Next Steps */}
                            {response.next_steps && (
                                <div className="glass rounded-2xl p-8">
                                    <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                                        <span>🎯</span> Next Steps
                                    </h2>
                                    <p className="text-gray-200">{response.next_steps}</p>
                                </div>
                            )}
                        </motion.div>
                    )}
                </main>
            </div>
        </div>
    )
}
