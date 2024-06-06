import { useParams } from "react-router-dom";
import styles from "./index.module.css";
import { useGetBookQuery } from "../../app/services/booksApi";
import { PDFViewer } from "../../components/PDFViewer";
import { Loader } from "../../components/loader";
import { useEffect } from "react";
import { BASE_STATIC } from "../../constants";

const options = [
    { value: "technical", label: "Технические" },
    { value: "artistic", label: "Художественные" },
    { value: "magazines", label: "Журналы" }
]

export const Book = () => {

    const { id } = useParams();

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }, []);

    if (!id) {
        return <div className="container">Не был передан id книги</div>
    }

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { data, isLoading, isError } = useGetBookQuery(id);

    const category = options.find(option => option.value === data?.categoryBook);

    return (
        <div className={styles.book}>
            <div className="container">
                {isLoading && !isError && <div className={styles.loader}><Loader /></div>}
                {!isLoading && isError && <div className={styles.error__content}>Произошла ошибка</div>}
                {!isLoading && !isError &&
                    <div className={styles.wrapper}>
                        <div className={styles.book__info}>
                            <div className={styles.imageBook__wrapper}>
                                <img src={`${BASE_STATIC}/books/images/${data?.imageBook}`} alt="" />
                            </div>
                            <div className={styles.book__main_info}>
                                <h1 className={styles.nameBook}>{data?.nameBook}</h1>
                                <p className={styles.categoryBook}><span>Категория книги: </span> {category?.label} </p>
                                <p className={styles.descriptionBook}>{data?.descriptionBook}</p>
                            </div>
                        </div>
                        <div className={styles.book__wrapper}>
                            <PDFViewer urlDocument={`${BASE_STATIC}/books/files/${data?.fileBook}`} />
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}
