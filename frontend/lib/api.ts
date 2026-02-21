const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export interface StudentProfile {
    student_id: string
    name: string
    age: number
    grade: string
    school_board: string
    syllabus: string
    hobbies: string[]
    interests: string[]
    sports: string[]
    daily_routine?: string
    cultural_context?: string
}

export interface TeacherRequest {
    student_id: string
    concept: string
    subject: string
    topic: string
    additional_context?: string
}

export interface PlannerRequest {
    student_id: string
    plan_type: 'daily' | 'weekly'
    available_hours_per_day: number
    specific_goals?: string[]
}

export interface AssessmentRequest {
    student_id: string
    assessment_type: string
    subject: string
    topics: string[]
    difficulty_level: string
    number_of_questions: number
}

export interface MentorRequest {
    student_id: string
    topic: string
    specific_question?: string
}

export interface PsychologyRequest {
    student_id: string
    concern_type: string
    description?: string
}

export interface SecretaryRequest {
    student_id: string
    request_type: string
    time_period?: string
}

class APIClient {
    private baseURL: string

    constructor(baseURL: string = API_BASE_URL) {
        this.baseURL = baseURL
    }

    private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
        const response = await fetch(`${this.baseURL}${endpoint}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options?.headers,
            },
        })

        if (!response.ok) {
            const error = await response.json().catch(() => ({ detail: 'Unknown error' }))
            throw new Error(error.detail || `HTTP error! status: ${response.status}`)
        }

        return response.json()
    }

    // Student endpoints
    async createStudent(profile: StudentProfile) {
        return this.request('/students/', {
            method: 'POST',
            body: JSON.stringify(profile),
        })
    }

    async getStudent(studentId: string) {
        return this.request(`/students/${studentId}`)
    }

    // Agent endpoints
    async callTeacher(request: TeacherRequest) {
        return this.request('/agents/teacher', {
            method: 'POST',
            body: JSON.stringify(request),
        })
    }

    async callPlanner(request: PlannerRequest) {
        return this.request('/agents/planner', {
            method: 'POST',
            body: JSON.stringify(request),
        })
    }

    async callAssessment(request: AssessmentRequest) {
        return this.request('/agents/assessment', {
            method: 'POST',
            body: JSON.stringify(request),
        })
    }

    async callMentor(request: MentorRequest) {
        return this.request('/agents/mentor', {
            method: 'POST',
            body: JSON.stringify(request),
        })
    }

    async callPsychology(request: PsychologyRequest) {
        return this.request('/agents/psychology', {
            method: 'POST',
            body: JSON.stringify(request),
        })
    }

    async callSecretary(request: SecretaryRequest) {
        return this.request('/agents/secretary', {
            method: 'POST',
            body: JSON.stringify(request),
        })
    }
}

export const api = new APIClient()
