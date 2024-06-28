import styles from "./index.module.css";
import { News } from "../../components/news";
import { useEffect } from "react";

export const Profsouz = () => {

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }, []);

    return (
        <div className={styles.profsouz}>
            <div className="container">
                <News />
            </div>
        </div>
    )
}
