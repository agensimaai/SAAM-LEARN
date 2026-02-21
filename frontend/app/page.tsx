'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function Home() {
    const agents = [
        {
            name: 'Teacher',
            icon: '📚',
            description: 'Advanced pedagogical agent aligned with your curriculum.',
            color: 'from-blue-500 to-cyan-500',
        },
        {
            name: 'Planner',
            icon: '📅',
            description: 'Dynamic schedule architect for peak efficiency.',
            color: 'from-purple-500 to-pink-500',
        },
        {
            name: 'Assessment',
            icon: '📝',
            description: 'Cognitive diagnostic engine with deep feedback loops.',
            color: 'from-green-500 to-emerald-500',
        },
        {
            name: 'Mentor',
            icon: '🎯',
            description: 'Strategic guidance for career and life navigation.',
            color: 'from-orange-500 to-red-500',
        },
        {
            name: 'Psychology',
            icon: '💚',
            description: 'Resilience and mental well-being specialized support.',
            color: 'from-teal-500 to-green-500',
        },
        {
            name: 'Secretary',
            icon: '📊',
            description: 'Administrative core for task and progress data.',
            color: 'from-indigo-500 to-purple-500',
        },
    ]

    return (
        <main className="min-h-[calc(100vh-64px)] flex flex-col justify-center relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[120px] animate-pulse-slow"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="relative z-10 container mx-auto px-4 py-20 lg:py-32">
                {/* Hero Section */}
                <div className="max-w-4xl mx-auto text-center mb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-purple-300 mb-8 tracking-wider uppercase">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                            </span>
                            The Future of Education is Multi-Agentic
                        </div>
                        <h1 className="text-6xl md:text-8xl font-display font-black text-white mb-8 tracking-tight leading-[0.9]">
                            Expert AI
                            <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                                Personalized for You
                            </span>
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-400 font-light leading-relaxed mb-12 max-w-2xl mx-auto">
                            Unlock a world-class education with a private council of six specialized AI agents
                            collaborating to accelerate your potential.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link href="/dashboard">
                                <motion.button
                                    whileHover={{ scale: 1.05, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-10 py-5 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white text-lg font-bold rounded-2xl shadow-[0_0_40px_rgba(124,58,237,0.3)] hover:shadow-[0_0_60px_rgba(124,58,237,0.5)] transition-all duration-300"
                                >
                                    Access Your Dashboard →
                                </motion.button>
                            </Link>
                            <Link href="/status">
                                <button className="px-10 py-5 bg-white/5 hover:bg-white/10 text-white text-lg font-bold rounded-2xl border border-white/10 transition-all">
                                    System Status
                                </button>
                            </Link>
                        </div>
                    </motion.div>
                </div>

                {/* Agents Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-32">
                    {agents.map((agent, index) => (
                        <motion.div
                            key={agent.name}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                            className="group"
                        >
                            <div className="glass rounded-3xl p-8 h-full hover:bg-white/[0.08] transition-all duration-500 border border-white/10 group-hover:border-white/20 relative overflow-hidden">
                                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${agent.color} opacity-0 group-hover:opacity-10 blur-3xl transition-opacity duration-500`}></div>
                                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${agent.color} flex items-center justify-center text-4xl mb-6 shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                                    {agent.icon}
                                </div>
                                <h3 className="text-3xl font-display font-extrabold text-white mb-3">
                                    {agent.name}
                                </h3>
                                <p className="text-gray-400 font-medium leading-relaxed">
                                    {agent.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Architecture Proof */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="glass rounded-[40px] p-12 max-w-5xl mx-auto border border-white/10 flex flex-col md:flex-row items-center gap-12"
                >
                    <div className="flex-1 space-y-6">
                        <h2 className="text-4xl font-display font-black text-white leading-tight">
                            The Council <br />
                            <span className="text-purple-400">Architecture</span>
                        </h2>
                        <p className="text-gray-400 text-lg leading-relaxed">
                            Unlike generic AI chat interfaces, our system employs a distributed intelligence model.
                            Each agent is fine-tuned for a specific cognitive domain, ensuring you receive
                            expert-level instruction across academics, mental health, and career strategy.
                        </p>
                        <div className="flex gap-4">
                            <div className="flex flex-col">
                                <span className="text-3xl font-black text-white">6+</span>
                                <span className="text-xs text-gray-500 uppercase tracking-widest font-bold">Specialists</span>
                            </div>
                            <div className="w-px h-10 bg-white/10 self-center"></div>
                            <div className="flex flex-col">
                                <span className="text-3xl font-black text-white">100%</span>
                                <span className="text-xs text-gray-500 uppercase tracking-widest font-bold">Private</span>
                            </div>
                            <div className="w-px h-10 bg-white/10 self-center"></div>
                            <div className="flex flex-col">
                                <span className="text-3xl font-black text-white">24/7</span>
                                <span className="text-xs text-gray-500 uppercase tracking-widest font-bold">Available</span>
                            </div>
                        </div>
                    </div>
                    <div className="w-full md:w-72 h-72 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center relative group">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20 blur-2xl opacity-50"></div>
                        <div className="text-8xl animate-float">🧠</div>
                    </div>
                </motion.div>
            </div>

            {/* Footer-lite */}
            <footer className="relative z-10 border-t border-white/5 py-12">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-gray-600 text-sm font-medium">
                        © 2026 AI Learning Council • World-Class Multi-Agent Education Platform
                    </p>
                </div>
            </footer>
        </main>
    )
}
