import { useDeleteUserInUnionMutation, useGetAllUserInUnionQuery, useLazyGetAllUserInUnionQuery } from "../../../../app/services/unionApi";
import { useLazyCurrentQuery } from "../../../../app/services/userApi";
import { Loader } from "../../../../components/loader";
import { SVG } from "../../../../components/svg";
import { hasErrorField } from "../../../../utils/hasErrorField";
import { hasSuccessField } from "../../../../utils/hasSuccessField";
import { showMessage } from "../../../../utils/showMessage";
import styles from "./index.module.css";

export const Union = () => {

    const { data, isError, isLoading } = useGetAllUserInUnionQuery();

    const [triggerGetCurrent] = useLazyCurrentQuery();

    const [triggerGetAllUsersInUnion] = useLazyGetAllUserInUnionQuery();
    const [deleteUserInUnion] = useDeleteUserInUnionMutation();

    const handleDeleteUserInUnion = async (id: string) => {
        try {
            const result = await deleteUserInUnion(id).unwrap();     
            if (hasSuccessField(result)) {
                showMessage({ message: result.message, variantMessage: "success" })
            }
            await triggerGetAllUsersInUnion().unwrap();
            await triggerGetCurrent().unwrap();
        } catch (error) {
            if (hasErrorField(error)) {
                showMessage({ message: error.data.error, variantMessage: "error" });
            }
        }
    }

    return (
        <div className={styles.union}>
            <h1 className={styles.title}>
                <SVG id="profsouz-icon" />
                Участники профсоюза
            </h1>
            {isLoading && !isError &&
                <div className={styles.loader__wrapper}>
                    <Loader />
                </div>
            }
            {!isLoading && isError &&
                <div className={styles.error__content}>
                    <SVG id="error-icon" />
                    Произошла ошибка
                </div>}
            {!isLoading && !isError && !data?.length &&
                <div className={styles.empty__data}>
                    <SVG id="empty-icon" />
                    В профсоюзе нету участников
                </div>
            }
            <ul className={styles.users__list}>
                {data?.map(user => (
                    <li className={styles.user__item}>
                        <div className={styles.userInfo}>
                            <div className={styles.user__avatar}>
                                <img src={`http://localhost:3000/uploads/user-avatars/${user.user.avatarURL}`} alt="" />
                            </div>
                            <div className={styles.user__info}>
                                <div className={styles.user__main_info}>
                                    <h2>{user.user.surname} {user.user.userName} {user.user.patronymic}</h2>
                                    <p className={styles.position}>Должность: {user.user.position}</p>
                                </div>
                            </div>
                        </div>
                        <div className={styles.actions__user}>
                            <button onClick={() => handleDeleteUserInUnion(user.user.id)} className={styles.btn__delete_user}>
                                <SVG id="delete-icon" />
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}
