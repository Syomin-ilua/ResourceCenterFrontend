import { useForm } from "react-hook-form";
import { hasErrorField } from "../../utils/hasErrorField";
import { showMessage } from "../../utils/showMessage";
import styles from "./index.module.css";
import { useRef, useState, type FC } from "react"
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { SVG } from "../svg";
import { Input } from "../input";
import classNames from "classnames";
import { hasSuccessField } from "../../utils/hasSuccessField";
import { SchedulesForm } from "../shedulesForm";
import { useCreateEventMutation, useLazyGetAllEventQuery, useUpdateEventMutation } from "../../app/services/eventsApi";
import { arraysAreEqual } from "../../utils/arraysAreEqual";

type Props = {
    typeForm: "addEvent" | "updateEvent"
    schedules?: Schedule[]
    eventData?: TEvent
    onCloseModal?: () => void
}

type TEvent = {
    id?: number
    name: string
    description: string
    eventLocation: string
}

const eventShema = yup.object({
    name: yup.string().required("Заполните обязательное поле").matches(/[а-яА-ЯёЁ]+/, "Вводить можно только русские буквы"),
    description: yup.string().required("Заполните обязательное поле").matches(/[а-яА-ЯёЁ]+/, "Вводить можно только русские буквы"),
    eventLocation: yup.string().required("Заполните обязательное поле").matches(/[а-яА-ЯёЁ]+/, "Вводить можно только русские буквы"),
});

export type DayOption = {
    id: number;
    name: string;
};

type Schedule = {
    dayOfWeekId: string;
    startTime: string;
    endTime: string;
};

const allowedTypesImage = ["image/jpeg", "image/png", "image/webp"];

