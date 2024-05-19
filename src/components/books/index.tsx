import styles from "./index.module.css";
import { type Book } from "../../app/services/booksApi";
import type { FC } from "react";
import { Link } from "react-router-dom";

type Props = {
    booksData: Book[]
}

export const Books: FC<Props> = ({ booksData }) => {
    return (
        <div className={styles.books}>
            {booksData.map(book => (
                <div className={styles.book}>
                    <div className={styles.book__info}>
                        <div className={styles.book__image}>
                            <img src={`http://localhost:3000/uploads/books/images/${book.imageBook}`} alt="" />
                        </div>
                        <div className={styles.book__main_info}>
                            <h1>{book.nameBook}</h1>
                            <p>{book.descriptionBook}</p>
                        </div>
                    </div>
                    <div className={styles.book__link}>
                        <Link to={book.id}>Читать</Link>
                    </div>
                </div>
            ))}
        </div>

    )
}
