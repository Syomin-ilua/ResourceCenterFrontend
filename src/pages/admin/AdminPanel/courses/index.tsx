import classNames from "classnames";
import styles from "./index.module.css";
import { useState } from "react";
import { CreateCourse } from "./create-course";
import { CoursesActions } from "./coursesList";


export const CoursesAdmin = () => {

    const [selectFunction, setSelectFunction] = useState<"createCourse" | "coursesActions">("createCourse");

    return (
        <div className={styles.courses}>
            <div className={styles.courses__actions}>
                <button onClick={() => setSelectFunction("createCourse")} className={classNames(styles.btnSelect, selectFunction === "createCourse" && styles.btnSelect__active)}>Создать курс</button>
                <button onClick={() => setSelectFunction("coursesActions")} className={classNames(styles.btnSelect, selectFunction === "coursesActions" && styles.btnSelect__active)}>Удалить курс</button>
            </div>
            {selectFunction === "createCourse" && <CreateCourse />}
            {selectFunction === "coursesActions" && <CoursesActions />}
        </div>
    )
}