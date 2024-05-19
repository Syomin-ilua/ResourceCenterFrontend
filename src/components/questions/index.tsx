import { memo, type FC } from "react"
import styles from "./index.module.css";
import { Question } from "../question";
import { SVG } from "../svg";

export type QuestionData = {
    question: string
    answers: string[]
    correctAnswer: string
    id?: number
}

type Props = {
    questions: QuestionData[]
}

export const Questions: FC<Props> = memo(({ questions }) => {
    return (
        <div className={styles.questions__wrapper}>
            <div className={styles.questions_wrapper_title}>
                <h1>Список вопросов:</h1>
            </div>
            {!questions?.length ? (
                <div className={styles.questions__empty}>
                    <SVG id="empty-icon" />
                    <p>Вопросов пока не добавлено</p>
                </div>
            ) :
                <div className={styles.questions}>
                    {questions.map((question, idx) => (
                        <Question
                            key={idx + 1}
                            id={idx + 1}
                            question={question.question}
                            answers={question.answers}
                            correctAnswer={question.correctAnswer}
                        />
                    ))}
                </div>
            }
        </div>
    )
})