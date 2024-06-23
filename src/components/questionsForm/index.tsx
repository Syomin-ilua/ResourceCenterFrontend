import type { Answer, Question } from "../../app/types";
import { showMessage } from "../../utils/showMessage";
import { Questions } from "../questions";
import { SVG } from "../svg";
import styles from "./index.module.css";
import { useState, type FC } from "react";

type Props = {
    questions: Question[]
    onAddQuestion: (data: Question) => void
    deleteQuestion: (idx: number) => void
}

export const QuestionsForm: FC<Props> = ({ questions, onAddQuestion, deleteQuestion }) => {

    const [currentQuestion, setCurrentQuestion] = useState("");
    const [currentAnswers, setCurrentAnswers] = useState<any[]>([]);
    const [correctAnswer, setCorrectAnswer] = useState("");

    const handleAddAnswer = () => {
        setCurrentAnswers([...currentAnswers, '']);
    }

    const handleCorrectAnswerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCorrectAnswer(e.target.value);
    }

    const handleAnswerChange = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
        const updatedAnswers = [...currentAnswers];
        updatedAnswers[idx] = e.target.value;
        setCurrentAnswers(updatedAnswers);
    }

    const handleAddQuestion = () => {
        if(currentQuestion.length < 10) {
            showMessage({message: "Введите вопрос, минимальное кол-во символов 10", variantMessage: "warning"});
            return;
        }

        if(currentAnswers.length < 3) {
            showMessage({message: "Минимальное кол-во вариантов ответа 3", variantMessage: "warning"});
            return;
        }

        currentAnswers.forEach(currentAnswer => {
            if(!currentAnswer.length) {
                showMessage({message: "Поля вариантов ответа не должны быть пустыми", variantMessage: "warning"});
                return;
            }
        })

        if(!correctAnswer.length) {
            showMessage({message: "Введите правильный вариант ответа", variantMessage: "warning"});
            return;
        }

        onAddQuestion({
            text: currentQuestion,
            answers: currentAnswers,
            correctAnswer: correctAnswer
        });
        setCurrentQuestion("");
        setCurrentAnswers([]);
        setCorrectAnswer("");
    }

    return (
        <>
            <div className={styles.course__test_questions}>
                <div className={styles.course__test_title}>
                    <p>Создание теста</p>
                </div>
                <label htmlFor='nameQuestion' className={styles.input__question_wrapper}>
                    <p className={styles.input__title}>Вопрос:</p>
                    <input
                        className={styles.input}
                        onChange={(e) => setCurrentQuestion(e.target.value)} id='nameQuestion'
                        type="text"
                        value={currentQuestion}
                    />
                </label>
                <div className={styles.inputs__answers_wrapper}>
                    <p className={styles.input__title}>Варианты ответов:</p>
                    <div className={styles.inputs__answers}>
                        {currentAnswers.map((answer: string, idx: number) => (
                            <label className={styles.input__answer_wrapper} htmlFor={`${idx}`}>
                                <input
                                    className={styles.input}
                                    type="text"
                                    id={`${idx}`}
                                    value={answer}
                                    onChange={(e) => handleAnswerChange(e, idx)}
                                />
                            </label>
                        ))}
                    </div>
                    <button type='button' onClick={handleAddAnswer} className={styles.add__answer}>
                        <SVG id='add-icon' />
                        Добавить вариант ответа
                    </button>
                </div>
                <label htmlFor='correctAnswer' className={styles.inputs__correctAnswer_wrapper}>
                    <p className={styles.input__title}>Правильный ответ:</p>
                    <input value={correctAnswer} onChange={handleCorrectAnswerChange} className={styles.input} type="text" id='correctAnswer' />
                    <button type='button' onClick={handleAddQuestion} className={styles.add__quiestion}>
                        <SVG id='add-icon' />
                        Добавить вопрос
                    </button>
                </label>
            </div>
            <Questions questions={questions} onDeleteQuestion={deleteQuestion} />
        </>
    )
}