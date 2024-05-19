import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Input } from "../../../../../components/input";
import styles from "./index.module.css";
import { useAddBookMutation, type Book } from "../../../../../app/services/booksApi";
import { useRef, useState } from "react";
import { showMessage } from "../../../../../utils/showMessage";
import { hasErrorField } from "../../../../../utils/hasErrorField";
import classNames from "classnames";
import { SVG } from "../../../../../components/svg";

const bookShema = yup.object({
    nameBook: yup.string().required("Заполните обязательное поле").matches(/[а-яА-ЯёЁ]+/, "Вводить можно только русские буквы"),
    descriptionBook: yup.string().required("Заполните обязательное поле").matches(/[а-яА-ЯёЁ]+/, "Вводить можно только русские буквы")
});

const allowedTypesImage = ["image/jpeg", "image/png", "image/webp"];
const allowedTypesFile = ["application/pdf"];

export const AddBook = () => {

    const inputPdfRef = useRef<HTMLInputElement>(null!);
    const [pdfFile, setPdfFile] = useState<File | null>();

    const inputFileRef = useRef<HTMLInputElement>(null!);
    const [bookImage, setBookImage] = useState<File | null>(null);
    const [imageURL, setImageURL] = useState<any>();

    const { register, formState: { errors }, reset, handleSubmit } = useForm<Pick<Book, "nameBook" | "descriptionBook">>({
        defaultValues: {
            nameBook: "",
            descriptionBook: "",
        },
        resolver: yupResolver(bookShema),
        mode: "onSubmit"
    });

    const [addBook] = useAddBookMutation();

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
            setBookImage(event.target.files[0]);
            reader.onload = (e) => {
                setImageURL(e.target?.result);
            }
            reader.readAsDataURL(event.target.files[0]);
        }
    }

    const removeFile = () => {
        setBookImage(null);
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

    const onSubmit = async (data: Pick<Book, "nameBook" | "descriptionBook">) => {
        try {
            
            const formData = new FormData();

            if (!bookImage) {
                showMessage({ message: "Загрузите изображение книги", variantMessage: "warning" });
                return;
            }

            if (!pdfFile) {
                showMessage({ message: "Загрузите книгу в эл. формате", variantMessage: "warning" });
                return;
            }

            formData.append("nameBook", data.nameBook);
            formData.append("descriptionBook", data.descriptionBook);
            formData.append("bookPicture", bookImage);
            formData.append("bookFile", pdfFile);

            await addBook(formData).unwrap();

            showMessage({ message: "Книга успешно добавлена", variantMessage: "success" });
            reset();
            removePdfFile();
            removeFile();

        } catch (error) {
            if (hasErrorField(error)) {
                showMessage({ message: error.data.error, variantMessage: "error" })
            }
        }
    }


    return (
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form__add_book}>
            <div className={styles.add__book_title}>
                <SVG id="books-icon"/> 
                <h2>Добавить книгу</h2>
            </div>
            <div className={styles.form__inputs}>
                <Input
                    type="text"
                    error={!!errors.nameBook}
                    errorText={errors?.nameBook?.message}
                    name="nameBook"
                    id="NameBook"
                    title="Название книги"
                    register={register("nameBook")}
                    placeholder="Пожарная безопасность"
                />
                <div className={styles.textarea__wrapper}>
                    <label className={classNames(styles.textarea__label, errors.descriptionBook && styles.error__textarea)} htmlFor="DescriptionBook">
                        <p>Описание книги:</p>
                        <textarea
                            id="DescriptionBook"
                            placeholder="Описание книги"
                            {...register("descriptionBook")}
                            className={styles.textarea}
                        >

                        </textarea>
                    </label>
                    {errors.descriptionBook && <p className={styles.error__input_text}>{errors.descriptionBook.message}</p>}
                </div>
                <div className={styles.image__wrapper}>
                    <div className={styles.input__title_wrapper}>
                        <p className={styles.book__image_title}>Фото книги:</p>
                    </div>
                    <input ref={inputFileRef} onChange={handleAddFile} type="file" className={styles.inputFile} />
                    <div className={styles.file__wrapper}>
                        <button type="button" onClick={onChoiseFile} className={styles.file__btn}>Выберите фото</button>
                        {bookImage ? <img className={styles.image__uploaded} src={imageURL} alt="Загруженное изображение" /> : <p className={styles.empty__file_text}>Изображение не выбрано</p>}
                        {bookImage && <button onClick={removeFile} className={styles.delete__file_btn}>
                            <span></span>
                            <span></span>
                        </button>}
                    </div>
                </div>
                <div className={styles.input__file_wrapper}>
                    <div className={styles.input__file_title}>
                        <p>Книга в эл. формате<span>(можно загружать только pdf файл)</span>: </p>
                    </div>
                    <input ref={inputPdfRef} onChange={handleAddPdf} type="file" className={styles.inputFile} />
                    <div className={styles.file__wrapper}>
                        <button type="button" onClick={onChoisePdf} className={styles.file__btn}>Выберите файл</button>
                        {pdfFile ? <p>{pdfFile.name}</p> : <p className={styles.empty__file_text}>Файл не выбран</p>}
                        {pdfFile && <button type='button' onClick={removePdfFile} className={styles.delete__file_btn}>
                            <span></span>
                            <span></span>
                        </button>}
                    </div>
                </div>
                <button type="submit" className={styles.btn__add_book}>Добавить книгу</button>
            </div>
        </form >
    )
}
