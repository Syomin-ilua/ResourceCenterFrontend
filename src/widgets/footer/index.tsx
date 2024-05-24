import { Link } from "react-router-dom";
import styles from "./index.module.css";
import { SVG } from "../../components/svg";

export const Footer = () => {
    return (

        <footer className={styles.footer}>
            <div className="container">
                <div className={styles.wrapper}>
                    <div className={styles.top}>
                        <div className={styles.leftside}>
                            {/* <Link className={styles.link} to="/">
                                <div className={styles.logo__wrapper}>
                                    <div className={styles.logo__icon_wrapper}>
                                        <svg width="42" height="40" viewBox="0 0 42 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M29.625 15.6458L38.25 19.9583L21 28.5833L3.75 19.9583L12.375 15.6458M29.625 25.2292L38.25 29.5417L21 38.1667L3.75 29.5417L12.375 25.2292M21 1.75L38.25 10.375L21 19L3.75 10.375L21 1.75Z" stroke="#fff" stroke-width="3" />
                                        </svg>
                                    </div>
                                    <div className={styles.logo__text_wrapper}>
                                        <p className={styles.logo__text}>Ресурсный центр
                                            “Воронеж-ПЛАСТ”</p>
                                    </div>
                                </div>
                            </Link> */}
                            <div className={styles.support__wrapper}>
                                <p className={styles.support__title}>Служба поддержки:</p>
                                <div className={styles.support__info}>
                                    <p className={styles.support__link}>
                                        <SVG id="tel-icon" />
                                        8 (999) 999-99-99
                                    </p>
                                    <p className={styles.support__link}>
                                        <SVG id="email-icon" />
                                        support-plast@yandex.ru
                                    </p>
                                    <p className={styles.support__link}>
                                        <SVG id="address-icon" />
                                        г. Воронеж, Железнодорожный
                                        район, Ленинский проспект, 14
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className={styles.rightside}>
                            <p className={styles.links__title}>Ссылки:</p>
                            <div className={styles.links}>
                                <Link className={styles.link} to="/">Главная</Link>
                                <Link className={styles.link} to="/">Обучение</Link>
                                <Link className={styles.link} to="/courses">Курсы</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.bottom}>
                <p className={styles.footer__text}>
                    © Все права защищены
                </p>
            </div>
        </footer>
    )
}