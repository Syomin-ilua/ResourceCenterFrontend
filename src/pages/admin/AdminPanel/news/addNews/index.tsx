import { Controller, useForm } from "react-hook-form";
import styles from "./index.module.css";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRef, useState } from "react";
import { Input } from "../../../../../components/input";
import classNames from "classnames";
import Select from "react-select";
import { showMessage } from "../../../../../utils/showMessage";
import { SVG } from "../../../../../components/svg";
import { hasErrorField } from "../../../../../utils/hasErrorField";
import { useAddNewsMutation } from "../../../../../app/services/newsApi";

const newsShema = yup.object({
    newsName: yup.string().required("Заполните обязательное поле").matches(/[а-яА-ЯёЁ]+/, "Вводить можно только русские буквы"),
    newsDescription: yup.string().required("Заполните обязательное поле").matches(/[а-яА-ЯёЁ]+/, "Вводить можно только русские буквы"),
    categoryNews: yup.object().shape({
        value: yup.string().required("Выбор категории обязателен"),
        label: yup.string().required(),
    }).required('Выбор категории обязателен')
});

const options = [
    { value: 'Профсоюз', label: 'Профсоюз' },
    { value: 'Производство', label: 'Производство' }
];


const allowedTypesImage = ["image/jpeg", "image/png", "image/webp"];

export const AddNews = () => {

    const [categoryNews, setCategoryNews] = useState("Производство");

    const inputFileRef = useRef<HTMLInputElement>(null!);
    const [newsImage, setNewsImage] = useState<File | null>(null);
    const [imageURL, setImageURL] = useState<any>();

    const [addNews] = useAddNewsMutation();

    const { handleSubmit, reset, formState: { errors }, register, control } = useForm({
        defaultValues: {
            newsName: "",
            newsDescription: "",
            categoryNews: {
                value: "",
                label: ""
            }
        },
        resolver: yupResolver(newsShema),
        mode: "onChange"
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
            setNewsImage(event.target.files[0]);
            reader.onload = (e) => {
                setImageURL(e.target?.result);
            }
            reader.readAsDataURL(event.target.files[0]);
        }
    }

    const removeFile = () => {
        setNewsImage(null);
    }

    const getValue = () => {
        return categoryNews ? options.find(c => c.value === categoryNews) : undefined
    }

    const handleChangeSelect = (newValue: any) => {
        setCategoryNews(newValue)
    }

    const onSubmit = async (data: any) => {
        try {
            const formData = new FormData();

            if (!newsImage) {
                showMessage({ message: "Подгрузите фото новости", variantMessage: "warning" });
                return;
            }

            formData.append("newsName", data.newsName);
            formData.append("newsDescription", data.newsDescription);
            formData.append("newsCategory", data.categoryNews.value);
            formData.append("newsImage", newsImage);

            await addNews(formData).unwrap();
            showMessage({ message: "Новость успешно добавлена", variantMessage: "success" });
            reset();
            removeFile();

        } catch (error) {
            if (hasErrorField(error)) {
                showMessage({ message: error.data.error, variantMessage: "error" })
            }
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={styles.addNews__form}>
            <h2 className={styles.addNews__title}>
                <SVG id="news-icon" />
                Создание новости
            </h2>
            <Input
                name="newsName"
                id="NewsName"
                register={register("newsName")}
                type="text"
                title="Название новости"
                error={!!errors.newsName}
                errorText={errors?.newsName?.message}
            />
            <div className={styles.textarea__wrapper}>
                <label className={classNames(styles.textarea__label, errors.newsDescription && styles.error__textarea)} htmlFor="DescriptionNews">
                    <p>Описание новости:</p>
                    <textarea
                        id="DescriptionNews"
                        {...register("newsDescription")}
                        className={styles.textarea}
                    >
                    </textarea>
                </label>
                {errors.newsDescription && <p className={styles.error__input_text}>{errors.newsDescription.message}</p>}
            </div>
            <div className={styles.select__wrapper}>
                <Controller
                    name="categoryNews"
                    control={control}
                    render={({ field }) => (
                        <Select
                            {...field}
                            isSearchable={false}
                            placeholder="Выберите категорию новости"
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
                    <p className={styles.book__image_title}>Фото новости:</p>
                </div>
                <input ref={inputFileRef} onChange={handleAddFile} type="file" className={styles.inputFile} />
                <div className={styles.file__wrapper}>
                    <button type="button" onClick={onChoiseFile} className={styles.file__btn}>Выберите фото</button>
                    {newsImage ? <img className={styles.image__uploaded} src={imageURL} alt="Загруженное изображение" /> : <p className={styles.empty__file_text}>Изображение не выбрано</p>}
                    {newsImage && <button onClick={removeFile} className={styles.delete__file_btn}>
                        <span></span>
                        <span></span>
                    </button>}
                </div>
            </div>
            <button type="submit" className={styles.addNews__btn}>Добавить новость</button>
        </form>
    )
}