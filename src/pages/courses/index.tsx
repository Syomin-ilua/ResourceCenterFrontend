import styles from "./index.module.css";
import { SVG } from "../../components/svg";
import { Courses as CoursesComponent } from "../../components/courses";
import { useCoursesContext } from "../../hooks/useCoursesContext";
import { Loader } from "../../components/loader";

export const Courses = () => {

    const { searchValue, handleSetSearchValue, isLoading, isError, coursesData } = useCoursesContext();

    return (
        <div className={styles.courses}>
            <div className="container">
                <div className={styles.top}>
                    <div className={styles.search}>
                        <input
                            name="search"
                            className={styles.search__input}
                            type="text"
                            placeholder="Введите название курса"
                            value={searchValue}
                            onChange={handleSetSearchValue}
                            disabled={isError}
                        />
                        <SVG id="search-icon" />
                    </div>
                </div>
                {isLoading && !isError &&
                    <div className={styles.loader__wrapper}>
                        <Loader />
                    </div>
                }
                {!isLoading && isError &&
                    <div className={styles.error__content}>
                        <SVG id="error-icon" />
                        Произошла ошибка
                    </div>
                }
                {!isLoading && !isError && coursesData.length !== 0 ?
                    <CoursesComponent courses={coursesData} /> :
                    <div className={styles.empty}>
                        <SVG id="empty-icon" />
                        К сожалению тут пока ничего нет
                    </div>
                }
            </div>
        </div>
    )
}