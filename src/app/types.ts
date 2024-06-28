export interface User {
    id: string
    surname: string
    userName: string
    patronymic: string
    position: string
    email: string
    tel: string
    password: string
    avatarURL: string
    role: string
    adminType: Boolean,
    participation: Participation[]
}

export interface Answer {
    id: number
    text: string
    questionId: string
}

export interface Question {
    id?: number
    text: string
    correctAnswer: string
    courseId?: string
    answers: Answer[]
}

export interface Course {
    id: string
    courseName: string
    courseDescription: string
    courseImage: string
    theoreticalMaterials: string
    questions: Question[]
    ResultsCourse: ResultsTest[]
}

export interface News {
    id: string
    newsName: string
    newsDescription: string
    newsImage: string
    categoryNews: string
    createdAt: Date
    updatedAt: Date
}

export interface ResultsTest {
    id: string
    resultProcent: number
    userId: string
    courseId: string
    user?: User
}

export interface Book {
    id: string
    nameBook: string
    nameBookLower: string
    descriptionBook: string
    categoryBook: string
    imageBook: string
    fileBook: string
}

export interface Event {
    id: number
    name: string
    description: string
    eventLocation: string
    eventPicture: string
    schedules: Schedule[]
    participations: Participation[]
}

export interface DayOfWeek {
    id: number
    name: string
    schedules: Schedule[]
}

export interface Schedule {
    id: number
    sportEventId: number
    dayOfWeekId: number
    startTime: string
    endTime: string
    sportEvent: Event
    dayOfWeek: DayOfWeek
}

export interface Participation {
    id: number
    userId: string
    sportEventId: number
    user: User
    sportEvent: Event
}


