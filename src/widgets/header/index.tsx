import { Container } from "../../components/container";
import { Link } from "react-router-dom";
import styles from "./index.module.css";
import { Logo } from "../../components/logo";
import { Link as NavLink } from "../../components/navlink";
import { SVG } from "../../components/svg";

export const Header = () => {

    return (
        <header className={styles.header}>
            <Container>
                <div className={styles.wrapper}>
                    <Logo />
                    <div className={styles.desktop__nav}>
                        <nav className={styles.nav}>
                            <ul className={styles.nav__list}>
                                <li className={styles.nav__item}>
                                    <NavLink
                                        linkURL="/"
                                        title="Главная"
                                        icon="main-icon"
                                    />
                                </li>
                                <li className={styles.nav__item}>
                                    <NavLink
                                        linkURL="/zavod"
                                        title="О заводе"
                                        icon="factory-icon"
                                    />
                                </li>
                                <li className={styles.nav__item}>
                                    <NavLink
                                        linkURL="/courses"
                                        title="Курсы"
                                        icon="courses-icon"
                                    />
                                </li>
                            </ul>
                        </nav>
                        <div className={styles.button__links}>
                            <Link className={styles.button__link_register} to="/auth/sign-up">
                                <SVG id="register-icon" />
                                <p className={styles.button__link_text}>Регистрация</p>
                            </Link>
                            <Link className={styles.button__link_login} to="/auth/sign-in">
                                <SVG id="login-icon" />
                                <p className={styles.button__link_text}>Войти</p>
                            </Link>
                        </div>
                    </div>
                </div>
            </Container>
        </header>
    )
}