import { useAppSelector } from "../../app/hooks";
import { useAddUserProfsouzMutation } from "../../app/services/unionApi";
import { useLazyCurrentQuery } from "../../app/services/userApi";
import { selectIsAuthenticated, selectUnion } from "../../features/user/userSlice";
import { hasErrorField } from "../../utils/hasErrorField";
import { hasSuccessField } from "../../utils/hasSuccessField";
import { showMessage } from "../../utils/showMessage";
import { SVG } from "../svg";
import styles from "./index.module.css";

export const MemberInUnion = () => {

    const isAuth = useAppSelector(selectIsAuthenticated);
    const union = useAppSelector(selectUnion);

    const [addInUnionUser] = useAddUserProfsouzMutation();
    const [triggerGetCurrent] = useLazyCurrentQuery();

    const addInUnion = async () => {
        try {
            const result = await addInUnionUser().unwrap();
            if (hasSuccessField(result)) {
                showMessage({ message: result.message, variantMessage: "success" })
            }
            await triggerGetCurrent().unwrap();
        } catch (error) {
            if (hasErrorField(error)) {
                showMessage({ message: error.data.error, variantMessage: "error" });
            }
        }
    }

    if (!isAuth) {
        return "";
    } else if (isAuth && union!.length > 0) {
        return (
            <div className={styles.unionSuccess}>
                <p><SVG id="success-icon" />Вы состоите в профсоюзе</p>
            </div>
        )
    } else {
        return (
            <div className={styles.addInUnion}>
                <button onClick={addInUnion} className={styles.btnAddUnion}>
                    Вступить в профсоюз
                </button>
            </div>
        )
    }
}