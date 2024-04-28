import type { FC } from "react";
import styles from "./index.module.css";
import { Container } from '../../../components/container';
import { SVG } from '../../../components/svg';
import { useForm } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Input } from "../../../components/input";
import { Link } from "react-router-dom";

type Login = {
    email: string,
    password: string
}

const loginShema = yup.object({
    email: yup.string().required("Заполните обязательное поле").email("Введите корректную эл. почту"),
    password: yup.string().required('Заполните обязательное поле').matches(/[a-zA-Z]/, 'Пароль может содержать только латинские буквы').min(8, 'Минимальное кол-во симовлов в пароле должно быть не меньше 8')
});

export const Login: FC = () => {

    const { handleSubmit, register, formState: { errors }, reset } = useForm<Login>({
        defaultValues: {
            email: "",
            password: ""
        },
        resolver: yupResolver(loginShema),
        mode: "onChange"
    });

    const onSubmit = (data: Login) => {
        console.log(data);
    }

    return (
        <div className={styles.login} >
            <Container>
                <div className={styles.login__wrapper}>
                    <div className={styles.title__wrapper}>
                        <SVG id="login-icon" />
                        <h1 className={styles.title}>Авторизация в сервисе</h1>
                    </div>
                    <form className={styles.login__form} onSubmit={handleSubmit(onSubmit)}>
                        <Input 
                            type="text"
                            error={!!errors.email}
                            errorText={errors?.email?.message}
                            name="email"
                            id="Email"
                            title="Эл. почта"
                            register={register("email")}
                            iconID="email-icon"
                        />
                        <Input 
                            type="password"
                            error={!!errors.password}
                            errorText={errors?.password?.message}
                            name="password"
                            id="Password"
                            title="Пароль"
                            register={register("password")}
                            iconID="password-icon"
                        />
                        <button className={styles.login__btn} type="submit">
                            <SVG id="login-icon"/>
                            Войти
                        </button>
                        <p className={styles.auth__link}>Нет аккаунта? <Link to="/auth/sign-up">Зарегистрироваться</Link></p>
                    </form>
                </div>
            </Container>
        </div>
    )
}