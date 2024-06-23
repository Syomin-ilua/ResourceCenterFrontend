import { useAppSelector } from "../../app/hooks";
import { useJoinLibraryMutation } from "../../app/services/libraryApi";
import { useLazyCurrentQuery } from "../../app/services/userApi";
import { selectLibraryCard } from "../../features/user/userSlice";
import { hasErrorField } from "../../utils/hasErrorField";
import { hasSuccessField } from "../../utils/hasSuccessField";
import { showMessage } from "../../utils/showMessage";
import { SVG } from "../svg";
import styles from "./index.module.css";

export const MemberInLibrary = () => {

    const libraryCard = useAppSelector(selectLibraryCard);

    const [joinInLibrary] = useJoinLibraryMutation();
    const [triggerGetCurrentQuery] = useLazyCurrentQuery();

    const handleJoinInLibrary = async () => {
        try {
            const result = await joinInLibrary().unwrap();
            if (hasSuccessField(result)) {
                showMessage({ message: result.message, variantMessage: "success" })
            }
            await triggerGetCurrentQuery().unwrap();
        } catch (error) {
            if (hasErrorField(error)) {
                showMessage({ message: error.data.error, variantMessage: "error" })
            }
        }
    }
    console.log(libraryCard);
    

    return (
        <div className={styles.memberInLibrary}>
            {libraryCard !== null && libraryCard !== undefined ? <>
                <SVG id="success-icon" />
                <h2>Вы состоите в библиотеке</h2>
            </>
                : <button onClick={handleJoinInLibrary} className={styles.joinLibraryBtn}>Вступить в библиотеку</button>}
        </div>
    )
}
