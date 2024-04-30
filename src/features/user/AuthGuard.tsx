import React from "react";
import type { FC, ReactNode } from "react"
import styles from "./index.module.css";
import { useCurrentQuery } from "../../app/services/userApi"

type Props = {
    children: ReactNode
}

export const AuthGuard: FC<Props> = ({ children }) => {

    const { isLoading } = useCurrentQuery();

    if (isLoading) {
        return (
            <div className={styles.wrapper}>
                <span className={styles.loader}></span>
            </div>
        )
    }

    return children;
}   