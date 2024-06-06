import type { FC } from "react";
import { NavLink, useLocation } from "react-router-dom";
import styles from "./index.module.css";
import { SVG } from "../svg";
import classNames from "classnames";

type Props = {
    linkURL: string
    icon: string
    title?: string
}

export const Link: FC<Props> = ({ linkURL, icon, title }) => {

    const location = useLocation();

    const isActive = location.pathname === linkURL;

    const linkClasses = classNames(styles.navLink, {
        [styles.active]: isActive
    });

    return (
        <NavLink className={linkClasses} to={linkURL}>
            <div className={styles.link__icon}>
                <SVG id={icon} />
            </div>
            {title && <p className={styles.link__title}>{title}</p>}
        </NavLink>
    )
}
