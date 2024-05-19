import type { FC } from "react"
import styles from "./index.module.css";
import { Link } from "react-router-dom";
import { SVG } from "../svg";
import type { Course as TCourse } from "../../app/types";

type Props = {
    course: Omit<TCourse, "questions">
}

export const Course: FC<Props> = ({ course }) => {

    return (
        <div className={styles.course}>
            <div className={styles.course__image_wrapper}>
                <img src={`http://localhost:3000/uploads/course-materials/images/${course.courseImage}`} alt="" />
            </div>
            <div className={styles.name__course_wrapper}>
                <h1 className={styles.name__course}>{course.courseName}</h1>
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