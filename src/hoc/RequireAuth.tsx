import { useAppSelector } from "../app/hooks"
import { selectIsAuthenticated } from "../features/user/userSlice"
import { showMessage } from "../utils/showMessage";
import { Navigate } from "react-router-dom";
import type { ReactNode, FC } from "react";

type Props = {
    children: ReactNode
}

export const RequireAuth: FC<Props> = ({ children }) => {

    const isAuthentificate = useAppSelector(selectIsAuthenticated);

    if (!isAuthentificate) {
        showMessage({ message: "Авторизуйтесь или зарегистрируйтесь в сервисе", variantMessage: "warning" });
        return <Navigate to="/auth/sign-in" replace={true} />
    }

    return children;
}