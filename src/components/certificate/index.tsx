import type { FC } from "react";
import type { Course, ResultsTest } from "../../app/types";
import styles from "./index.module.css";
import { SVG } from "../svg";
import { saveAs } from "file-saver";
import axios from "axios";
import { BASE_URL } from "../../constants";
import { hasErrorField } from "../../utils/hasErrorField";
import { showMessage } from "../../utils/showMessage";

type Props = {
    certificate: ResultsTest & {
        course: Omit<Course, "questions">
    }
}

export const Cerfiticate: FC<Props> = ({ certificate }) => {

    const handleDownloadCertificate = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/api/result/${certificate.id}`, {
                responseType: 'blob'
            });

            saveAs(response.data, `Сертификат №${certificate.id}`);
        } catch (error) {
            if (hasErrorField(error)) {
                showMessage({ message: error.data.error, variantMessage: "error" });
            }
        }
    }

    return (
        <div className={styles.certificate}>
            <div className={styles.test__results}>
                <p className={styles.results__info}><span>№ результата:</span>{certificate.id}</p>
                <p className={styles.results__info}><span>Название курса:</span>{certificate.course.courseName}</p>
                <p className={styles.results__info}><span>Результат:</span>{certificate.resultProcent}%</p>
            </div>
            <div className={styles.certificate__actions}>
                <button type="button" onClick={() => handleDownloadCertificate()} className={styles.downoald__certificate}>
                    <SVG id="downoald-icon" />
                    Скачать сертификат
                </button>
            </div>
        </div>
    )
}
