import { useState } from "react";
import styles from "./index.module.css";
import classNames from "classnames";
import { EventsList } from "./eventsList";
import { EventForm } from "../../../../components/eventForm";

export const Events = () => {

    const [selectFunction, setSelectFunction] = useState<"addEvent" | "eventsList">("eventsList");

    return (
        <div className={styles.events__container}>
            <div className={styles.events__actions}>
                <button onClick={() => setSelectFunction("addEvent")} className={classNames(styles.btnSelect, selectFunction === "addEvent" && styles.btnSelect__active)}>Добавить мероприятие</button>
                <button onClick={() => setSelectFunction("eventsList")} className={classNames(styles.btnSelect, selectFunction === "eventsList" && styles.btnSelect__active)}>Все мероприятия</button>
            </div>
            {selectFunction === "addEvent" && <EventForm typeForm="addEvent" />}
            {selectFunction === "eventsList" && <EventsList />}
        </div>
    )
}