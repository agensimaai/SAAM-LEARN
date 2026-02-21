'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useState } from 'react'
import { api } from '@/lib/api'
import { useToast } from '@/components/Toast'
import { useStudent } from '@/components/StudentContext'

export default function AssessmentPage() {
    const { studentId } = useStudent()
    const { showToast } = useToast()
    const [subject, setSubject] = useState('')
    const [topics, setTopics] = useState('')
    const [numQuestions, setNumQuestions] = useState(5)
    const [difficulty, setDifficulty] = useState('mixed')
    const [loading, setLoading] = useState(false)
    const [response, setResponse] = useState<any>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!studentId) { showToast('Please complete setup first.', 'error'); return }
        setLoading(true)
        try {
            const result = await api.callAssessment({
                student_id: studentId,
                assessment_type: 'quiz',
                subject,
                topics: topics.split(',').map(t => t.trim()),
                difficulty_level: difficulty,
                number_of_questions: numQuestions,
            })
            setResponse(result)
            showToast('Quiz generated! 📝', 'success')
        } catch (error: any) {
            showToast(error?.message || 'Failed to connect to the backend.', 'error')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-slate-900">
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
            </div>

            <div className="relative z-10 py-12">
                <main className="container mx-auto px-4 max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-3xl">
                                📝
                            </div>
                            <div>
                                <h1 className="text-4xl font-display font-bold text-white">Assessment Agent</h1>
                                <p className="text-gray-300">Take personalized quizzes and tests</p>
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
                                <label className="block text-white font-semibold mb-2">Subject</label>
                                <input
                                    type="text"
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    placeholder="e.g., Mathematics, Science"
                                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-white font-semibold mb-2">Topics (comma-separated)</label>
                                <input
                                    type="text"
                                    value={topics}
                                    onChange={(e) => setTopics(e.target.value)}
                                    placeholder="e.g., Algebra, Equations, Functions"
                                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-white font-semibold mb-2">Number of Questions</label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="20"
                                        value={numQuestions}
                                        onChange={(e) => setNumQuestions(parseInt(e.target.value))}
                                        className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-white font-semibold mb-2">Difficulty</label>
                                    <select
                                        value={difficulty}
                                        onChange={(e) => setDifficulty(e.target.value)}
                                        className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                                    >
                                        <option value="easy">Easy</option>
                                        <option value="medium">Medium</option>
                                        <option value="hard">Hard</option>
                                        <option value="mixed">Mixed</option>
                                    </select>
                                </div>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={loading}
                                className="w-full px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-green-500/50 transition-all duration-300 disabled:opacity-50"
                            >
                                {loading ? 'Generating Quiz...' : 'Generate Quiz 📝'}
                            </motion.button>
                        </form>
                    </motion.div>

                    {response && response.questions && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-6"
                        >
                            <div className="glass rounded-2xl p-8">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold text-white">Your Quiz</h2>
                                    <div className="text-sm text-gray-300">
                                        ⏱️ Time: {response.time_limit_minutes} minutes | 📊 Total: {response.total_marks} marks
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    {response.questions.map((q: any, index: number) => (
                                        <div key={q.question_id} className="bg-white/5 rounded-lg p-6 border border-white/10">
                                            <div className="flex items-start justify-between mb-3">
                                                <h3 className="text-white font-semibold text-lg">Question {index + 1}</h3>
                                                <span className="text-sm text-gray-400">{q.marks} mark{q.marks > 1 ? 's' : ''}</span>
                                            </div>

                                            <p className="text-gray-200 mb-4">{q.question_text}</p>

                                            {q.options && q.options.length > 0 && (
                                                <div className="space-y-2">
                                                    {q.options.map((option: string, i: number) => (
                                                        <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                                                            <div className="w-6 h-6 rounded-full border-2 border-green-400 flex items-center justify-center">
                                                                <span className="text-green-400 text-xs">{String.fromCharCode(65 + i)}</span>
                                                            </div>
                                                            <span className="text-gray-200">{option}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {q.question_type === 'short_answer' && (
                                                <textarea
                                                    placeholder="Type your answer here..."
                                                    rows={3}
                                                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                                                />
                                            )}

                                            <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
                                                <span className="px-2 py-1 rounded bg-white/5">📚 {q.subject}</span>
                                                <span className="px-2 py-1 rounded bg-white/5">📖 {q.topic}</span>
                                                <span className={`px-2 py-1 rounded ${q.difficulty === 'hard' ? 'bg-red-500/20 text-red-300' :
                                                    q.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
                                                        'bg-green-500/20 text-green-300'
                                                    }`}>
                                                    {q.difficulty}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-8 p-4 bg-blue-500/10 rounded-lg border border-blue-500/30">
                                    <p className="text-blue-200 text-sm">
                                        💡 <strong>Tip:</strong> This is a personalized quiz based on your learning profile. Take your time and show your work!
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </main>
            </div>
        </div>
    )
}
