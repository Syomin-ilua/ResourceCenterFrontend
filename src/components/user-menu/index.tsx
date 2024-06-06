import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { logout, selectCurrent } from "../../features/user/userSlice";
import classNames from "classnames";
import styles from "./index.module.css";
import { useState } from "react";
import { SVG } from "../svg";
import { BASE_STATIC } from "../../constants";

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

    const { pathname } = useLocation();

    return (
        <div onMouseEnter={() => setIsActiveMenu(true)} onMouseLeave={() => setIsActiveMenu(false)} className={styles.user}>
            <div className={styles.userInfo}>
                <img className={styles.userImage} src={`${BASE_STATIC}/user-avatars/${user?.avatarURL}`} alt="Изображение пользователя" />
                <p className={styles.userName}>{user?.userName}</p>
                <div className={classNames(styles.arrow__open, `${isActiveMenu && styles.arrow__open_active}`)}>
                    <SVG id="arrow-bottom-icon" />
                </div>
            </div>
            <div className={classNames(styles.userMenu, `${isActiveMenu && styles.userMenu__active}`)}>
                <Link to="/profile" className={classNames(styles.btn__link_profile, pathname === "/profile" && styles.btn__link_profile_active)}>
                    <SVG id="profile-icon" />
                    Личный кабинет
                </Link>
                {(user?.role === "ADMIN" || user?.role === "MODERATOR") &&
                    <Link to="/admin/events" className={classNames(styles.btn__link_admin, (pathname === "/admin/events" || pathname === "/admin/books" || pathname === "/admin/courses" || pathname === "/admin/union" || pathname === "/admin/events") && styles.btn__link_admin_active)}>
                        <SVG id="admin-icon" />
                        Админ панель
                    </Link>
                }
                <button onClick={handleExitProfile} className={styles.btn__exit_profile}>
                    <SVG id="exit-profile-icon" />
                    Выйти из профиля
                </button>
            </div>
        </div>
    )
}