import { type FC } from "react"
import type { ResultsTest } from "../../app/types"
import styles from "./index.module.css";
import { hasErrorField } from "../../utils/hasErrorField";
import { showMessage } from "../../utils/showMessage";
import axios from "axios";
import { saveAs } from "file-saver";
import { BASE_STATIC, BASE_URL } from "../../constants";
import { SVG } from "../svg";
import { useDeleteResultMutation } from "../../app/services/resultsApi";
import { hasSuccessField } from "../../utils/hasSuccessField";
import { useLazyGetCoursesQuery } from "../../app/services/coursesApi";

type Props = {
    resultsCourse: ResultsTest[]
}

export const ResultsCourse: FC<Props> = ({ resultsCourse }) => { 

    const [deleteResult] = useDeleteResultMutation();
    const [triggerGetAllCourses] = useLazyGetCoursesQuery();

    const handleDeleteResult = async (id: string) => {
        try {
            const result = await deleteResult(id).unwrap();
            if (hasSuccessField(result)) {
                showMessage({ message: result.message, variantMessage: "success" });
            }
            await triggerGetAllCourses({}).unwrap();
        } catch (error) {
            if (hasErrorField(error)) {
                showMessage({ message: error.data.error, variantMessage: "error" })
            }
        }
    }

    const handleDownloadCertificate = async (id: string) => {
        try {

            const response = await axios.get(`${BASE_URL}/api/result/${id}`, {
                responseType: 'blob'
            });

            saveAs(response.data, `Сертификат №${id}`);

        } catch (error) {
            if (hasErrorField(error)) {
                showMessage({ message: error.data.error, variantMessage: "error" });
            }
        }
    }

    return (
        <div className={styles.resutlsCourse}>
            <h1 className={styles.title}>
                <SVG id="results-icon" />
                Результаты тестирования курса
            </h1>
            {resultsCourse.length === 0 ?
                <div className={styles.data__empty}>
                    <SVG id="empty-icon" />
                    Этот курс пока никто не проходил
                </div> :
                <div className={styles.results}>
                    {resultsCourse.map((resultCourse => (
                        <div className={styles.result}>
                            <div className={styles.user__info}>
                                <div className={styles.user}>
                                    <div className={styles.user__avatar}>
                                        <img src={`${BASE_STATIC}/user-avatars/${resultCourse.user?.avatarURL}`} alt="" />
                                    </div>
                                    <div className={styles.userInfo}>
                                        <h2>{resultCourse.user?.surname} {resultCourse.user?.userName} {resultCourse.user?.patronymic}</h2>
                                        <p className={styles.position}>Должность: {resultCourse.user?.position}</p>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.test__results}>
                                <p className={styles.results__info}><span>№ результата:</span>{resultCourse.id}</p>
                                <p className={styles.results__info}><span>Результат:</span>{resultCourse.resultProcent} %</p>
                            </div>
                            <div className={styles.certificate__actions}>
                                <button type="button" onClick={() => handleDownloadCertificate(resultCourse.id)} className={styles.downoald__certificate}>
                                    <SVG id="downoald-icon" />
                                    Скачать сертификат
                                </button>
                                <button type="button" onClick={() => handleDeleteResult(resultCourse.id)} className={styles.delete__result_btn}>
                                    <SVG id="delete-icon" />
                                    Удалить результат
                                </button>
                            </div>
                        </div>
                    )))}
                </div>
            }
        </div>
    )
}