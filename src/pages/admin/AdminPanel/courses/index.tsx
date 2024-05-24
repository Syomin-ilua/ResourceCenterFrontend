import classNames from "classnames";
import styles from "./index.module.css";
import { useState } from "react";
import { CoursesActions } from "./coursesList";
import { CourseForm } from "../../../../components/courseForm";


export const CoursesAdmin = () => {

    const [selectFunction, setSelectFunction] = useState<"createCourse" | "coursesActions">("createCourse");

    return (
        <div className={styles.courses}>
            <div className={styles.courses__actions}>
                <button onClick={() => setSelectFunction("createCourse")} className={classNames(styles.btnSelect, selectFunction === "createCourse" && styles.btnSelect__active)}>Создать курс</button>
                <button onClick={() => setSelectFunction("coursesActions")} className={classNames(styles.btnSelect, selectFunction === "coursesActions" && styles.btnSelect__active)}>Все курсы</button>
            </div> 
            {selectFunction === "createCourse" && <CourseForm typeForm="createCourse"/>}
            {selectFunction === "coursesActions" && <CoursesActions />}
        </div>
    )
}