import type { FC } from "react"
import styles from "./index.module.css";

type Props = {
    children: React.ReactElement | React.ReactElement[] | null
}

export const Container:FC<Props> = ({ children }) => {
    return children ? <div className={styles.container}>{children}</div> : null;
}