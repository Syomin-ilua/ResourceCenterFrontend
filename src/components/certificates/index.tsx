import type { FC } from "react"
import styles from "./index.module.css";
import { useGetAllResultsUserQuery } from "../../app/services/resultsApi";
import { useAppSelector } from "../../app/hooks";
import { selectCurrent } from "../../features/user/userSlice";
import { SVG } from "../svg";
import { Cerfiticate } from "../certificate";
import { Loader } from "../loader";

export const Cerfiticates: FC = () => {

    const user = useAppSelector(selectCurrent);

    const { data, isError, isLoading } = useGetAllResultsUserQuery(user!.id);

    return (
        <div className={styles.cerfiticates}>
            <div className={styles.certificates__title_wrapper}>
                <h1 className={styles.certificates__title}>
                    <SVG id="certificate-icon" />
                    <p>Мои результаты</p>
                </h1>
            </div>
            {isLoading && !isError &&
                <div className={styles.loader__wrapper}><Loader /></div>
            }
            {!isLoading && isError &&
                <div className={styles.error__content}>Произошла ошибка при загрузке сертификатов</div>
            }
            {!isLoading && !isError && !data?.length &&
                <div className={styles.empty__results}>
                    <SVG id="empty-icon" />
                    <p>Вы пока ещё не проходили курсов</p>
                </div>
            }
            {!isLoading && !isError && data &&
                data.map(certificate => (
                    <div className={styles.cerfiticates__wrapper}>
                        <Cerfiticate
                            certificate={{
                                id: certificate.id,
                                userId: certificate.userId,
                                courseId: certificate.courseId,
                                resultProcent: certificate.resultProcent,
                                course: certificate.course
                            }}
                        />
                    </div>
                ))
            }
        </div>
    )
}