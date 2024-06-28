import styles from "./index.module.css";
import { News as NewsComponent } from "../../components/news";
import { useEffect } from "react";

export const News = () => {

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }, []);

    return (
        <div className={styles.profsouz}>
            <div className="container">
                <NewsComponent />
            </div>
        </div>
    )
}
