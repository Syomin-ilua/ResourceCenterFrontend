import { Link } from "react-router-dom";
import styles from "./index.module.css";

export const Logo = () => {
    return (
        <Link to="/">
            <div className={styles.logo__wrapper}>
                <div className={styles.logo__icon_wrapper}>
                    <svg width="42" height="40" viewBox="0 0 42 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M29.625 15.6458L38.25 19.9583L21 28.5833L3.75 19.9583L12.375 15.6458M29.625 25.2292L38.25 29.5417L21 38.1667L3.75 29.5417L12.375 25.2292M21 1.75L38.25 10.375L21 19L3.75 10.375L21 1.75Z" stroke="#00528F" stroke-width="3" />
                    </svg>
                </div>
                <div className={styles.logo__text_wrapper}>
                    <p className={styles.logo__text}>Ресурсный центр
                        “Воронеж-ПЛАСТ”</p>
                </div>
            </div>
        </Link>
    )
}