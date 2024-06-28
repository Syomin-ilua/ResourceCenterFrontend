import { useMemo } from 'react'
import Select from "react-select";
import { Link } from "react-router-dom";
import { normalizeDate } from "../../utils/normalizeDate";
import { SVG } from "../../components/svg";
import { useProfsouzContext } from '../../hooks/useProfsouzContext';
import styles from "./index.module.css";
import { Loader } from '../loader';
import { BASE_STATIC } from '../../constants';

export const News = () => {

    const { options, onChangeSelect, getValue, isLoading, isError, error, news } = useProfsouzContext();

    const memoizedOptions = useMemo(() => options, [options]);

    const memoizedNewsList = useMemo(() => {
        return (
            <ul className={styles.news__list}>
                {news.map((newsData, idx) => (
                    <li className={styles.news__item} key={idx}>
                        <div className={styles.news__image}>
                            <img src={`${BASE_STATIC}/news-images/${newsData.newsImage}`} alt={`image_${idx}`} />
                        </div>
                        <div className={styles.news__info}>
                            <div className={styles.news__main_info}>
                                <h1>{newsData.newsName}</h1>
                                <div className={styles.news__description}>
                                    <p>{newsData.newsDescription}</p>
                                </div>
                            </div>
                            <div className={styles.actions__news}>
                                <p>{normalizeDate(newsData.createdAt)}</p>
                                <Link className={styles.link} to={`news/${newsData.id}`}>Читать</Link>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        );
    }, [news]);

    return (
        <div className={styles.news__wrapper}>
            <div className={styles.top}>
                <h1 className={styles.news__title}>
                    <SVG id="news-icon" />
                    Новости
                </h1>
            </div>
            <p style={{ marginBottom: 10 }}>Все актуальные новости предприятия будут публиковаться здесь</p>
            <div className={styles.actions}>
                <div className={styles.selectCategory}>
                    <Select
                        isSearchable={false}
                        placeholder="Выберите категорию"
                        className={styles.select}
                        onChange={onChangeSelect}
                        value={getValue()}
                        options={memoizedOptions}
                        isDisabled={isError}
                    />
                </div>
            </div>
            <div className={styles.news}>
                {isLoading && !isError &&
                    <div className={styles.loader__wrapper}>
                        <Loader />
                    </div>
                }
                {!isLoading && isError && error &&
                    <div className={styles.error__data}>
                        <SVG id='error-icon' />
                        Произошла ошибка, попробуйте позже
                    </div>
                }
                {(!isLoading && !isError && news.length === 0) ?
                    <div className={styles.empty__data}>
                        <SVG id='empty-icon' />
                        Новостей пока что нет
                    </div> : memoizedNewsList
                }
            </div>
        </div>
    )
}