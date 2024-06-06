import type { FC } from "react"
import styles from "./index.module.css";
import { Link } from "react-router-dom";
import { SVG } from "../svg";
import type { Course as TCourse } from "../../app/types";
import { BASE_STATIC } from "../../constants";

type Props = {
    course: TCourse
}

export const Course: FC<Props> = ({ course }) => {

    return (
        <div className={styles.course}>
            <div className={styles.course__image_wrapper}>
                <img src={`${BASE_STATIC}/course-materials/images/${course.courseImage}`} alt="" />
            </div>
            <div className={styles.name__course_wrapper}>
                <h1 className={styles.name__course}>{course.courseName}</h1>
                <p className={styles.description__course}>{course.courseDescription}</p>
                <p className={styles.questions__course}><span>Кол-во вопросов: </span>{course.questions.length}</p>
            </div>
            <div className={styles.course__link_wrapper}>
                <Link className={styles.course__link} to={`/courses/${course.id}`}>
                    <SVG id="course-go-icon" />
                    Пройти курс
                </Link>
            </div>
        </div>
    )
}