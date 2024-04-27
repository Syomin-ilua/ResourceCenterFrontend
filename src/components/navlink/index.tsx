import type { FC } from "react";
import { NavLink } from "react-router-dom";
import styles from "./index.module.css";
import { SVG } from "../svg";

type Props = {
    linkURL: string
    icon: string
    title: string
}

export const Link: FC<Props> = ({ linkURL, icon, title }) => {

    return (
        <NavLink className={styles.navLink} to={linkURL}>
            <div className={styles.link__icon}>
                <SVG id={icon} />
            </div>
            <p className={styles.link__title}>{title}</p>
        </NavLink>
    )
}
