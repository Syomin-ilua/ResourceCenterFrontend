import { useState } from "react";
import { useDeleteBookMutation, useGetAllBooksQuery, useLazyGetAllBooksQuery } from "../../../../../app/services/booksApi";
import type { Book } from "../../../../../app/types";
import { SVG } from "../../../../../components/svg";
import { hasErrorField } from "../../../../../utils/hasErrorField";
import { showMessage } from "../../../../../utils/showMessage";
import styles from "./index.module.css";
import { Modal } from "../../../../../components/modal";
import { Link } from "react-router-dom";
import { EditBook } from "../../../../../components/edit-book";
import { Loader } from "../../../../../components/loader";
import { BASE_STATIC } from "../../../../../constants";

export const BooksActions = () => {

    const [isShowModalBookUpdate, setIsShowModalBookUpdate] = useState(false);
    const [updateBook, setUpdateBook] = useState<Book>();

    const { data, isLoading, isError } = useGetAllBooksQuery({});

    const [triggerGetAllBooks] = useLazyGetAllBooksQuery();
    const [deleteBook] = useDeleteBookMutation();

    const handleDeleteBook = async (id: any) => {
        try {
            await deleteBook(id).unwrap();
            await triggerGetAllBooks({}).unwrap();
            showMessage({ message: "Книга успешно удалена", variantMessage: "success" });
        } catch (error) {
            if (hasErrorField(error)) {
                showMessage({ message: error.data.error, variantMessage: "error" })
            }
        }
    }

    const handleShowModalBookUpdate = (book: Required<Book>) => {
        setUpdateBook(book);
        setIsShowModalBookUpdate(true);
    }

    const handleHideModalBookUpdate = async () => {
        try {
            setIsShowModalBookUpdate(false);
            await triggerGetAllBooks({}).unwrap();
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
                            <SVG id="error-icon" />
                            <p>Произошла ошибка</p>
                        </div>
                    }
                    {!isLoading && !isError && !data?.length &&
                        <div className={styles.data__empty}>
                            <SVG id="empty-icon"/>
                            Эл. книги пока не добавили
                        </div>
                    }
                    {!isLoading && !isError && data &&
                        <ul className={styles.users__list}>
                            {data.map(book => (
                                <li className={styles.book__item}>
                                    <div className={styles.bookInfo}>
                                        <div className={styles.book__image}>
                                            <img src={`${BASE_STATIC}/books/images/${book.imageBook}`} alt="" />
                                        </div>
                                        <div className={styles.book__info}>
                                            <div className={styles.book__main_info}>
                                                <h2>{book.nameBook}</h2>
                                                <p className={styles.position}>{book.descriptionBook}</p>
                                            </div>
                                            <Link to={`/books/${book.id}`} className={styles.book__link}>Читать</Link>
                                        </div>
                                    </div>
                                    <div className={styles.actions__book}>
                                        <button onClick={() => handleDeleteBook(book.id)} className={styles.btn__delete_book}>
                                            <SVG id="delete-icon" />
                                        </button>
                                        <button onClick={() => handleShowModalBookUpdate(book)} className={styles.btn__edit_book}>
                                            <SVG id="register-icon" />
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    }
                </div>
            </div>
            <Modal isVisible={isShowModalBookUpdate} onClose={() => setIsShowModalBookUpdate(false)} className="edit__book">
                {updateBook && <EditBook book={updateBook} onCloseModal={handleHideModalBookUpdate} />}
            </Modal>
        </>
    )
}