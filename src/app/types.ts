export type User = {
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
    certificates?: Certificates[] 
}

export type Course = {
    id: String
    courseName: String
    courseImage: String
    theoreticalMaterials: String
    tests: Test
}

export type Test = {
    id: string
    courseId: string
    course: Course
    questions: Questions[]
}

export type Questions = {
    id: string
    text: string
    testId: number
    indexCorrectAnswer: number
    answers: Answer[]  
}

export type Answer = {
    id: number
    text: string
    questionId: number
}

export type TrainingMaterials = {
    id: String
    nameTrainingMaterials: String,
    imageTrainingMaterials: String,
    fileTrainingMaterials: String
}

export type Certificates = {
    // Описать структуру сертификатов к курсам 
}


