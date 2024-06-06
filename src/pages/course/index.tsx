import styles from "./index.module.css";
import { useCourseContext } from "../../hooks/useCourseContext";
import { Loader } from "../../components/loader";
import classNames from "classnames";
import { TheoretiacalMaterialsCourse } from "../../components/theoreticalMaterialsCourse";
import { Testing } from "../../components/testing";
import { Modal } from "../../components/modal";
import { ResultsTest } from "../../components/resultsTest";
import { Back } from "../../components/back";
import { useEffect } from "react";

export const Course = () => {

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }, []);

    const { courseData, isLoading, isError, stage, setStage, isShowResultModal, setShowResultModal } = useCourseContext();

    return (
        <div className={styles.course}>
            <div className="container">
                <Back />
                <div className={styles.wrapper}>
                    {isLoading && !isError && <Loader />}
                    {!isLoading && !isError && (
                        <div className={styles.course__body}>
                            <div className={styles.course__info_main}>
                                <p className={styles.course__text}>Курс: </p>
                                <h1 className={styles.courseName}>{courseData?.courseName}</h1>
                                <p className={styles.description__course}>{courseData?.courseDescription}</p>
                            </div>
                            <div className={styles.course__step_tabs}>
                                <button className={classNames(styles.course__tab_btn, `${stage === "theoretiacalMaterials" && styles.active__tab}`)} onClick={() => setStage("theoretiacalMaterials")}>Теоретическая часть</button>
                                <button className={classNames(styles.course__tab_btn, `${stage === "testing" && styles.active__tab}`)} onClick={() => setStage("testing")}>Тестирование</button>
                            </div>
                            {stage === "theoretiacalMaterials" ? <TheoretiacalMaterialsCourse /> : <Testing />}
                        </div>
                    )}
                    {!isLoading && isError && <p>Произошла ошибка при загрузке курса</p>}
                    <Modal isVisible={isShowResultModal} className="results__test_modal" onClose={() => setShowResultModal(false)}>
                        <ResultsTest />
                    </Modal>
                </div>
            </div>
        </div>
    )
}