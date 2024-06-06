import { useEffect, type FC } from "react";
import styles from "./index.module.css";
import { Container } from '../../../components/container';
import { SVG } from '../../../components/svg';
import { useForm } from 'react-hook-form';
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Input } from "../../../components/input";
import { useNavigate } from "react-router-dom";
import { useLazyCurrentQuery, useLoginMutation } from "../../../app/services/userApi";
import { hasErrorField } from "../../../utils/hasErrorField";
import { showMessage } from "../../../utils/showMessage";
import { useAppSelector } from "../../../app/hooks";
import { selectIsAuthenticated } from "../../../features/user/userSlice";

type Login = {
    email: string,
    password: string
}

const loginShema = yup.object({
    email: yup.string().required("Заполните обязательное поле").email("Введите корректную эл. почту"),
    password: yup.string().required('Заполните обязательное поле').matches(/[a-zA-Z]/, 'Пароль может содержать только латинские буквы').min(8, 'Минимальное кол-во симовлов в пароле должно быть не меньше 8')
});

export const Login = () => {

    const [login] = useLoginMutation();
    const navigate = useNavigate();
    const [triggerCurrentQuery] = useLazyCurrentQuery();

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

    const { handleSubmit, register, formState: { errors } } = useForm<Login>({
        defaultValues: {
            email: "",
            password: ""
        },
        resolver: yupResolver(loginShema),
        mode: "onChange"
    });

    const onSubmit = async (data: Login) => {
        try {
            await login(data).unwrap();
            await triggerCurrentQuery().unwrap();
            showMessage({ message: "Авторизация прошла успешно", variantMessage: "success" });
            navigate("/");
        } catch (error) {
            if (hasErrorField(error)) {
                showMessage({ message: error.data.error, variantMessage: "error" });
            }
        }
    }

    return (
        <div className={styles.login} >
            <Container>
                <div className={styles.login__wrapper}>
                    <div className={styles.title__wrapper}>
                        <SVG id="login-icon" />
                        <h1 className={styles.title}>Авторизация</h1>
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
                            placeholder="petrov@yandex.ru"
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
                            placeholder="********"
                        />
                        <button className={styles.login__btn} type="submit">
                            <SVG id="login-icon" />
                            Войти
                        </button>
                    </form>
                </div>
            </Container>
        </div>
    )
}