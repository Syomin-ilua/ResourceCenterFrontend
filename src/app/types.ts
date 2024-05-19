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
    adminType: Boolean
}

export interface Answer {
    id: number
    text: string
    questionId: string
}

export interface Question {
    id: number
    text: string
    correctAnswer: string
    courseId: string
    answers: Answer[]
}

export interface Course {
    id: string
    courseName: string
    courseImage: string
    theoreticalMaterials: string
    questions: Question[]
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
}

export interface Book {
    id: string
    nameBook: string
    nameBookLower: string
    descriptionBook: string
    imageBook: string
    fileBook: string
}


