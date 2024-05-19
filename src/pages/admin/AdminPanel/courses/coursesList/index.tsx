import { Link } from "react-router-dom";
import { useDeleteCourseMutation, useGetCoursesQuery, useLazyGetCoursesQuery } from "../../../../../app/services/coursesApi";
import { SVG } from "../../../../../components/svg";
import { hasErrorField } from "../../../../../utils/hasErrorField";
import { showMessage } from "../../../../../utils/showMessage";
import styles from "./index.module.css";
import { Loader } from "../../../../../components/loader";

export const CoursesActions = () => {

    const { data, isLoading, isError } = useGetCoursesQuery({});

    const [triggerGetAllCourses] = useLazyGetCoursesQuery();
    const [deleteCourse] = useDeleteCourseMutation();

    const handleDeleteCourse = async (id: string) => {
        try {
            await deleteCourse(id).unwrap();
            await triggerGetAllCourses({}).unwrap();
            showMessage({ message: "Курс успешно удалён", variantMessage: "success" });
        } catch (error) {
            if (hasErrorField(error)) {
                showMessage({ message: error.data.error, variantMessage: "error" })
            }
        }
    }

    return (
        <div className={styles.courses__actions}>
            {isLoading && !isError &&
                <div className={styles.loader__wrapper}><Loader /></div>
            }
            {!isLoading && isError &&
                <div className={styles.error__content}>Произошла ошибка</div>
            }
            {!isLoading && !isError && !data?.length &&
                <div className={styles.data__empty}>Эл. книги пока не добавили</div>
            }
            {!isLoading && !isError && data &&
                <div className={styles.courses}>
                    <ul className={styles.courses__list}>
                        {data?.map(course => (
                            <li className={styles.course__item}>
                                <div className={styles.courseInfo}>
                                    <div className={styles.course__image}>
                                        <img src={`http://localhost:3000/uploads/course-materials/images/${course.courseImage}`} alt="" />
                                    </div>
                                    <div className={styles.course__info}>
                                        <div className={styles.course__main_info}>
                                            <h2>{course.courseName}</h2>
                                        </div>
                                        <Link to={`/courses/${course.id}`} className={styles.course__link}>О курсе</Link>
                                    </div>
                                </div>
                                <div className={styles.actions__course}>
                                    <button onClick={() => handleDeleteCourse(course.id)} className={styles.btn__delete_course}>
                                        <SVG id="delete-icon" />
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            }
        </div>
    )
}