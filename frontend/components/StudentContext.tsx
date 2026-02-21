'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface StudentContextValue {
    studentId: string
    studentName: string
    setStudent: (id: string, name: string) => void
}

const StudentContext = createContext<StudentContextValue | null>(null)

const LS_KEY_ID = 'als_student_id'
const LS_KEY_NAME = 'als_student_name'

export function StudentProvider({ children }: { children: ReactNode }) {
    const [studentId, setStudentId] = useState('')
    const [studentName, setStudentName] = useState('')
    const [showModal, setShowModal] = useState(false)

    // Form state
    const [nameInput, setNameInput] = useState('')
    const [gradeInput, setGradeInput] = useState('')

    useEffect(() => {
        const id = localStorage.getItem(LS_KEY_ID)
        const name = localStorage.getItem(LS_KEY_NAME)
        if (id && name) {
            setStudentId(id)
            setStudentName(name)
        } else {
            setShowModal(true)
        }
    }, [])

    const setStudent = (id: string, name: string) => {
        localStorage.setItem(LS_KEY_ID, id)
        localStorage.setItem(LS_KEY_NAME, name)
        setStudentId(id)
        setStudentName(name)
        setShowModal(false)
    }

    const handleSave = () => {
        if (!nameInput.trim()) return
        const grade = gradeInput.trim() || 'Grade 10'
        // Generate a stable student ID from name
        const id = `student_${nameInput.trim().toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`
        setStudent(id, nameInput.trim())
    }

    return (
        <StudentContext.Provider value={{ studentId, studentName, setStudent }}>
            {children}

            {showModal && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center">
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

                    {/* Modal */}
                    <div className="relative glass rounded-3xl p-8 w-full max-w-md mx-4 shadow-2xl border border-white/20">
                        {/* Icon */}
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-4xl mx-auto mb-6">
                            🎓
                        </div>

                        <h2 className="text-3xl font-display font-bold text-white text-center mb-2">
                            Welcome!
                        </h2>
                        <p className="text-gray-300 text-center mb-8">
                            Let&apos;s set up your learning profile so the AI can personalize everything for you.
                        </p>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-white font-semibold mb-2 text-sm">
                                    Your Name *
                                </label>
                                <input
                                    type="text"
                                    value={nameInput}
                                    onChange={e => setNameInput(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && handleSave()}
                                    placeholder="e.g. Aisha Khan"
                                    autoFocus
                                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-white font-semibold mb-2 text-sm">
                                    Current Grade (optional)
                                </label>
                                <input
                                    type="text"
                                    value={gradeInput}
                                    onChange={e => setGradeInput(e.target.value)}
                                    placeholder="e.g. Grade 10, Class 8"
                                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                                />
                            </div>
                        </div>

                        <button
                            onClick={handleSave}
                            disabled={!nameInput.trim()}
                            className="mt-8 w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-purple-500/40 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed text-lg"
                        >
                            Start Learning 🚀
                        </button>
                    </div>
                </div>
            )}
        </StudentContext.Provider>
    )
}

export function useStudent() {
    const ctx = useContext(StudentContext)
    if (!ctx) throw new Error('useStudent must be used inside <StudentProvider>')
    return ctx
}
