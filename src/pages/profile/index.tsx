import { Container } from "../../components/container";
import styles from "./index.module.css";
import { Profile as ProfileComponent } from "../../components/profile";
import { Cerfiticates } from "../../components/certificates";
import { useEffect } from "react";

export const Profile = () => {

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }, []);

    return (
        <div className={styles.profile}>
            <Container>
                <div className={styles.wrapper}>
                    <ProfileComponent />
                    <Cerfiticates />
                </div>
            </Container>
        </div>
    )
}