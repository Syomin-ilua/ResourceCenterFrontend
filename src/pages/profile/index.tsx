import { Container } from "../../components/container";
import styles from "./index.module.css";
import { Profile as ProfileComponent } from "../../components/profile";
import { Cerfiticates } from "../../components/certificates";

export const Profile = () => {

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