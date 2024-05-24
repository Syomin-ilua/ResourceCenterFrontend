import styles from "./index.module.css";
import { memo, useCallback, useEffect, useState, type FC } from "react";
import type { DayOption } from "../eventForm";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { timeValidator } from "../../utils/timeValidator";

type Props = {
    schedules?: Schedule[]
    isEditing: boolean
    removeSchedule: (index: number) => void
    addSchedule: (data: Schedule) => void
    setShowEdditingDay: () => void
    setHideEdditingDay: () => void
}

type Schedule = {
    dayOfWeekId: string;
    startTime: string;
    endTime: string;
};

const dayOptions: DayOption[] = [
    { id: 1, name: 'Понедельник' },
    { id: 2, name: 'Вторник' },
    { id: 3, name: 'Среда' },
    { id: 4, name: 'Четверг' },
    { id: 5, name: 'Пятница' },
    { id: 6, name: 'Суббота' },
    { id: 7, name: 'Воскресенье' }
];

const scheduleSchema = yup.object().shape({
    dayOfWeekId: yup.string().required('День недели обязателен'),
    startTime: timeValidator.required('Время начала меропрития обязательно к заполению'),
    endTime: timeValidator.required('Время конца меропрития обязательно к заполению'),
});


export const SchedulesForm: FC<Props> = memo(({ schedules = [], removeSchedule, isEditing = false, addSchedule, setHideEdditingDay, setShowEdditingDay }) => {

    const [availableDays, setAvailableDays] = useState<DayOption[]>(dayOptions);

    const { handleSubmit: handleInnerSubmit, register, reset, formState: { errors } } = useForm<Schedule>({
        defaultValues: {
            dayOfWeekId: "",
            startTime: "",
            endTime: ""
        },
        mode: "onChange",
        resolver: yupResolver(scheduleSchema)
    });

    const onSubmit = (data: Schedule) => {
        addSchedule(data);
        reset();
    }

    const handleRemoveSchedule = (index: number) => {
        const removedDayId = schedules[index].dayOfWeekId;
        if (removedDayId) {
            const removedDay = dayOptions.find(day => day.id === parseInt(removedDayId));
            setAvailableDays([...availableDays, removedDay!].sort((a, b) => a.id - b.id));
        }
        removeSchedule(index);
    }

    const changeAvailableDays = useCallback(() => {
        if (schedules.length !== 0) {
            const schedulesSet = new Set(schedules.map((schedule) => schedule.dayOfWeekId));
            const filteredAvailableDays = availableDays.filter(availableDay => !schedulesSet.has(String(availableDay.id)));
            setAvailableDays(filteredAvailableDays);
        }
    }, [schedules]);

    useEffect(() => {
        changeAvailableDays();
    }, [schedules]);

    const handleAddNewDay = () => {
        setShowEdditingDay();
    }

    return (
        <form className={styles.schedule}>
            <h1 className={styles.shedule__title}>Расписание:</h1>
            {schedules.map((schedule, index) => (
                <div className={styles.schedule__day_wrapper} key={index}>
                    <div className={styles.schedule__day_wrapper_info}>
                        <p><span>День недели: </span> {dayOptions.find(day => day.id === parseInt(schedule.dayOfWeekId))?.name}</p>
                        <p><span>Начало меропрития: </span> {schedule.startTime}</p>
                        <p><span>Конец меропрития:</span> {schedule.endTime}</p>
                    </div>
                    <button className={styles.deleteDayShedule} type="button" onClick={() => handleRemoveSchedule(index)}>Удалить день</button>
                </div>
            ))}
            {isEditing ? (
                <div className={styles.edit__shedule_day}>
                    <div className={styles.day__select_wrapper}>
                        <label className={styles.day__select_label}>
                            <p>День недели: </p>
                            <select
                                {...register("dayOfWeekId")}
                                className={styles.selectDay}
                            >
                                <option value="" disabled>Выберите день недели</option>
                                {availableDays.map(day => (
                                    <option key={day.id} value={day.id}>{day.name}</option>
                                ))}
                            </select>
                        </label>
                    </div>
                    <div>
                        <label className={styles.timeEvent}>
                            <p>Начало меропрития:</p>
                            <input
                                type="text"
                                {...register("startTime")}
                                className={styles.timeSelect}
                                placeholder="Введите время"
                            />
                        </label>
                    </div>
                    <div>
                        <label className={styles.timeEvent}>
                            <p>Конец меропрития:</p>
                            <input
                                type="text"
                                {...register("endTime")}
                                className={styles.timeSelect}
                                placeholder="Введите время"
                            />
                        </label>
                    </div>
                    <button type="button" onClick={handleInnerSubmit(onSubmit)} className={styles.addNewDayShedule}>Добавить день</button>
                    <button className={styles.addNewDayShedule} type="button" onClick={setHideEdditingDay}>Убрать новый день</button>
                </div>
            ) : (
                <button className={styles.addNewDayShedule} type="button" onClick={handleAddNewDay}>Добавить новый день</button>
            )}
        </form>
    )
})