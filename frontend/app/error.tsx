'use client'

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    return (
        <html>
            <body>
                <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-950 to-slate-900 flex items-center justify-center p-4">
                    <div className="text-center max-w-md">
                        <div className="text-7xl mb-6">⚠️</div>
                        <h1 className="text-3xl font-bold text-white mb-3">Something went wrong</h1>
                        <p className="text-gray-400 mb-8 text-base leading-relaxed">
                            {error.message || 'An unexpected error occurred. Please try again.'}
                        </p>
                        <button
                            onClick={reset}
                            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-purple-500/40 transition-all duration-300"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </body>
        </html>
    )
}
