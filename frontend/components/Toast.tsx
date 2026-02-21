'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'

interface Toast {
    id: string
    message: string
    type: 'success' | 'error' | 'info'
}

interface ToastContextValue {
    showToast: (message: string, type?: Toast['type']) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([])

    const showToast = useCallback((message: string, type: Toast['type'] = 'info') => {
        const id = Math.random().toString(36).slice(2)
        setToasts(prev => [...prev, { id, message, type }])
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id))
        }, 4500)
    }, [])

    const remove = (id: string) => setToasts(prev => prev.filter(t => t.id !== id))

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {/* Toast Container */}
            <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
                {toasts.map(toast => (
                    <div
                        key={toast.id}
                        className={`flex items-start gap-3 px-4 py-3 rounded-xl shadow-xl backdrop-blur-sm border pointer-events-auto
                            animate-in slide-in-from-right-4 fade-in duration-300
                            ${toast.type === 'success'
                                ? 'bg-green-900/80 border-green-500/40 text-green-100'
                                : toast.type === 'error'
                                    ? 'bg-red-900/80 border-red-500/40 text-red-100'
                                    : 'bg-slate-800/90 border-white/20 text-white'
                            }`}
                    >
                        <span className="text-lg flex-shrink-0 mt-0.5">
                            {toast.type === 'success' ? '✅' : toast.type === 'error' ? '❌' : 'ℹ️'}
                        </span>
                        <p className="flex-1 text-sm leading-snug">{toast.message}</p>
                        <button
                            onClick={() => remove(toast.id)}
                            className="flex-shrink-0 text-white/50 hover:text-white/90 transition-colors text-lg leading-none"
                        >
                            ×
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    )
}

export function useToast() {
    const ctx = useContext(ToastContext)
    if (!ctx) throw new Error('useToast must be used inside <ToastProvider>')
    return ctx
}
