import type { FC } from "react"
import type { UseFormRegisterReturn } from "react-hook-form";
import classNames from "classnames";
import styles from "./index.module.css";
import { SVG } from "../svg";

type Props = {
    type: "button" | "checkbox" | "file" | "hidden" | "image" | "password" | "radio" | "reset" | "submit" | "text"
    title: string
    error?: boolean
    errorText?: string
    name: string
    id: string
    register?: UseFormRegisterReturn<string>
    iconID?: string
    placeholder?: string
}

export const Input: FC<Props> = ({ type = "text", title, error, errorText, name, id, register, iconID, placeholder }) => {
    return (
        <label htmlFor={id} className={styles.label}>
            <p className={classNames(`${styles.input__title}`,`${error && styles.error__input_title}`)}>{iconID && <SVG id={iconID} />}{title}:</p>
            <input
                id={id}
                className={classNames(`${styles.input}`,`${error && styles.error__input}`)}
                {...register}
                type={type}
                name={name}
                placeholder={placeholder}
            />
            {error && <p className={styles.error__input_text}>{errorText}</p>}
        </label>
    )
}
