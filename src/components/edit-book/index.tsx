import { useRef, useState, type FC } from "react"
import { useEditBookMutation } from "../../app/services/booksApi"
import styles from "./index.module.css";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { showMessage } from "../../utils/showMessage";
import { hasErrorField } from "../../utils/hasErrorField";
import * as yup from "yup";
import classNames from "classnames";
import { Input } from "../input";
import { SVG } from "../svg";
import type { Book as BookType } from "../../app/types";
import Select from "react-select"

type Props = {
    book: Required<BookType> | null,
    onCloseModal: () => void,
}

type Book = {
    nameBook: string
    descriptionBook: string
    categoryBook: {
        value: string
        label: string
    }
}

const options = [
    { value: "technical", label: "Технические" },
    { value: "artistic", label: "Художественные" },
    { value: "magazines", label: "Журналы" }
];

const bookShema = yup.object({
    nameBook: yup.string().required("Заполните обязательное поле").matches(/[а-яА-ЯёЁ]+/, "Вводить можно только русские буквы"),
    descriptionBook: yup.string().required("Заполните обязательное поле").matches(/[а-яА-ЯёЁ]+/, "Вводить можно только русские буквы"),
    categoryBook: yup.object().shape({
        value: yup.string().required("Выбор категории обязателен"),
        label: yup.string().required(),
    }).required('Выбор категории обязателен')
});

const allowedTypesImage = ["image/jpeg", "image/png", "image/webp"];
const allowedTypesFile = ["application/pdf"];

export const EditBook: FC<Props> = ({ book, onCloseModal }) => {

    const [categoryBookState, setCategoryBookState] = useState(book?.categoryBook);

    const inputPdfRef = useRef<HTMLInputElement>(null!);
    const [pdfFile, setPdfFile] = useState<File | null>();

    const inputFileRef = useRef<HTMLInputElement>(null!);
    const [bookImage, setBookImage] = useState<File | null>(null);
    const [imageURL, setImageURL] = useState<any>();

    const { register, formState: { errors }, reset, handleSubmit, control } = useForm<Book>({
        defaultValues: {
            nameBook: book?.nameBook,
            descriptionBook: book?.descriptionBook,
            categoryBook: options.find(option => option.value === categoryBookState)
        },
        resolver: yupResolver(bookShema),
        mode: "onSubmit"
    });

    const [editBook] = useEditBookMutation();

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

    const onSubmit = async (data: Book) => {
        try {

            const formData = new FormData();

            book?.nameBook !== data.nameBook && formData.append("nameBook", data.nameBook);
            book?.descriptionBook !== data.descriptionBook && formData.append("descriptionBook", data.descriptionBook);
            book?.categoryBook !== data.categoryBook.value && formData.append("categoryBook", data.categoryBook.value);
            bookImage && formData.append("bookPicture", bookImage);
            pdfFile && formData.append("bookFile", pdfFile);

            await editBook({ editBook: formData, id: book!.id }).unwrap();

            showMessage({ message: "Книга успешно обновлена", variantMessage: "success" });
            onCloseModal();

        } catch (error) {
            if (hasErrorField(error)) {
                showMessage({ message: error.data.error, variantMessage: "error" })
            }
        }
    }

    const getValue = () => {
        return categoryBookState ? options.find(c => c.value === categoryBookState) : undefined
    }

    const handleChangeSelect = (newValue: any) => {
        setCategoryBookState(newValue)
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form__add_book}>
            <div className={styles.add__book_title}>
                <SVG id="books-icon" />
                <h2>Редактировать книгу</h2>
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
                <div className={styles.select__wrapper}>
                    <p>Категория книги: </p>
                    <Controller
                        name="categoryBook"
                        control={control}
                        render={({ field }) => (
                            <Select
                                {...field}
                                isSearchable={false}
                                placeholder="Выберите категорию книги"
                                options={options}
                                value={getValue()}
                                onChange={(selectedOption) => {
                                    field.onChange(selectedOption);
                                    handleChangeSelect(selectedOption);
                                }}
                            />
                        )}
                    />
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
                <button type="submit" className={styles.btn__add_book}>Сохранить изменения</button>
            </div>
        </form>
    )
}
