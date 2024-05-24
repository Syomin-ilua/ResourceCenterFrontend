import { memo, type FC } from "react"
import styles from "./index.module.css";
import { Question } from "../question";
import { SVG } from "../svg";
import type { Question as QuestionType } from "../../app/types";

type Props = {
    questions: QuestionType[]
    onDeleteQuestion: (idx: number) => void
}

export const Questions: FC<Props> = memo(({ questions, onDeleteQuestion }) => {

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
                            index={idx}
                            question={{
                                id: idx + 1,
                                text: question.text,
                                answers: question.answers,
                                correctAnswer: question.correctAnswer
                            }}
                            deleteQuestion={onDeleteQuestion}
                        />
                    ))}
                </div>
            }
        </div>
    )
})