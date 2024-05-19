import { type FC } from 'react'
import { useCourseContext } from '../../hooks/useCourseContext'
import { SVG } from '../svg';
import TestIcon from "../../assets/images/search.png"
import styles from "./index.module.css";

export const Testing: FC = () => {

    const { courseData, currentQuestion, answers, stateTestingIsUnderway, handleAnswer, handleNext, handlePrev, setStateTestingIsUnderway, resultTest } = useCourseContext();

    return (
        <div className={styles.testing}>
            {stateTestingIsUnderway &&
                <div className={styles.testing__form}>
                    <p className={styles.qiestion__number}>Вопрос {currentQuestion + 1} из {courseData?.questions.length}</p>
                    <p className={styles.question}>{courseData?.questions[currentQuestion].text}</p>
                    <div className={styles.question__answers}>
                        {courseData?.questions[currentQuestion].answers.map((answer, idx) => (
                            <label className={styles.answer__wrapper} htmlFor={`answer-${answer.id}`}>
                                <input
                                    className={styles.answer__input}
                                    value={answer.text}
                                    id={`answer-${answer.id}`}
                                    name='answer'
                                    checked={answers![currentQuestion] === answer.text} onChange={(event) => handleAnswer(event.target.value)} type="radio"
                                />
                                <span className={styles.custom__radiobutton}>
                                    <div></div>
                                </span>
                                <p className={styles.answer__text}>{answer.text}</p>
                            </label>
                        ))}
                    </div>
                    <div className={styles.question__actions}>
                        <div className={styles.btn__wrapper}>
                            {currentQuestion !== 0 &&
                                <button type='button' onClick={handlePrev} className={styles.prev__question_btn}>
                                    <SVG id='prev-icon' />
                                    Назад
                                </button>
                            }
                        </div>
                        <div className={styles.btn__wrapper}>
                            <button type='button' onClick={handleNext} className={styles.next__question_btn}>
                                {currentQuestion < courseData!.questions.length - 1 ? "Далее" : "Завершить тестирование"}
                                <SVG id='next-icon' />
                            </button>
                        </div>
                    </div>
                </div>
            }
            {
                !stateTestingIsUnderway &&
                <div className={styles.startTesting__wrapper}>
                    <img className={styles.test__icon} src={TestIcon} alt="" />
                    <button onClick={() => setStateTestingIsUnderway(true)} className={styles.startTest__btn}>Начать тестирование</button>
                </div>
            }
        </div>
    )
}