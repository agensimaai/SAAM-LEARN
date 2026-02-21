'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useState } from 'react'
import { useStudent } from '@/components/StudentContext'

export default function Dashboard() {
    const { studentName } = useStudent()

    const agents = [
        {
            id: 'teacher',
            name: 'Teacher',
            icon: '📚',
            description: 'Learn new concepts with personalized explanations',
            color: 'from-blue-500 to-cyan-500',
            href: '/dashboard/teacher',
        },
        {
            id: 'planner',
            name: 'Planner',
            icon: '📅',
            description: 'Get your personalized study plan',
            color: 'from-purple-500 to-pink-500',
            href: '/dashboard/planner',
        },
        {
            id: 'assessment',
            name: 'Assessment',
            icon: '📝',
            description: 'Take quizzes and track your progress',
            color: 'from-green-500 to-emerald-500',
            href: '/dashboard/assessment',
        },
        {
            id: 'mentor',
            name: 'Mentor',
            icon: '🎯',
            description: 'Get guidance on goals and habits',
            color: 'from-orange-500 to-red-500',
            href: '/dashboard/mentor',
        },
        {
            id: 'psychology',
            name: 'Well-being',
            icon: '💚',
            description: 'Support for stress and motivation',
            color: 'from-teal-500 to-green-500',
            href: '/dashboard/psychology',
        },
        {
            id: 'secretary',
            name: 'Secretary',
            icon: '📊',
            description: 'View progress and manage tasks',
            color: 'from-indigo-500 to-purple-500',
            href: '/dashboard/secretary',
        },
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            {/* Background effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
            </div>

            <div className="relative z-10">
                {/* Main Content */}
                <main className="container mx-auto px-4 py-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-12"
                    >
                        <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
                            Welcome Back, <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">{studentName || 'Learner'}</span>! 👋
                        </h2>
                        <p className="text-xl text-gray-300">
                            Your personalized AI council is ready. Choose an agent to continue your journey.
                        </p>
                    </motion.div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="glass rounded-xl p-6"
                        >
                            <div className="text-3xl mb-2">🔥</div>
                            <div className="text-2xl font-bold text-white">7 Days</div>
                            <div className="text-gray-300">Study Streak</div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="glass rounded-xl p-6"
                        >
                            <div className="text-3xl mb-2">⭐</div>
                            <div className="text-2xl font-bold text-white">85%</div>
                            <div className="text-gray-300">Average Score</div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="glass rounded-xl p-6"
                        >
                            <div className="text-3xl mb-2">📚</div>
                            <div className="text-2xl font-bold text-white">12</div>
                            <div className="text-gray-300">Concepts Mastered</div>
                        </motion.div>
                    </div>

                    {/* Agents Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {agents.map((agent, index) => (
                            <motion.div
                                key={agent.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 + index * 0.1 }}
                            >
                                <Link href={agent.href}>
                                    <motion.div
                                        whileHover={{ y: -8, scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="glass rounded-2xl p-6 h-full hover:bg-white/20 transition-all duration-300 cursor-pointer group"
                                    >
                                        <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${agent.color} flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                            {agent.icon}
                                        </div>
                                        <h3 className="text-2xl font-display font-bold text-white mb-2">
                                            {agent.name}
                                        </h3>
                                        <p className="text-gray-300 mb-4">
                                            {agent.description}
                                        </p>
                                        <div className="flex items-center text-blue-400 group-hover:text-blue-300">
                                            <span>Open</span>
                                            <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </div>
                                    </motion.div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </main>
            </div>
        </div>
    )
}
