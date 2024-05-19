import type { FC } from "react";
import styles from "./index.module.css";
import { Course as CourseComponent } from "../course";
import type { Course } from "../../app/types";

type Props = {
    courses: Omit<Course, "questions">[]
}

export const Courses: FC<Props> = ({ courses }) => {

    return (
        <div className={styles.courses}>
            {courses.map(course => (
                <CourseComponent
                    course={{
                        id: course.id,
                        courseName: course.courseName,
                        courseImage: course.courseImage,
                        theoreticalMaterials: course.theoreticalMaterials
                    }}
                />
            ))}
        </div>
    )
}