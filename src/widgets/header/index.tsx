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
                    {/* <Link to="/">
                        <div className={styles.logo__wrapper}>
                            <div className={styles.logo__icon_wrapper}>
                                <SVG id="logo-icon" />
                            </div>
                            <div className={styles.logo__text_wrapper}>
                                <p className={styles.logo__text}>Ресурсный центр
                                    “Воронеж-ПЛАСТ”</p>
                            </div>
                        </div>
                    </Link> */}
                    <div className={styles.desktop__nav}>
                        <nav className={styles.nav}>
                            <ul className={styles.nav__list}>
                                <li className={styles.nav__item}>
                                    <NavLink
                                        linkURL="/profsouz"
                                        title="Профсоюзная организация"
                                        icon="profsouz-icon"
                                    />
                                </li>
                                <li className={styles.nav__item}>
                                    <NavLink
                                        linkURL="/books"
                                        title="Эл. библиотека"
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