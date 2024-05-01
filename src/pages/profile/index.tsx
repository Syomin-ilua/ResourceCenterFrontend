import { Container } from "../../components/container";
import styles from "./index.module.css";
import { Profile as ProfileComponent } from "../../components/profile";

export const Profile = () => {

    return (
        <div className={styles.profile}>
            <Container>
                <div className={styles.wrapper}>
                    <ProfileComponent />
                    <div className={styles.certificate__wrapper}></div>
                </div>
            </Container>
        </div>
    )
}