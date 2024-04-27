import type { FC } from "react";
import { Outlet } from "react-router-dom";
import { Footer } from "../../widgets/footer";
import { Header } from "../../widgets/header";
import styles from "./index.module.css";

export const Layout = () => {
    return (
        <>
            <Header />
            <main className={styles.main}>
                <Outlet />
            </main>
            <Footer />
        </>
    )
}