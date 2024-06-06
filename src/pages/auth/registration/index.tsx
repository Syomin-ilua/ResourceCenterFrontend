import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Container } from "../../../components/container";
import { SVG } from "../../../components/svg";
import styles from "./index.module.css";
import { Input } from "../../../components/input";
import { Link, useNavigate } from "react-router-dom";
import { useSignUpMutation } from "../../../app/services/userApi";
import { hasErrorField } from "../../../utils/hasErrorField";
import { showMessage } from "../../../utils/showMessage";
import { useAppSelector } from "../../../app/hooks";
import { selectIsAuthenticated } from "../../../features/user/userSlice";
import { useEffect } from "react";

type Register = {
    surname: string
    userName: string
    patronymic: string
    position: string
    email: string
    password: string
    tel: string
    confirmPassword: string
    permission?: boolean
}

const registerSchema = yup.object({
    surname: yup.string().required("Заполните обязательное поле").matches(/[а-яА-ЯёЁ]+/, "Вводить можно только русские буквы"),
    userName: yup.string().required("Заполните обязательное поле").matches(/[а-яА-ЯёЁ]+/, "Вводить можно только русские буквы"),
    patronymic: yup.string().required("Заполните обязательное поле").matches(/[а-яА-ЯёЁ]+/, "Вводить можно только русские буквы"),
    position: yup.string().required("Заполните обязательное поле").matches(/[а-яА-ЯёЁ]+/, "Вводить можно только русские буквы"),
    email: yup.string().required("Заполните обязательное поле").matches(/^[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}$/i, "Введите корректную эл. почту"),
    password: yup.string().required('Заполните обязательное поле').matches(/[a-zA-Z]/, 'Пароль может содержать только латинские буквы').min(8, 'Минимальное кол-во симовлов в пароле должно быть не меньше 8'),
    tel: yup.string().required('Заполните обязательное поле').matches(/^((\+7|7|8)+([0-9]){10})$/, 'Введите корректный номер телефона'),
    permission: yup.boolean().oneOf([true], "Пожалуйста, подтвердите согласие на обработку персональных данных"),
    confirmPassword: yup.string().required("Заполните обязательное поле").oneOf([yup.ref("password")], "Пароли не совпадают")
});

export const Registration = () => {

    const [signUp] = useSignUpMutation();
    
    const navigate = useNavigate();

    const isAuthentificate = useAppSelector(selectIsAuthenticated);

    useEffect(() => {
        if (isAuthentificate) {
            navigate("/");
        }
    }, [isAuthentificate]);

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }, []);

    const { handleSubmit, formState: { errors }, reset, register } = useForm<Register>({
        defaultValues: {
            surname: "",
            userName: "",
            patronymic: "",
            position: "",
            email: "",
            password: "",
            tel: "",
            permission: false,
            confirmPassword: ""
        },
        resolver: yupResolver(registerSchema),
        mode: "onChange"
    });

    const onSubmit = async (data: Register) => {
        try {
            const userData = {
                surname: data.surname,
                userName: data.userName,
                patronymic: data.patronymic,
                position: data.position,
                tel: data.tel,
                email: data.email,
                password: data.password,
                role: "USER"
            };
            
            await signUp(userData).unwrap(); 
            showMessage({ message: "Регистрация прошла успешно, авторизуйтесь", variantMessage: "success" });
            navigate("/auth/sign-in");
            
        } catch (error) {
            if(hasErrorField(error)) {
                showMessage({ message: error.data.error, variantMessage: "error" });
            }
        }  
    }


    return (
        <div className={styles.registration}>
            <Container>
                <div className={styles.register__wrapper}>
                    <div className={styles.title__wrapper}>
                        <SVG id="register-icon" />
                        <h1 className={styles.title}>Регистрация сотрудника</h1>
                    </div>
                    <form className={styles.register__form} onSubmit={handleSubmit(onSubmit)}>
                        <div className={styles.top}>
                            <div className={styles.leftSide}>
                                <Input
                                    type="text"
                                    error={!!errors.surname}
                                    errorText={errors?.surname?.message}
                                    name="surname"
                                    id="Surname"
                                    title="Фамилия"
                                    register={register("surname")}
                                    iconID="user-icon"
                                    placeholder="Петров"
                                />
                                <Input
                                    type="text"
                                    error={!!errors.userName}
                                    errorText={errors?.userName?.message}
                                    name="userName"
                                    id="UserName"
                                    title="Имя"
                                    register={register("userName")}
                                    iconID="user-icon"
                                    placeholder="Пётр"
                                />
                                <Input
                                    type="text"
                                    error={!!errors.patronymic}
                                    errorText={errors?.patronymic?.message}
                                    name="patronymic"
                                    id="patronymic"
                                    title="Отчество"
                                    register={register("patronymic")}
                                    iconID="user-icon"
                                    placeholder="Петрович"
                                />
                                <Input
                                    type="text"
                                    error={!!errors.position}
                                    errorText={errors?.position?.message}
                                    name="position"
                                    id="Position"
                                    title="Должность"
                                    register={register("position")}
                                    iconID="position-icon"
                                    placeholder="Начальник цеха"
                                />
                            </div>
                            <div className={styles.rightSide}>
                                <Input
                                    type="text"
                                    error={!!errors.tel}
                                    errorText={errors?.tel?.message}
                                    name="tel"
                                    id="Tel"
                                    title="Номер телефона"
                                    register={register("tel")}
                                    iconID="tel-icon"
                                    placeholder="8 (999) 999-99-99"
                                />
                                <Input
                                    type="text"
                                    error={!!errors.email}
                                    errorText={errors?.email?.message}
                                    name="email"
                                    id="Email"
                                    title="Эл. почта"
                                    register={register("email")}
                                    iconID="email-icon"
                                    placeholder="petrov@yandex.ru"
                                />
                                <Input
                                    type="password"
                                    error={!!errors.password}
                                    errorText={errors?.password?.message}
                                    name="password"
                                    id="password"
                                    title="Пароль"
                                    register={register("password")}
                                    iconID="password-icon"
                                    placeholder="********"
                                />
                                <Input
                                    type="password"
                                    error={!!errors.confirmPassword}
                                    errorText={errors?.confirmPassword?.message}
                                    name="confirmPassword"
                                    id="confirmPassword"
                                    title="Подтвердите пароль"
                                    register={register("confirmPassword")}
                                    iconID="password-icon"
                                    placeholder="********"
                                />
                            </div>
                        </div>
                        <div className={styles.bottom}>
                            <div className={styles.permission__checkbox}>
                                <div className={styles.permission__checkbox_wrapper}>
                                    <input id="permission" {...register("permission")} type="checkbox" name="permission" className={styles.permission__checkbox} />
                                    <label htmlFor="permission" className={styles.permission__checkbox_text}>Я даю согласие на обработку персональных данных и согласен с политикой конфиденциальности</label>
                                </div>
                                {errors.permission && <p className={styles.error__checkbox_text}>{errors.permission.message}</p>}
                            </div>
                            <button className={styles.register__btn} type="submit">
                                <SVG id="register-icon" />
                                Зарегистрироваться
                            </button>
                            <p className={styles.auth__link}>Уже есть аккаунт? <Link to="/auth/sign-in">Войти</Link></p>
                        </div>
                    </form>
                </div>
            </Container>
        </div>
    )
}