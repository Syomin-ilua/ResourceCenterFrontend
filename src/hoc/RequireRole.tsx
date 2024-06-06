import { useAppSelector } from "../app/hooks"
import { selectCurrent } from "../features/user/userSlice"
import { showMessage } from "../utils/showMessage";
import { Navigate } from "react-router-dom";
import type { ReactNode, FC } from "react";

type Props = {
    children: ReactNode
}

export const RequireRole: FC<Props> = ({ children }) => {

    const user = useAppSelector(selectCurrent);

    if (user?.role !== "ADMIN" && user?.role !== "MODERATOR") {
        showMessage({ message: "У вас нету доступа к данной странице", variantMessage: "warning" });
        return <Navigate to="/" replace={true} />
    }

    return children;
}