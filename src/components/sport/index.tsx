import { Link } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { useExitEventMutation, useGetAllEventQuery, useJoinEventMutation, useLazyGetAllEventQuery } from "../../app/services/eventsApi";
import { selectCurrent, selectIsAuthenticated } from "../../features/user/userSlice";
import { hasErrorField } from "../../utils/hasErrorField";
import { hasSuccessField } from "../../utils/hasSuccessField";
import { showMessage } from "../../utils/showMessage";
import { Loader } from "../loader";
import { SVG } from "../svg";
import styles from "./index.module.css";
import type { Participation } from "../../app/types";
import { useState } from "react";
import { Modal } from "../modal";
import { Schedules } from "../schedules";
import { BASE_STATIC } from "../../constants";


export const Sport = () => {

    const isAuth = useAppSelector(selectIsAuthenticated);

    const [isShowSchedules, setIsShowSchedules] = useState(false);
    const [idxSchedulesData, setIdxSchedulesData] = useState(0);

    const { data, isLoading, isError, error } = useGetAllEventQuery();

    const [joinEvent] = useJoinEventMutation();
    const [exitEvent] = useExitEventMutation();

    const [triggerGetAllEventQuery] = useLazyGetAllEventQuery();

    const userData = useAppSelector(selectCurrent);

    const handleExitEvent = async (id: number) => {
        try {
            const result = await exitEvent(id).unwrap();
            if (hasSuccessField(result)) {
                showMessage({ message: result.message, variantMessage: "success" });
            }
            await triggerGetAllEventQuery().unwrap();

        } catch (error) {
            if (hasErrorField(error)) {
                showMessage({ message: error.data.error, variantMessage: "error" });
            }
        }
    }

    const handleJoinEvent = async (id: number) => {

        if (!isAuth) {
            showMessage({ message: "Авторизутесь", variantMessage: "warning" });
            return;
        }

        try {
            const result = await joinEvent(id).unwrap();
            if (hasSuccessField(result)) {
                showMessage({ message: result.message, variantMessage: "success" });
            }
            await triggerGetAllEventQuery().unwrap();
        } catch (error) {
            if (hasErrorField(error)) {
                showMessage({ message: error.data.error, variantMessage: "error" });
            }
        }
    }

    const getParticipation = (participations: Participation[]): number => {
        const participation = participations.find(user => user.userId === userData?.id);
        return participation!.id;
    }

    const handleShowSchedules = (idx: number) => {
        setIdxSchedulesData(idx);
        setIsShowSchedules(true);
    }

    return (
        <>
            <div className={styles.sport}>
                <h1 className={styles.title}>
                    <SVG id="sport-icon" />
                    Культурно досуговый центр
                </h1>
                <p className={styles.subtitle}>Здесь будут выложены мероприятия которые организует предприятие для отдыха и развлечения наших сотрудников.</p>
                <div className={styles.events}>
                    {isLoading && !isError &&
                        <div className={styles.loader__wrapper}>
                            <Loader />
                        </div>
                    }
                    {!isLoading && isError && error &&
                        <div className={styles.error__data}>
                            <SVG id='error-icon' />
                            Произошла ошибка, попробуйте позже
                        </div>
                    }
                    {(!isLoading && !isError && data?.length === 0) ?
                        <div className={styles.empty__data}>
                            <SVG id='empty-icon' />
                            Мероприятий пока не назначено
                        </div> :
                        <div className={styles.eventsWrapper}>
                            {data?.map((eventData, idx) => (
                                <>
                                    <div className={styles.event}>
                                        <div className={styles.eventPicture}>
                                            <img src={`${BASE_STATIC}/event-images/${eventData.eventPicture}`} alt="" />
                                        </div>
                                        <div className={styles.eventInfo}>
                                            <div className={styles.main_info}>
                                                <h2 className={styles.eventName}>{eventData.name}</h2>
                                                <p className={styles.description}>{eventData.description}</p>
                                                <p className={styles.location}><span>Местоположение: </span>{eventData.eventLocation}</p>
                                            </div>
                                            <div className={styles.eventActions}>
                                                {

                                                    data[idx].participations.find(user => user.userId === userData?.id) ?
                                                        (<button onClick={() => handleExitEvent(getParticipation(data[idx].participations!))} className={styles.exitEventBtn}>Выйти</button>) :
                                                        (<button onClick={() => handleJoinEvent(data[idx].id)} className={styles.joinEventBtn}>Записаться</button>)
                                                }
                                                <button onClick={() => handleShowSchedules(idx)} className={styles.link}>
                                                    <SVG id="events-icon" />
                                                    Узнать расписание
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ))}
                            <Modal className="schedules__modal" isVisible={isShowSchedules} onClose={() => setIsShowSchedules(false)}>
                                {isShowSchedules &&
                                    <Schedules onClose={() => setIsShowSchedules(false)} schedules={data![idxSchedulesData].schedules} />
                                }
                            </Modal>
                        </div>
                    }
                </div>
            </div>
        </>
    )
}
