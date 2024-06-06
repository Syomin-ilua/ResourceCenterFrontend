import { type ReactNode, type FC, useEffect } from "react";
import { Container } from "../../../components/container";
import styles from "./index.module.css";
import { SVG } from "../../../components/svg";
import { Link, useLocation } from "react-router-dom";
import classNames from "classnames";
import { useAppSelector } from "../../../app/hooks";
import { selectCurrent } from "../../../features/user/userSlice";

type Props = {
    children: ReactNode
}

export const AdminPanel: FC<Props> = ({ children }) => {

    const user = useAppSelector(selectCurrent);

    const location = useLocation();

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }, [location.pathname]);

    return (
        <div className={styles.admin__panel_container}>
            <Container>
                <div className={styles.admin__wrapper}>
                    <div className={styles.admin__links}>
                        <div className={styles.admin__panel}>
                            {user?.role === "ADMIN" &&
                                <Link className={classNames(styles.admin__link, location.pathname === "/admin/users" && styles.admin__link_active)} to="/admin/users">
                                    <SVG id="user-icon" />
                                    Сотрудники
                                </Link>
                            }
                            <Link className={classNames(styles.admin__link, location.pathname === "/admin/courses" && styles.admin__link_active)} to="/admin/courses">
                                <SVG id="courses-icon" />
                                Курсы
                            </Link>
                            <Link className={classNames(styles.admin__link, location.pathname === "/admin/books" && styles.admin__link_active)} to="/admin/books">
                                <SVG id="books-icon" />
                                Библиотека
                            </Link>
                            <Link className={classNames(styles.admin__link, location.pathname === "/admin/news" && styles.admin__link_active)} to="/admin/news">
                                <SVG id="news-icon" />
                                Новости
                            </Link>
                            <Link className={classNames(styles.admin__link, location.pathname === "/admin/union" && styles.admin__link_active)} to="/admin/union">
                                <SVG id="profsouz-icon" />
                                Профсоюз
                            </Link>
                            <Link className={classNames(styles.admin__link, location.pathname === "/admin/events" && styles.admin__link_active)} to="/admin/events">
                                <SVG id="events-icon" />
                                Меропрития
                            </Link>
                        </div>
                    </div>
                    <div className={styles.admin__content}>
                        {children}
                    </div>
                </div>
            </Container>
        </div>
    )
}