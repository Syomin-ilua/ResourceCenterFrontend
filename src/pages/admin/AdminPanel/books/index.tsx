import { useState } from "react";
import styles from "./index.module.css";
import { AddBook } from "./addBook";
import { BooksActions } from "./booksList";
import classNames from "classnames";

export const Books = () => {

    const [selectFunction, setSelectFunction] = useState<"addBook" | "booksActions">("addBook");

    return (
        <div className={styles.books}>
            <div className={styles.books__actions}>
                <button onClick={() => setSelectFunction("addBook")} className={classNames(styles.btnSelect, selectFunction === "addBook" && styles.btnSelect__active)}>Добавить книгу</button>
                <button onClick={() => setSelectFunction("booksActions")} className={classNames(styles.btnSelect, selectFunction === "booksActions" && styles.btnSelect__active)}>Редактировать или удалить книгу</button>
            </div>
            {selectFunction === "addBook" && <AddBook />}
            {selectFunction === "booksActions" && <BooksActions />}
        </div>
    )
}
