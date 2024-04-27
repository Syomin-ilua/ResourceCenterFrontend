import type { FC } from "react"
import styles from "./index.module.css";

type Props = {
    children: React.ReactElement | React.ReactElement[]
}

export const Container: FC<Props> = ({ children }) => {
    return <div className={styles.container}>{children}</div>
}