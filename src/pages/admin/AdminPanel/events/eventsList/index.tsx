import { Link } from "react-router-dom";
import { useDeleteEventMutation, useGetAllEventQuery, useLazyGetAllEventQuery } from "../../../../../app/services/eventsApi";
import { Loader } from "../../../../../components/loader";
import { SVG } from "../../../../../components/svg";
import styles from "./index.module.css";
import { useState } from "react";
import { Modal } from "../../../../../components/modal";
import { UsersEvent } from "../../../../../components/usersEvent";
import { hasErrorField } from "../../../../../utils/hasErrorField";
import { showMessage } from "../../../../../utils/showMessage";
import type { Event, Participation, Schedule } from "../../../../../app/types";
import { hasSuccessField } from "../../../../../utils/hasSuccessField";
import { EventForm } from "../../../../../components/eventForm";
import { Schedules } from "../../../../../components/schedules";

export const EventsList = () => {

    const { data, isError, isLoading } = useGetAllEventQuery();
    const [triggerGetAllEventQuery] = useLazyGetAllEventQuery();

    const [deleteEvent] = useDeleteEventMutation();

    const [isShowUsersEvent, setIsShowUsersEvent] = useState(false);
    const [participationsEventIdx, setParticipationsEventIdx] = useState<number>(0);

    const [isShowUpdateEvent, setIsShowUpdateEvent] = useState(false);
    const [updateEvent, setUpdateEvent] = useState<Event | null>(null);

    const [isShowSchedulesEvent, setIsShowSchedulesEvent] = useState(false);
    const [schedules, setSchedules] = useState<Schedule[] | null>([]);

    const getAllEvents = async () => {
        try {
            await triggerGetAllEventQuery().unwrap();
        } catch (error) {
            if (hasErrorField(error)) {
                showMessage({ message: error.data.error, variantMessage: "error" })
            }
        }
    }

    const handleDeleteEvent = async (id: number) => {
        try {
            const result = await deleteEvent(String(id)).unwrap();
            if (hasSuccessField(result)) {
                showMessage({ message: result.message, variantMessage: "success" })
            }
            getAllEvents();
        } catch (error) {
            if (hasErrorField(error)) {
                showMessage({ message: error.data.error, variantMessage: "error" })
            }
        }
    }

    const handleShowModalEventUpdate = (event: Event) => {
        setUpdateEvent(event);
        setIsShowUpdateEvent(true);
    }

    const handleCloseModalUpdateEvent = () => {
        setIsShowUpdateEvent(false);
        setUpdateEvent(null);
    }

    const handleShowModalSchedulesEvent = (schedules: Schedule[]) => {
        setSchedules(schedules);
        setIsShowSchedulesEvent(true);
    }

    const handleCloseModalSchedulesEvent = () => {
        setSchedules(null);
        setIsShowSchedulesEvent(false);
    }

    const handleShowModalParticipationsEvent = (idx: number) => {
        setParticipationsEventIdx(idx);
        setIsShowUsersEvent(true);
    }

    const handleCloseModalParticipationsEvent = () => {
        setIsShowUsersEvent(false);
    }


    return (
        <>
            <div className={styles.eventsList}>
                {isLoading && !isError &&
                    <div className={styles.loader__wrapper}><Loader /></div>
                }
                {!isLoading && isError &&
                    <div className={styles.error__content}>
                        <SVG id="error-icon" />
                        <p>Произошла ошибка</p>
                    </div>
                }
                {!isLoading && !isError && !data?.length ?
                    <div className={styles.data__empty}>
                        <SVG id="empty-icon" />
                        Эл. книги пока не добавили
                    </div> :
                    <ul className={styles.users__list}>
                        {data?.map((eventData, index) => (
                            <li className={styles.book__item}>
                                <div className={styles.bookInfo}>
                                    <div className={styles.book__image}>
                                        <img src={`http://localhost:3000/uploads/event-images/${eventData.eventPicture}`} alt="" />
                                    </div>
                                    <div className={styles.book__info}>
                                        <div className={styles.book__main_info}>
                                            <h2>{eventData.name}</h2>
                                            <p className={styles.description}>{eventData.description}</p>
                                            <p><span>Местоположение: </span> {eventData.eventLocation}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.actions__book}>
                                    <button onClick={() => handleDeleteEvent(eventData.id)} className={styles.btn__delete_book}>
                                        <SVG id="delete-icon" />
                                    </button>
                                    <button onClick={() => handleShowModalParticipationsEvent(index)} className={styles.btn__users_event}>
                                        <SVG id="user-icon" />
                                    </button>
                                    <button onClick={() => handleShowModalEventUpdate(eventData)} className={styles.btn__edit_event}>
                                        <SVG id="register-icon" />
                                    </button>
                                    <button onClick={() => handleShowModalSchedulesEvent(eventData.schedules)} className={styles.btn__edit_event}>
                                        <SVG id="events-icon" />
                                    </button>
                                </div>
                            </li>
                        ))}
                        <Modal isVisible={isShowUsersEvent} className="users__event" onClose={handleCloseModalParticipationsEvent}>
                            {isShowUsersEvent && <UsersEvent getAllEvents={getAllEvents} participations={data![participationsEventIdx].participations} />}
                        </Modal>
                        <Modal isVisible={isShowUpdateEvent} className="update__event" onClose={handleCloseModalUpdateEvent}>
                            {updateEvent && <EventForm onCloseModal={handleCloseModalUpdateEvent} typeForm="updateEvent" schedules={updateEvent.schedules.map(schedule => ({ ...schedule, dayOfWeekId: String(schedule.dayOfWeekId) }))} eventData={{
                                id: updateEvent.id,
                                name: updateEvent.name,
                                description: updateEvent.description,
                                eventLocation: updateEvent.eventLocation
                            }} />}
                        </Modal>
                        <Modal className="schedules__modal" isVisible={isShowSchedulesEvent} onClose={handleCloseModalSchedulesEvent}>
                            {schedules && <Schedules schedules={schedules} onClose={handleCloseModalSchedulesEvent} />}
                        </Modal>
                    </ul>
                }
            </div>
        </>
    )
}