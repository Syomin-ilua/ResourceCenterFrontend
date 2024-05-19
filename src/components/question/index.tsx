import type { FC } from "react"
import styles from "./index.module.css";
import type { QuestionData } from "../questions";

export const Question: FC<QuestionData> = ({ question, answers, correctAnswer, id }) => {
    console.log(question);

    return (
        <>
            <div className={styles.question}>
                <div className={styles.quiestion__top}>
                    <p className={styles.question__number}>Вопрос №{id}</p>
                    <p className={styles.question__description}>
                        {question}:
                    </p>
                </div>
                <div className={styles.answers__wrapper}>
                    <p className={styles.answers__title}>Список ответов:</p>
                    <ul className={styles.answers__list}>
                        {answers.map(answer => (
                            <li className={styles.answers__item}>{answer}</li>
                        ))}
                    </ul>
                </div>
                <div className={styles.correct__answer_question}>
                    <p>Правильный ответ: {correctAnswer}</p>
                </div>
            </div>
        </>
    )
}