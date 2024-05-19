import { useAppSelector } from "../../app/hooks";
import { selectIsAuthenticated } from "../../features/user/userSlice";
import styles from "./index.module.css";
import { News } from "../../components/news";

export const Profsouz = () => {

    const isAuth = useAppSelector(selectIsAuthenticated);

    return (
        <div className={styles.profsouz}>
            <div className="container">
                <News />
            </div>
        </div>
    )
}
