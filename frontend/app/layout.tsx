import type { Metadata } from 'next'
import { Inter, Outfit } from 'next/font/google'
import './globals.css'
import { ToastProvider } from '@/components/Toast'
import { StudentProvider } from '@/components/StudentContext'
import { Navbar } from '@/components/Navbar'

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
})

const outfit = Outfit({
    subsets: ['latin'],
    variable: '--font-outfit',
})

export const metadata: Metadata = {
    title: 'AI Learning System – Personalized Education',
    description: 'Multi-agent AI learning system with personalized teaching, planning, assessment, mentorship, and well-being support',
    keywords: 'AI education, personalized learning, adaptive teaching, student support',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
            <body className={inter.className}>
                <StudentProvider>
                    <ToastProvider>
                        <Navbar />
                        {children}
                    </ToastProvider>
                </StudentProvider>
            </body>
        </html>
    )
}
