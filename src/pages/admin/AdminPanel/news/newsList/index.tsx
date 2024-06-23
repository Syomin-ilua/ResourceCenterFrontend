import { useState } from "react";
import styles from "./index.module.css"
import { useDeleteNewsMutation, useGetAllNewsQuery, useLazyGetAllNewsQuery } from "../../../../../app/services/newsApi";
import { showMessage } from "../../../../../utils/showMessage";
import { hasErrorField } from "../../../../../utils/hasErrorField";
import type { News } from "../../../../../app/types";
import { Link } from "react-router-dom";
import { SVG } from "../../../../../components/svg";
import { Modal } from "../../../../../components/modal";
import { EditNews } from "../../../../../components/editNews";
import { Loader } from "../../../../../components/loader";
import { BASE_STATIC } from "../../../../../constants";

export const NewsList = () => {

    const [isShowModalNewsUpdate, setIsShowModalNewsUpdate] = useState(false);
    const [updateNews, setUpdateNews] = useState<News>();

    const { data, isLoading, isError } = useGetAllNewsQuery({});

    const [triggerGetAllNews] = useLazyGetAllNewsQuery();
    const [deleteNews] = useDeleteNewsMutation();

    const handleDeleteNews = async (id: string) => {
        try {
            await deleteNews(id).unwrap();
            await triggerGetAllNews({}).unwrap();
            showMessage({ message: "Новость успешно удалена", variantMessage: "success" });
        } catch (error) {
            if (hasErrorField(error)) {
                showMessage({ message: error.data.error, variantMessage: "error" })
            }
        }
    }

    const handleShowModalNewsUpdate = (news: News) => {
        setUpdateNews(news);
        setIsShowModalNewsUpdate(true);
    }

    const handleHideModalNewsUpdate = async () => {
        try {
            setIsShowModalNewsUpdate(false);
            await triggerGetAllNews({}).unwrap();
        } catch (error) {
            if (hasErrorField(error)) {
                showMessage({ message: error.data.error, variantMessage: "error" })
            }
        }
    }


    return (
        <>
            <div className={styles.booksActions}>
                <div className={styles.books}>
                    {isLoading && !isError &&
                        <div className={styles.loader__wrapper}><Loader /></div>
                    }
                    {!isLoading && isError &&
                        <div className={styles.error__content}>
                            <SVG id="error-icon"/>
                            Произошла ошибка
                        </div>
                    }
                    {!isLoading && !isError && !data?.length &&
                        <div className={styles.data__empty}>
                            <SVG id="empty-icon"/>
                            Новости пока не добавили
                        </div>
                    }
                    {!isLoading && !isError && data &&
                        <ul className={styles.users__list}>
                            {data.map(news => (
                                <li className={styles.book__item}>
                                    <div className={styles.bookInfo}>
                                        <div className={styles.book__image}>
                                            <img src={`${BASE_STATIC}/news-images/${news.newsImage}`} alt="" />
                                        </div>
                                        <div className={styles.book__info}>
                                            <div className={styles.book__main_info}>
                                                <h2>{news.newsName}</h2>
                                                <p className={styles.position}>{news.newsDescription}</p>
                                            </div>
                                            <Link to={`/profsouz/news/${news.id}`} className={styles.book__link}>Читать</Link>
                                        </div>
                                    </div>
                                    <div className={styles.actions__book}>
                                        <button onClick={() => handleDeleteNews(news.id)} className={styles.btn__delete_book}>
                                            <SVG id="delete-icon" />
                                            <p>Удалить новость</p>
                                        </button>
                                        <button onClick={() => handleShowModalNewsUpdate(news)} className={styles.btn__edit_book}>
                                            <SVG id="register-icon" />
                                            <p>Редактировать новость</p>
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    }
                </div>
            </div>
            <Modal isVisible={isShowModalNewsUpdate} onClose={() => setIsShowModalNewsUpdate(false)} className="edit__news">
                {updateNews && <EditNews news={updateNews} onCloseModal={handleHideModalNewsUpdate} />}
            </Modal>
        </>
    )
}