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
                                <Link className={styles.link} to="/courses">Обучение</Link>
                                <Link className={styles.link} to="/books">Библиотека</Link>
                                <Link className={styles.link} to="/profsouz">Профсоюзная организация</Link>
                                <Link className={styles.link} to="/sport">Досуговый центр</Link>
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