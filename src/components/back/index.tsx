import { useNavigate } from "react-router-dom";
import styles from "./index.module.css";
import { SVG } from "../svg";

export const Back = () => {

    const navigate = useNavigate();

    return (
        <button onClick={() => navigate(-1)} className={styles.back__btn}>
            <SVG id="back-icon" />
            Назад
        </button>
    )
}