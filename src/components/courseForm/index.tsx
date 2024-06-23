import { useEffect, useRef, useState, type FC } from "react"
import { type Question, type Course } from "../../app/types"
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { showMessage } from "../../utils/showMessage";
import { SVG } from "../svg";
import styles from "./index.module.css"
import { Input } from "../input";
import { hasErrorField } from "../../utils/hasErrorField";
import { QuestionsForm } from "../questionsForm";
import { useCreateCourseMutation, useLazyGetCoursesQuery, useUpdateCourseMutation } from "../../app/services/coursesApi";
import { hasSuccessField } from "../../utils/hasSuccessField";
import { arraysAreEqual } from "../../utils/arraysAreEqual";
import classNames from "classnames";

type Props = {
    typeForm: "createCourse" | "updateCourse",
    course?: Course,
    onCloseModal?: () => void
}

type MainInfoCourse = Pick<Course, "courseName" | "courseDescription">

const allowedTypesImage = ["image/jpeg", "image/png", "image/webp"];
const allowedTypesFile = ["application/pdf"];

const courseSchema = yup.object({
    courseName: yup.string().required("Заполните обязательное поле").matches(/[а-яА-ЯёЁ]+/, "Вводить можно только русские буквы"),
    courseDescription: yup.string().required("Заполните обязательное поле").matches(/[а-яА-ЯёЁ]+/, "Вводить можно только русские буквы"),
})

