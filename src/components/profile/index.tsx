import styles from "./index.module.css";
import { SVG } from "../svg";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { logout, selectCurrent } from "../../features/user/userSlice";
import { useNavigate } from "react-router-dom";
import { Modal } from "../modal";
import { EditProfile } from "../edit-profile";
import { useState } from "react";
import { BASE_STATIC } from "../../constants";

export const Profile = () => {

    const [isVisible, setIsVisible] = useState(false);

    const user = useAppSelector(selectCurrent);

    const dispatch = useAppDispatch();

    const navigate = useNavigate();

    const handleExitProfile = () => {
        dispatch(logout());
        localStorage.removeItem("token");
        navigate("/");
    }

    return (
        <>
            <div className={styles.profile__wrapper}>
                <div className={styles.user__info}>
                    <div className={styles.userAvatar__wrapper}>
                        <img className={styles.userAvatar} src={`${BASE_STATIC}/user-avatars/${user?.avatarURL}`} alt="" />
                    </div>
                    <div className={styles.userInfo__wrapper}>
                        <div className={styles.main__info}>
                            <h1 className={styles.fio}>
                                {user?.surname} {user?.userName} {user?.patronymic}
                            </h1>
                            <p className={styles.position__text}>Должность: {user?.position}</p>
                        </div>
                        <div className={styles.connection__info}>
                            <p className={styles.connection__link}><span>Эл. почта: </span>{user?.email}</p>
                            <p className={styles.connection__link}><span>Номер телефона: </span>{user?.tel}</p>
                        </div>
                    </div>
                </div>
                <div className={styles.user__actions}>
                    <button onClick={() => setIsVisible(true)} className={styles.edit__user}>
                        <SVG id="edit-user-icon" />
                        <p>Редактировать профиль</p>
                    </button>
                    <button onClick={handleExitProfile} className={styles.exit__profile}>
                        <SVG id="exit-profile-icon" />
                        <p>Выйти из профиля</p>
                    </button>
                </div>
            </div>
            <Modal className="edit__user_modal" isVisible={isVisible} onClose={() => setIsVisible(false)}>
                <EditProfile onCloseModal={() => setIsVisible(false)} />
            </Modal>
        </>
    )
}