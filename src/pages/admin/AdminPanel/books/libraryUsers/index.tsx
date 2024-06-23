import { useAppSelector } from "../../../../../app/hooks";
import { useDeleteUserInLibraryMutation, useGetAllLibraryCardQuery, useLazyGetAllLibraryCardQuery } from "../../../../../app/services/libraryApi";
import { useLazyCurrentQuery } from "../../../../../app/services/userApi";
import { Loader } from "../../../../../components/loader";
import { SVG } from "../../../../../components/svg";
import { BASE_STATIC } from "../../../../../constants";
import { selectUserId } from "../../../../../features/user/userSlice";
import { hasErrorField } from "../../../../../utils/hasErrorField";
import { hasSuccessField } from "../../../../../utils/hasSuccessField";
import { showMessage } from "../../../../../utils/showMessage";
import styles from "./index.module.css";

export const LibraryUsers = () => {

    const { data, isLoading, isError } = useGetAllLibraryCardQuery();
    const [triggerGetAllLibraryCard] = useLazyGetAllLibraryCardQuery();

    const [triggerGetCurrentQuery] = useLazyCurrentQuery();

    const [triggerDeleteUserInLibrary] = useDeleteUserInLibraryMutation();

    const userId = useAppSelector(selectUserId);

    const handleDeleteUserInLibrary = async (id: string) => {
        try {
            const result = await triggerDeleteUserInLibrary(id).unwrap();
            if (hasSuccessField(result)) {
                showMessage({ message: result.message, variantMessage: "success" });
            }
            if(id === userId) {
                await triggerGetCurrentQuery().unwrap();
            }
            await triggerGetAllLibraryCard().unwrap();

        } catch (error) {
            if (hasErrorField(error)) {
                showMessage({ message: error.data.error, variantMessage: "error" })
            }
        }
    }

    return (
        <div className={styles.libraryUsers}>
            {isLoading && !isError &&
                <div className={styles.loader__wrapper}><Loader /></div>
            }
            {!isLoading && isError &&
                <div className={styles.error__content}>
                    <SVG id="error-icon" />
                    <p>Произошла ошибка</p>
                </div>
            }
            {!isLoading && !isError && !data?.length &&
                <div className={styles.data__empty}>
                    <SVG id="empty-icon" />
                    Пользователей пока не добавили
                </div>
            }
            {!isLoading && !isError && data &&
                <ul className={styles.library__cards}>
                    {data.map(libraryCard => (
                        <li className={styles.library__card}>
                            <div className={styles.library__card_info}>
                                <div className={styles.user__image}>
                                    <img src={`${BASE_STATIC}/user-avatars/${libraryCard.user.avatarURL}`} alt="" />
                                </div>
                                <div className={styles.libraryCard__info}>
                                    <div className={styles.libraryCard__main_info}>
                                        <h2>{libraryCard.user.surname} {libraryCard.user.userName} {libraryCard.user.patronymic}</h2>
                                        <p><span>Должность: </span> {libraryCard.user.position}</p>
                                        <p><span>Номер читательского билета:</span> {libraryCard.cardNumber}</p>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.actions__library}>
                                <button onClick={() => handleDeleteUserInLibrary(libraryCard.userId)} className={styles.btnDeleteUserInLibrary}>
                                    <SVG id="delete-icon" />
                                    <p>Исключить сотрудника</p>
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            }
        </div>
    )
}
