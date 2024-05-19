import { useRef, useState, type FC } from 'react';
import styles from "./index.module.css";
import { Container } from '../../../../../components/container';
import { showMessage } from '../../../../../utils/showMessage';
import { SVG } from '../../../../../components/svg';
import { Questions } from '../../../../../components/questions';
import { hasErrorField } from '../../../../../utils/hasErrorField';
import { useCreateCourseMutation } from '../../../../../app/services/coursesApi';
import { useNavigate } from 'react-router-dom';

const allowedTypesImage = ["image/jpeg", "image/png", "image/webp"];
const allowedTypesFile = ["application/pdf"];

export const CreateCourse: FC = () => {

    const navigate = useNavigate();

    const [createCourse] = useCreateCourseMutation();

    const [nameCourse, setNameCourse] = useState("");

    const inputFileRef = useRef<HTMLInputElement>(null!);
    const [userImage, setUserImage] = useState<File | null>(null);
    const [imageURL, setImageURL] = useState<any>();

    const inputPdfRef = useRef<HTMLInputElement>(null!);
    const [pdfFile, setPdfFile] = useState<File | null>();

    const [questions, setQuestions] = useState<any>([]);
    const [currentQuestion, setCurrentQuestion] = useState('');
    const [currentAnswers, setCurrentAnswers] = useState<any>([]);
    const [correctAnswer, setCorrectAnswer] = useState("");

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

    const handleAddQuestion = () => {
        setQuestions([...questions, { question: currentQuestion, answers: currentAnswers, correctAnswer: correctAnswer }]);
        setCurrentQuestion("");
        setCurrentAnswers([]);
        setCorrectAnswer("");
        setCurrentQuestion("");
    }

    const handleAddAnswer = () => {
        setCurrentAnswers([...currentAnswers, '']);
    }

    const handleCorrectAnswerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCorrectAnswer(e.target.value);
    }

    const handleAnswerChange = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
        const updatedAnswers = [...currentAnswers];
        updatedAnswers[idx] = e.target.value;
        setCurrentAnswers(updatedAnswers);
    }

    const handleCreateCourse = async () => {
        try {
            const formData = new FormData();

            if (!userImage) {
                showMessage({ message: "Загрузите изображение курса", variantMessage: "warning" });
                return;
            }

            if (!pdfFile) {
                showMessage({ message: "Загрузите теоретические материалы для курса", variantMessage: "warning" });
                return;
            }

            if (!questions.length) {
                showMessage({ message: "Добавьте тестирование для курса", variantMessage: "warning" });
                return;
            }

            formData.append("nameCourse", nameCourse);
            formData.append("questions", JSON.stringify(questions));
            formData.append("imageCourse", userImage);
            formData.append("courseMaterialFile", pdfFile);

            await createCourse(formData).unwrap();

            showMessage({ message: "Курс успешно создан", variantMessage: "success" });
            navigate("/courses");

        } catch (error) {
            if (hasErrorField(error)) {
                showMessage({ message: error.data.error, variantMessage: "error" })
            }
        }
    }


    return (
        <div className={styles.create__course}>
            <div className={styles.wrapper}>
                <div className={styles.create__course_form}>
                    <div className={styles.course__contructor}>
                        <div className={styles.course__title_wrapper}>
                            <SVG id='admin-icon' />
                            Создание курса
                        </div>
                        <div className={styles.create__course_form_control}>
                            <label htmlFor='nameCourse' className={styles.input__question_wrapper}>
                                <p className={styles.input__title}>Название курса:</p>
                                <input className={styles.input} value={nameCourse} onChange={(e) => setNameCourse(e.target.value)} id='nameCourse' type="text" />
                            </label>
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
                        <div className={styles.course__test_questions}>
                            <div className={styles.course__test_title}>
                                <p>Создание теста</p>
                            </div>
                            <label htmlFor='nameQuestion' className={styles.input__question_wrapper}>
                                <p className={styles.input__title}>Вопрос:</p>
                                <input className={styles.input} onChange={(e) => setCurrentQuestion(e.target.value)} id='nameQuestion' type="text" />
                            </label>
                            <div className={styles.inputs__answers_wrapper}>
                                <p className={styles.input__title}>Варианты ответов:</p>
                                <div className={styles.inputs__answers}>
                                    {currentAnswers.map((answer: string, idx: number) => (
                                        <label className={styles.input__answer_wrapper} htmlFor={`${idx}`}>
                                            <input className={styles.input} type="text" id={`${idx}`} value={answer} onChange={(e) => handleAnswerChange(e, idx)} />
                                        </label>
                                    ))}
                                </div>
                                <button type='button' onClick={handleAddAnswer} className={styles.add__answer}>
                                    <SVG id='add-icon' />
                                    Добавить вариант ответа
                                </button>
                            </div>
                            <label htmlFor='correctAnswer' className={styles.inputs__correctAnswer_wrapper}>
                                <p className={styles.input__title}>Правильный ответ:</p>
                                <input value={correctAnswer} onChange={handleCorrectAnswerChange} className={styles.input} type="text" id='correctAnswer' />
                                <button type='button' onClick={handleAddQuestion} className={styles.add__quiestion}>
                                    <SVG id='add-icon' />
                                    Добавить вопрос
                                </button>
                            </label>
                        </div>
                    </div>
                    <Questions questions={questions} />
                </div>
                <div onClick={handleCreateCourse} className={styles.create__course_btn_wrapper}>
                    <button className={styles.create__course_btn}>
                        <SVG id='success-icon' />
                        Создать курс
                    </button>
                </div>
            </div>
        </div>
    )
}