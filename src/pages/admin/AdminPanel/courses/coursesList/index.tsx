import { Link } from "react-router-dom";
import { useDeleteCourseMutation, useGetCoursesQuery, useLazyGetCoursesQuery } from "../../../../../app/services/coursesApi";
import { SVG } from "../../../../../components/svg";
import { hasErrorField } from "../../../../../utils/hasErrorField";
import { showMessage } from "../../../../../utils/showMessage";
import styles from "./index.module.css";
import { Loader } from "../../../../../components/loader";
import { Modal } from "../../../../../components/modal";
import { useState } from "react";
import { CourseForm } from "../../../../../components/courseForm";
import { type ResultsTest, type Course } from "../../../../../app/types";
import { ResultsCourse } from "../../../../../components/resultsCourse";
import { BASE_STATIC } from "../../../../../constants";

export const CoursesActions = () => {

    const { data, isLoading, isError } = useGetCoursesQuery({});

    const [triggerGetAllCourses] = useLazyGetCoursesQuery();
    const [deleteCourse] = useDeleteCourseMutation();

    const [isShowUpdateCourse, setIsShowUpdateCourse] = useState(false);
    const [updateCourse, setUpdateCourse] = useState<Course | null>(null);

    const [resultsCourseIdx, setResultsCourseIdx] = useState<number>(0);
    const [isShowResultsCourse, setIsShowResultsCourse] = useState(false);

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

    const handleUpdateCourse = (course: Course) => {
        setUpdateCourse(course);
        setIsShowUpdateCourse(true);
    }

    const handleResultsCourse = (idx: number) => {
        setResultsCourseIdx(idx);
        setIsShowResultsCourse(true);
    }


    return (
        <div className={styles.courses__actions}>
            {isLoading && !isError &&
                <div className={styles.loader__wrapper}><Loader /></div>
            }
            {!isLoading && isError &&
                <div className={styles.error__content}>
                    <SVG id="error-icon" />
                    Произошла ошибка
                </div>
            }
            {!isLoading && !isError && !data?.length &&
                <div className={styles.data__empty}>
                    <SVG id="empty-icon" />
                    Курсов пока не добавили
                </div>
            }
            {!isLoading && !isError && data &&
                <div className={styles.courses}>
                    <ul className={styles.courses__list}>
                        {data?.map((course, idx) => (
                            <>
                                <li className={styles.course__item}>
                                    <div className={styles.courseInfo}>
                                        <div className={styles.course__image}>
                                            <img src={`${BASE_STATIC}/course-materials/images/${course.courseImage}`} alt="" />
                                        </div>
                                        <div className={styles.course__info}>
                                            <div className={styles.course__main_info}>
                                                <h2>{course.courseName}</h2>
                                                <p className={styles.courseDescription}>{course.courseDescription}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={styles.actions__course}>
                                        <button onClick={() => handleDeleteCourse(course.id)} className={styles.btn__delete_course}>
                                            <SVG id="delete-icon" />
                                            <p>Удалить курс</p>
                                        </button>
                                        <button onClick={() => handleUpdateCourse(course)} className={styles.btn__update_course}>
                                            <SVG id="register-icon" />
                                            <p>Редактировать курс</p>
                                        </button>
                                        <button onClick={() => handleResultsCourse(idx)} className={styles.btn__update_course}>
                                            <SVG id="results-icon" />
                                            <p>Результаты курса</p>
                                        </button>
                                        <Link to={`/courses/${course.id}`} className={styles.course__link}>
                                            <SVG id="link-icon" />
                                            <p>Перейти к курсу</p>
                                        </Link>
                                    </div>
                                </li>
                            </>
                        ))}
                        <Modal className="modal__update_course" isVisible={isShowUpdateCourse} onClose={() => setIsShowUpdateCourse(false)}>
                            {updateCourse && <CourseForm onCloseModal={() => setIsShowUpdateCourse(false)} typeForm="updateCourse" course={updateCourse} />}
                        </Modal>
                        <Modal className="modal__results_course" isVisible={isShowResultsCourse} onClose={() => setIsShowResultsCourse(false)}>
                            {isShowResultsCourse && <ResultsCourse resultsCourse={data[resultsCourseIdx].ResultsCourse} />}
                        </Modal>
                    </ul>
                </div>
            }
        </div>
    )
}