import type { Participation } from "../../app/types"
import type { FC } from "react"
import styles from "./index.module.css";
import { SVG } from "../svg";
import { hasErrorField } from "../../utils/hasErrorField";
import { showMessage } from "../../utils/showMessage";
import { useDeleteUserInEventMutation } from "../../app/services/eventsApi";
import { hasSuccessField } from "../../utils/hasSuccessField";
import { useAppSelector } from "../../app/hooks";
import { selectCurrent } from "../../features/user/userSlice";

type Props = {
    participations: Participation[]
    getAllEvents: () => void
}

export const UsersEvent: FC<Props> = ({ participations = [], getAllEvents }) => {

    const [deleteUserInEvent] = useDeleteUserInEventMutation();

    const userData = useAppSelector(selectCurrent);

    const handleDeleteUserEvent = async (id: number) => {
        try {
            const result = await deleteUserInEvent(id).unwrap();
            if (hasSuccessField(result)) {
                showMessage({ message: result.message, variantMessage: "success" });
            }
            getAllEvents();
        } catch (error) {
            if (hasErrorField(error)) {
                showMessage({ message: error.data.error, variantMessage: "error" });
            }
        }
    }

    return (
        <div className={styles.users}>
            <h1 className={styles.title}>
                <SVG id="user-icon" />
                Участники меропрития
            </h1>
            {!participations.length ?
                <div className={styles.participations__empty}>
                    <SVG id="empty-icon" />
                    Учасников нету
                </div>
                :
                <div className={styles.participations}>
                    {participations.map(participation => (
                        <li className={styles.user__item}>
                            <div className={styles.userInfo}>
                                <div className={styles.user__avatar}>
                                    <img src={`http://localhost:3000/uploads/user-avatars/${participation.user.avatarURL}`} alt="" />
                                </div>
                                <div className={styles.user__info}>
                                    <div className={styles.user__main_info}>
                                        <h2>{participation.user.surname} {participation.user.userName} {participation.user.patronymic}</h2>
                                        <p className={styles.position}>Должность: {participation.user.position}</p>
                                    </div>
                                    <div className={styles.outher__info}>
                                        <p className={styles.contacts__info}><span>Эл. почта: </span>{participation.user.email}</p>
                                        <p className={styles.contacts__info}><span>Номер телефона: </span>{participation.user.tel}</p>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.actions__user}>
                                <button onClick={() => handleDeleteUserEvent(participation.id)} className={styles.btn__delete_user}>
                                    <SVG id="delete-icon" />
                                </button>
                            </div>
                        </li>
                    ))}
                </div>
            }
        </div>
    )
}
