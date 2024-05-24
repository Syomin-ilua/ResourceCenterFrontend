import type { FC } from "react"
import styles from "./index.module.css";
import type { Question as QuestionType } from "../../app/types";

type Props = {
    question: QuestionType
    index: number
    deleteQuestion: (idx: number) => void
}

export const Question: FC<Props> = ({ question, deleteQuestion, index }) => {

    return (
        <>
            <div className={styles.question}>
                <div className={styles.quiestion__top}>
                    <p className={styles.question__number}>Вопрос №{question.id}</p>
                    <p className={styles.question__description}>
                        {question.text}:
                    </p>
                </div>
                <div className={styles.answers__wrapper}>
                    <p className={styles.answers__title}>Список ответов:</p>
                    <ul className={styles.answers__list}>
                        {question.answers.map(answer => (
                            <li className={styles.answers__item}>{typeof answer === "object" ? answer.text : answer}</li>
                        ))}
                    </ul>
                </div>
                <div className={styles.correct__answer_question}>
                    <p>Правильный ответ: {question.correctAnswer}</p>
                </div>
                <button type="button" onClick={() => deleteQuestion(index)} className={styles.deleteQuestionBtn}>
                    <span></span>
                    <span></span>
                </button>
            </div>
        </>
    )
}