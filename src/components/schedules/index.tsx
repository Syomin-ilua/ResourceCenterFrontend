import type { Schedule } from "../../app/types";
import { SVG } from "../svg";
import styles from "./index.module.css";
import type { FC } from "react";

type Props = {
    schedules: Schedule[]
    onClose: () => void
}

export const Schedules: FC<Props> = ({ schedules, onClose }) => {


    console.log(schedules);


    return (
        <div className={styles.schedules}>
            <h1 className={styles.title}>
                <SVG id="events-icon"/>
                Расписание меропрития
            </h1>
            <div className={styles.schedules__wrapper}>
                {schedules.map(schedule => (
                    <div className={styles.schedule}>
                        <h2 className={styles.schedule__day}><span>День недели: </span>{schedule.dayOfWeek.name}</h2>
                        <p><span>Начало меропрития: </span>{schedule.startTime}</p>
                        <p><span>Конец меропрития: </span>{schedule.endTime}</p>
                    </div>
                ))}
            </div>
            <button onClick={onClose} className={styles.btnCloseModalSchedules}>Закрыть расписание</button>
        </div>
    )
}