export const CourseForm: FC<Props> = ({ typeForm, course = { id: "", courseName: "", courseDescription: "", courseImage: "", theoreticalMaterials: "", questions: [] }, onCloseModal = () => {} }) => {

    const { handleSubmit, reset, formState: { errors }, register } = useForm<MainInfoCourse>({
        defaultValues: {
            courseName: course.courseName,
            courseDescription: course.courseDescription
        },
        mode: "onChange",
        resolver: yupResolver(courseSchema)
    });

    const inputFileRef = useRef<HTMLInputElement>(null!);
    const [userImage, setUserImage] = useState<File | null>(null);
    const [imageURL, setImageURL] = useState<any>();

    const inputPdfRef = useRef<HTMLInputElement>(null!);
    const [pdfFile, setPdfFile] = useState<File | null>();

    const [questionsData, setQuestionsData] = useState<Question[]>(course.questions);

    const [addCourse] = useCreateCourseMutation();
    const [editCourse] = useUpdateCourseMutation();
    const [triggerGetAllCourses] = useLazyGetCoursesQuery();

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
            setUserImage(event.target.files[0]);
            reader.onload = (e: ProgressEvent<FileReader>) => {
                setImageURL(e.target?.result);
            }
            reader.readAsDataURL(event.target.files[0]);
        }
    }

    const removeFile = () => {
        setUserImage(null);
    }

    const onChoisePdf = () => {
        inputPdfRef.current.click();
    }

    const handleAddPdf = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();

        if (event.target.files && event.target.files.length > 0) {
            if (!allowedTypesFile.includes(event.target.files[0].type) || event.target.files[0].size / (1024 * 1024) > 10) {
                showMessage({ message: "Загружать можно только файлы с расширением pdf и не больше 10мб", variantMessage: "warning" });
                return;
            }
            setPdfFile(event.target.files[0]);
        }
    }

    const removePdfFile = () => {
        setPdfFile(null);
    }

    const onSubmit = async (data: MainInfoCourse) => {
        switch (typeForm) {
            case "createCourse": {
                createCourse(data);
                break;
            }
            case "updateCourse": {
                updateCourse(data);
                break
            }
        }
    }

    const createCourse = async (data: MainInfoCourse) => {
        try {
            const formData = new FormData();

            if (questionsData.length === 0) {
                showMessage({ message: "Курс должен содержать в себе некое тестирование, добавьте вопросы", variantMessage: "warning" })
                return;
            }

            if (!userImage) {
                showMessage({ message: "Загрузите изображение курса", variantMessage: "warning" });
                return;
            }

            if (!pdfFile) {
                showMessage({ message: "Загрузите теоретические материалы для курса", variantMessage: "warning" });
                return;
            }

            formData.append("nameCourse", data.courseName);
            formData.append("descriptionCourse", data.courseDescription);
            formData.append("questions", JSON.stringify(questionsData));
            formData.append("imageCourse", userImage);
            formData.append("courseMaterialFile", pdfFile);

            const result = await addCourse(formData).unwrap();

            if (hasSuccessField(result)) {
                showMessage({ message: "Курс успешно создан", variantMessage: "success" });
            }

            reset();
            setQuestionsData([]);
            setUserImage(null);
            setImageURL(null);
            setPdfFile(null);

        } catch (error) {
            if (hasErrorField(error)) {
                showMessage({ message: error.data.error, variantMessage: "error" })
            }
        }
    }

    const updateCourse = async (data: MainInfoCourse) => {
        try {

            if (questionsData.length === 0) {
                showMessage({ message: "Курс должен содержать в себе некое тестирование, добавьте вопросы", variantMessage: "warning" })
                return;
            }

            const formData = new FormData();

            course.courseName !== data.courseName && formData.append("nameCourse", data.courseName);
            course.courseDescription !== data.courseDescription && formData.append("descriptionCourse", data.courseDescription);
            !arraysAreEqual(course.questions, questionsData) && formData.append("questions", JSON.stringify(questionsData));
            userImage && formData.append("imageCourse", userImage);
            pdfFile && formData.append("courseMaterialFile", pdfFile);

            const result = await editCourse({ courseId: course.id, courseData: formData }).unwrap();

            if (hasSuccessField(result)) {
                showMessage({ message: "Курс успешно обновлён", variantMessage: "success" });
            }

            await triggerGetAllCourses({}).unwrap();
            onCloseModal();

        } catch (error) {
            if (hasErrorField(error)) {
                showMessage({ message: error.data.error, variantMessage: "error" })
            }
        }
    }

    const handleAddQuestion = (data: Question) => {
        setQuestionsData([...questionsData, data]);
    }

    const deleteQuestion = (idx: number) => {
        const newQuestions = questionsData.filter((_, index) => idx !== index);
        setQuestionsData(newQuestions);
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={styles.create__course}>
            <div className={styles.wrapper}>
                <div className={styles.create__course_form}>
                    <div className={styles.course__contructor}>
                        <div className={styles.course__title_wrapper}>
                            <SVG id='admin-icon' />
                            {typeForm === "createCourse" ? "Создание курса" : "Редактирование курса"}
                        </div>
                        <div className={styles.create__course_form_control}>
                            <Input
                                type="text"
                                error={!!errors.courseName}
                                errorText={errors?.courseName?.message}
                                name="courseName"
                                id="courseName"
                                title="Название курса"
                                register={register("courseName")}
                            />
                            <div className={styles.textarea__wrapper}>
                                <label className={classNames(styles.textarea__label, errors.courseDescription && styles.error__textarea)} htmlFor="description">
                                    <p>Описание курса:</p>
                                    <textarea
                                        id="description"
                                        {...register("courseDescription")}
                                        className={styles.textarea}
                                    >
                                    </textarea>
                                </label>
                                {errors.courseDescription && <p className={styles.error__input_text}>{errors.courseDescription.message}</p>}
                            </div>
                            <div className={styles.input__file_wrapper}>
                                <div className={styles.input__file_title}>
                                    <p>Фото курса: </p>
                                </div>
                                <input ref={inputFileRef} onChange={handleAddFile} type="file" className={styles.inputFile} />
                                <div className={styles.file__wrapper}>
                                    <button type="button" onClick={onChoiseFile} className={styles.file__btn}>Выберите фото</button>
                                    {userImage ? <img className={styles.image__uploaded} src={imageURL} alt="Загруженное изображение" /> : <p>Изображение не выбрано</p>}
                                    {userImage && <button onClick={removeFile} className={styles.delete__file_btn}>
                                        <span></span>
                                        <span></span>
                                    </button>}
                                </div>
                            </div>
                            <div className={styles.input__file_wrapper}>
                                <div className={styles.input__file_title}>
                                    <p>Теоретические материалы<span>(можно загружать только pdf файл)</span>: </p>
                                </div>
                                <input ref={inputPdfRef} onChange={handleAddPdf} type="file" className={styles.inputFile} />
                                <div className={styles.file__wrapper}>
                                    <button type="button" onClick={onChoisePdf} className={styles.file__btn}>Выберите файл</button>
                                    {pdfFile ? <p>{pdfFile.name}</p> : <p>Файл не выбран</p>}
                                    {pdfFile && <button type='button' onClick={removePdfFile} className={styles.delete__file_btn}>
                                        <span></span>
                                        <span></span>
                                    </button>}
                                </div>
                            </div>
                        </div>
                        <QuestionsForm questions={questionsData} onAddQuestion={handleAddQuestion} deleteQuestion={deleteQuestion} />
                    </div>
                </div>
                <div className={styles.create__course_btn_wrapper}>
                    <button type="submit" className={styles.create__course_btn}>
                        <SVG id='success-icon' />
                        {typeForm === "createCourse" ? "Создать курс" : "Сохранить изменения"}
                    </button>
                </div>
            </div>
        </form>
    )
}