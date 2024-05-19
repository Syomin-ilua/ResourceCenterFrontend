import { type FC } from 'react'
import styles from "./index.module.css";
import { useCourseContext } from '../../hooks/useCourseContext';
import { SVG } from '../svg';

export const ResultsTest: FC = () => {

    const { resultTest, setShowResultModal, submitResults } = useCourseContext();


    return (
        <>
            {resultTest &&
                <div className={styles.results__test}>
                    <div className={styles.results__title_wrapper}>
                        <h1 className={styles.results__title}>Результаты теста</h1>
                    </div>
                    <div className={styles.smile}>
                        {resultTest.resultProcent <= 50 ?
                            <SVG id='sad-smile' /> : <SVG id='happy-smile' />}
                    </div>
                    <div className={styles.results}>
                        <h2>Ваш результат: </h2>
                        <p>{resultTest.resultProcent}%</p>
                    </div>
                    <div className={styles.results__actions}>
                        {resultTest.resultProcent <= 50 &&
                            <button onClick={() => setShowResultModal(false)} className={styles.fix__errors_btn}>
                                Исправить ошибки
                            </button>
                        }
                        {resultTest.resultProcent > 50 &&
                            <button onClick={submitResults} className={styles.save__results_btn}>
                                Сохранить результат
                            </button>
                        }
                    </div>
                </div>}
        </>

    )
}