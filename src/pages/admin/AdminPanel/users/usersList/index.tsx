import { useState } from "react";
import { useDeleteUserMutation, useGetAllUsersQuery, useLazyGetAllUsersQuery } from "../../../../../app/services/userApi";
import { Modal } from "../../../../../components/modal";
import { SVG } from "../../../../../components/svg";
import { hasErrorField } from "../../../../../utils/hasErrorField";
import { showMessage } from "../../../../../utils/showMessage";
import styles from "./index.module.css";
import { type TEditUser } from "../../../../../components/edit-user";
import { EditUser } from "../../../../../components/edit-user";
import { Loader } from "../../../../../components/loader";
import { BASE_STATIC } from "../../../../../constants";

export const UsersList = () => {

    const [isShowModalUserUpdate, setIsShowModalUserUpdate] = useState(false);
    const [updateUser, setUpdateUser] = useState<TEditUser>();

    const { data, isLoading, isError } = useGetAllUsersQuery();

    const [triggerGetAllUsers] = useLazyGetAllUsersQuery();
    const [deleteUser] = useDeleteUserMutation();

    const handleDeleteUser = async (id: string) => {
        try {
            await deleteUser(id).unwrap();
            await triggerGetAllUsers().unwrap();
            showMessage({ message: "Сотрудник успешно удалён", variantMessage: "success" });
        } catch (error) {
            if (hasErrorField(error)) {
                showMessage({ message: error.data.error, variantMessage: "error" })
            }
        }
    }

    const handleShowModalUserUpdate = (user: TEditUser) => {
        setUpdateUser(user);
        setIsShowModalUserUpdate(true);
    }

    const handleHideModalUserUpdate = async () => {
        try {
            setIsShowModalUserUpdate(false);
            await triggerGetAllUsers().unwrap();
        } catch (error) {
            if (hasErrorField(error)) {
                showMessage({ message: error.data.error, variantMessage: "error" });
            }
        }
    }

    return (
        <>
            <div className={styles.users}>
                {isLoading && !isError &&
                    <div className={styles.loader__wrapper}>
                        <Loader />
                    </div>
                }
                {!isLoading && isError &&
                    <div className={styles.error__content}>
                        <SVG id="error-icon"/>
                        Произошла ошибка
                    </div>}
                {!isLoading && !isError && !data?.length &&
                    <div className={styles.empty__data}>
                        <SVG id="empty-icon"/>
                        Сотрудников пока не добавляли
                    </div>
                }
                <ul className={styles.users__list}>
                    {data?.map(user => (
                        <li className={styles.user__item}>
                            <div className={styles.userInfo}>
                                <div className={styles.user__avatar}>
                                    <img src={`${BASE_STATIC}/user-avatars/${user.avatarURL}`} alt="" />
                                </div>
                                <div className={styles.user__info}>
                                    <div className={styles.user__main_info}>
                                        <h2>{user.surname} {user.userName} {user.patronymic}</h2>
                                        <p className={styles.position}>Должность: {user.position}</p>
                                    </div>
                                    <div className={styles.outher__info}>
                                        <p className={styles.contacts__info}><span>Эл. почта: </span>{user.email}</p>
                                        <p className={styles.contacts__info}><span>Номер телефона: </span>{user.tel}</p>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.actions__user}>
                                {!user.adminType &&
                                    <button onClick={() => handleDeleteUser(user.id)} className={styles.btn__delete_user}>
                                        <SVG id="delete-icon" />
                                    </button>
                                }
                                <button onClick={() => handleShowModalUserUpdate(user)} className={styles.btn__edit_user}>
                                    <SVG id="register-icon" />
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
            <Modal isVisible={isShowModalUserUpdate} onClose={() => setIsShowModalUserUpdate(false)} className="edit__user">
                {updateUser && <EditUser onCloseModal={handleHideModalUserUpdate} user={updateUser} />}
            </Modal>
        </>
    )
}