export const EventForm: FC<Props> = ({ typeForm, schedules = [], eventData = { name: "", description: "", eventLocation: "" }, onCloseModal = () => { } }) => {

    const [createEvent] = useCreateEventMutation();
    const [updateEvent] = useUpdateEventMutation();

    const [triggerGetAllEvents] = useLazyGetAllEventQuery();

    const [schedulesData, setSchedules] = useState<Schedule[]>(schedules);
    const [isEditing, setIsEditing] = useState(false);

    const inputFileRef = useRef<HTMLInputElement>(null!);
    const [eventImage, setEventImage] = useState<File | null>(null);
    const [imageURL, setImageURL] = useState<any>();

    const { handleSubmit: outerHandleSubmit, register, formState: { errors }, reset } = useForm({
        defaultValues: {
            name: eventData.name,
            description: eventData.description,
            eventLocation: eventData.eventLocation
        },
        mode: "onChange",
        resolver: yupResolver(eventShema)
    });

    const onChoiseFile = () => {
        inputFileRef?.current.click();
    }

    const handleAddFile = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();

        const reader = new FileReader();

        if (event.target.files && event.target.files.length > 0) {
            if (!allowedTypesImage.includes(event.target.files[0].type) || event.target.files[0].size / (1024 * 1024) > 10) {
                showMessage({ message: "Можно загружать только изображения с типом jpeg, png, webp  и размером не больше 10мб", variantMessage: "warning" });
                return;
            }
            setEventImage(event.target.files[0]);
            reader.onload = (e) => {
                setImageURL(e.target?.result);
            }
            reader.readAsDataURL(event.target.files[0]);
        }
    }

    const removeFile = () => {
        setEventImage(null);
    }

    const onSubmit = async (data: TEvent) => {
        try {
            const formData = new FormData();

            let result;

            switch (typeForm) {
                case "addEvent": {
                    if (!eventImage) {
                        showMessage({ message: "Загрузите изображение меропрития", variantMessage: "warning" })
                        return;
                    }

                    if (schedulesData.length === 0) {
                        showMessage({ message: "Расписание мероприятия не должно быть пустым", variantMessage: "warning" })
                        return;
                    }

                    formData.append("name", data.name);
                    formData.append("description", data.description);
                    formData.append("eventLocation", data.eventLocation);
                    formData.append("eventPicture", eventImage);
                    formData.append("schedules", JSON.stringify(schedulesData));
                    result = await createEvent(formData).unwrap();
                    break;
                }
                case "updateEvent": {
                    data.name !== eventData.name && formData.append("name", data.name);
                    data.description !== eventData.description && formData.append("description", data.description);
                    data.eventLocation !== eventData.eventLocation && formData.append("eventLocation", data.eventLocation);
                    !arraysAreEqual(schedules, schedulesData) && formData.append("schedules", JSON.stringify(schedulesData));
                    result = await updateEvent({ updateEventData: formData, eventId: eventData.id! }).unwrap();
                    await triggerGetAllEvents().unwrap()
                    onCloseModal()
                    break;
                }
            }
            if (hasSuccessField(result)) {
                showMessage({ message: result.message, variantMessage: "success" })
            }

        } catch (error) {
            if (hasErrorField(error)) {
                showMessage({ message: error.data.error, variantMessage: "error" })
            }
        }
    }

    const handleAddSchedule = (data: Schedule) => {
        setSchedules([...schedulesData, data]);
        setIsEditing(false);
    }

    const handleRemoveSchedule = (index: number) => {
        const newSchedules = schedules.filter((_, sIndex) => index !== sIndex);
        setSchedules(newSchedules);
    }

    return (
        <>
            <form onSubmit={outerHandleSubmit(onSubmit)} className={styles.addEvent__form}>
                <h1 className={styles.addEventTitle}>
                    <SVG id="events-icon" />
                    {typeForm === "addEvent" ? "Создание меропрития" : "Редактирование меропрития"}
                </h1>
                <Input
                    type="text"
                    error={!!errors.name}
                    errorText={errors?.name?.message}
                    name="name"
                    id="Name"
                    title="Название мероприятия"
                    register={register("name")}
                    placeholder="Футбол"
                />
                <div className={styles.textarea__wrapper}>
                    <label className={classNames(styles.textarea__label, errors.description && styles.error__textarea)} htmlFor="description">
                        <p>Описание мероприятия:</p>
                        <textarea
                            id="description"
                            {...register("description")}
                            className={styles.textarea}
                        >
                        </textarea>
                    </label>
                    {errors.description && <p className={styles.error__input_text}>{errors.description.message}</p>}
                </div>
                <Input
                    type="text"
                    error={!!errors.eventLocation}
                    errorText={errors?.eventLocation?.message}
                    name="eventLocation"
                    id="EventLocation"
                    title="Местоположение(где будет проводиться мероприятие)"
                    register={register("eventLocation")}
                    placeholder="г. Воронеж, Ленинский проспект 29 д.4, стадион 1"
                />
                <div className={styles.image__wrapper}>
                    <div className={styles.input__title_wrapper}>
                        <p className={styles.book__image_title}>Фото мероприятия:</p>
                    </div>
                    <input ref={inputFileRef} onChange={handleAddFile} type="file" className={styles.inputFile} />
                    <div className={styles.file__wrapper}>
                        <button type="button" onClick={onChoiseFile} className={styles.file__btn}>Выберите фото</button>
                        {eventImage ? <img className={styles.image__uploaded} src={imageURL} alt="Загруженное изображение" /> : <p className={styles.empty__file_text}>Изображение не выбрано</p>}
                        {eventImage && <button onClick={removeFile} className={styles.delete__file_btn}>
                            <span></span>
                            <span></span>
                        </button>}
                    </div>
                </div>
                <SchedulesForm
                    setHideEdditingDay={() => setIsEditing(false)}
                    setShowEdditingDay={() => setIsEditing(true)}
                    isEditing={isEditing}
                    addSchedule={(data) => handleAddSchedule(data)}
                    schedules={schedulesData}
                    removeSchedule={(index) => handleRemoveSchedule(index)}
                />
                <button type="submit" className={styles.addEvent__btn}>{typeForm === "addEvent" ? "Добавить мероприятие" : "Сохранить изменения"}</button>
            </form>
        </>
    )
}