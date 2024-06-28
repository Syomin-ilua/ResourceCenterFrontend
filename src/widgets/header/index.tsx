import { Link } from "react-router-dom";
import styles from "./index.module.css";
import { Link as NavLink } from "../../components/navlink";
import { SVG } from "../../components/svg";
import { useAppSelector } from "../../app/hooks";
import { selectIsAuthenticated } from "../../features/user/userSlice";
import { UserMenu } from "../../components/user-menu";

export const Header = () => {

    const isAuthenticated = useAppSelector(selectIsAuthenticated);

    return (
        <header className={styles.header}>
            <div className="container">
                <div className={styles.wrapper}>
                    <div className={styles.desktop__nav}>
                        <nav className={styles.nav}>
                            <ul className={styles.nav__list}>
                                <li className={styles.nav__item}>
                                    <NavLink
                                        linkURL="/"
                                        icon="home-icon"
                                    />
                                </li>
                                <li className={styles.nav__item}>
                                    <NavLink
                                        linkURL="/news"
                                        title="Новости"
                                        icon="news-icon"
                                    />
                                </li>
                                <li className={styles.nav__item}>
                                    <NavLink
                                        linkURL="/library"
                                        title="Библиотека"
                                        icon="books-icon"
                                    />
                                </li>
                                <li className={styles.nav__item}>
                                    <NavLink
                                        linkURL="/courses"
                                        title="Обучение"
                                        icon="courses-icon"
                                    />
                                </li>
                                <li className={styles.nav__item}>
                                    <NavLink
                                        linkURL="/cultural"
                                        title="Досуговый центр"
                                        icon="sport-icon"
                                    />
                                </li>
                            </ul>
                        </nav>
                        {isAuthenticated ?
                            <UserMenu /> :
                            <div className={styles.button__links}>
                                <Link className={styles.button__link_login} to="/auth/sign-in">
                                    <SVG id="login-icon" />
                                    <p className={styles.button__link_text}>Войти</p>
                                </Link>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </header>
    )
}