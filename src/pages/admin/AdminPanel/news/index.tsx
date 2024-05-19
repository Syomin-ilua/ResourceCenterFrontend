import { useState } from "react"
import classNames from "classnames"
import styles from "./index.module.css"
import { AddNews } from "./addNews"
import { NewsList } from "./newsList"

export const News = () => {

    const [selectFunction, setSelectFunction] = useState<"addNews" | "newsList">("newsList")

    return (
        <div className={styles.news__container}>
            <div className={styles.news__actions}>
                <button onClick={() => setSelectFunction("addNews")} className={classNames(styles.btnSelect, selectFunction === "addNews" && styles.btnSelect__active)}>Добавить новость</button>
                <button onClick={() => setSelectFunction("newsList")} className={classNames(styles.btnSelect, selectFunction === "newsList" && styles.btnSelect__active)}>Удалить или редактировать новость</button>
            </div>
            {selectFunction === "addNews" && <AddNews />}
            {selectFunction === "newsList" && <NewsList />}
        </div>
    )
}