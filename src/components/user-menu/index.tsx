import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { logout, selectCurrent } from "../../features/user/userSlice";
import classNames from "classnames";
import styles from "./index.module.css";
import { useState } from "react";
import { SVG } from "../svg";

export const UserMenu = () => {

    const dispatch = useAppDispatch();
    const user = useAppSelector(selectCurrent);
    const [isActiveMenu, setIsActiveMenu] = useState(false);

    const navigate = useNavigate();

    const handleExitProfile = () => {
        dispatch(logout());
        localStorage.removeItem('token');
        navigate("/");
    }

    return (
        <div onMouseEnter={() => setIsActiveMenu(true)} onMouseLeave={() => setIsActiveMenu(false)} className={styles.user}>
            <div className={styles.userInfo}>
                <img className={styles.userImage} src={`http://localhost:3000${user?.avatarURL}`} alt="Изображение пользователя" />
                <p className={styles.userName}>{user?.userName}</p>
                <div className={classNames(styles.arrow__open, `${isActiveMenu && styles.arrow__open_active}`)}>
                    <SVG id="arrow-bottom-icon" />
                </div>
            </div>
            <div className={classNames(styles.userMenu, `${isActiveMenu && styles.userMenu__active}`)}>
                <Link to="/profile" className={styles.btn__link}>
                    <SVG id="profile-icon" />
                    Личный кабинет
                </Link>
                <button onClick={handleExitProfile} className={styles.btn__exit_profile}>
                    <SVG id="exit-profile-icon" />
                    Выйти из профиля
                </button>
            </div>
        </div>
    )
}