import { useParams } from "react-router-dom"
import styles from "./index.module.css"
import { useGetNewsByIdQuery } from "../../app/services/newsApi";
import { normalizeDate } from "../../utils/normalizeDate";
import { Back } from "../../components/back";
import { Loader } from "../../components/loader";
import { useEffect } from "react";
import { BASE_STATIC } from "../../constants";

export const CurrentNews = () => {

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }, []);

    const params = useParams();

    if (!params.id) {
        return (
            <div className={styles.currentNews}>
                <div className="container">
                    <Back />
                    Вы не указали id новости
                </div>
            </div>
        )
    }

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { data, isLoading, isError, error } = useGetNewsByIdQuery(params.id);

    return (
        <div className={styles.currentNews}>
            <div className="container">
                <div className={styles.wrapper}>
                    <Back />
                    {isLoading && !isError &&
                        <div className={styles.loader__wrapper}><Loader /></div>
                    }
                    {!isLoading && isError && error &&
                        <div>Произошла ошибка</div>
                    }
                    {!isLoading && !isError && data &&
                        <div className={styles.news}>
                            <div className={styles.news__main_info}>
                                <h1>{data.newsName}</h1>
                                <p className={styles.date__news}>Новость от {normalizeDate(data.createdAt)} <br /> <span>Категория: {data.categoryNews}</span></p>
                            </div>
                            <div className={styles.news__info}>
                                <div className={styles.news__image}>
                                    <img src={`${BASE_STATIC}/news-images/${data.newsImage}`} alt="" />
                                </div>
                                <p>{data.newsDescription}</p>
                            </div>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}