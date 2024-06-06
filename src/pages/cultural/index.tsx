import { useEffect } from "react";
import { Sport } from "../../components/sport";
import styles from "./index.module.css";

export const Cultural = () => {

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }, []);

    return (
        <div className={styles.cultural}>
            <div className="container">
                <Sport />
            </div>
        </div>
    )
}