'use client'

export default function DashboardError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
            <div className="glass rounded-3xl p-10 max-w-md w-full text-center border border-white/10">
                <div className="text-6xl mb-4">🔌</div>
                <h2 className="text-2xl font-bold text-white mb-3">Agent Unavailable</h2>
                <p className="text-gray-400 mb-2 text-sm">
                    {error.message || 'Failed to connect to the AI agent.'}
                </p>
                <p className="text-gray-500 mb-8 text-xs">
                    Make sure the backend is running on port 8000.
                </p>
                <button
                    onClick={reset}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300"
                >
                    Try Again
                </button>
            </div>
        </div>
    )
}
