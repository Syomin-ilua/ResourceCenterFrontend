import { useEffect, useState } from "react";
import styles from "./index.module.css";
import { RegisterUser } from "./registerUser";
import { UsersList } from "./usersList";
import classNames from "classnames";
import { useAppSelector } from "../../../../app/hooks";
import { selectCurrent } from "../../../../features/user/userSlice";
import { useNavigate } from "react-router-dom";
import { showMessage } from "../../../../utils/showMessage";

export const Users = () => {

    const user = useAppSelector(selectCurrent);
    const navigate = useNavigate();


    useEffect(() => {
        if (user?.role !== "ADMIN") {
            showMessage({ message: "У вас нету доступа к этой странице", variantMessage: "warning" });
            navigate("/");
        }
    }, []);

    const [selectFunction, setSelectFunction] = useState<"register" | "userList">("userList")

    return (
        <div className={styles.users__container}>
            <div className={styles.users__actions}>
                <button onClick={() => setSelectFunction("register")} className={classNames(styles.btnSelect, selectFunction === "register" && styles.btnSelect__active)}>Зарегистрировать сотрудника</button>
                <button onClick={() => setSelectFunction("userList")} className={classNames(styles.btnSelect, selectFunction === "userList" && styles.btnSelect__active)}>Удалить или редактировать сотрудника</button>
            </div>
            {selectFunction === "userList" && <UsersList />}
            {selectFunction === "register" && <RegisterUser />}
        </div>
    )
}
