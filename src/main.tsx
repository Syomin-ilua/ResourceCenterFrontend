import React from "react"
import { createRoot } from "react-dom/client"
import { Provider } from "react-redux"
import { store } from "./app/store"
import "./index.css"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { Main } from "./pages/main"
import { Login } from "./pages/auth/login"
import { Registration } from "./pages/auth/registration"
import { Layout } from "./components/layout"
import { SnackbarProvider } from "notistack"
import { AuthGuard } from "./features/user/AuthGuard"
import { Courses } from "./pages/courses"
import { Course } from "./pages/course"
import { Profile } from "./pages/profile"
import { RequireAuth } from "./hoc/RequireAuth"

const container = document.getElementById("root")

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                path: "",
                element: <Main />
            }
        ]
    },
    {
        path: "/auth",
        element: <Layout />,
        children: [
            {
                path: "sign-in",
                element: <Login />
            },
            {
                path: "sign-up",
                element: <Registration />
            }
        ]
    },
    {
        path: '/courses',
        element: <Layout />,
        children: [
            {
                path: "",
                element: (
                    <RequireAuth>
                        <Courses />
                    </RequireAuth>
                )
            },
            {
                path: "course/:id",
                element: (
                    <RequireAuth>
                        <Course />
                    </RequireAuth>
                )
            }
        ]
    },
    {
        path: '/profile',
        element: <Layout />,
        children: [
            {
                path: "",
                element: (
                    <RequireAuth>
                        <Profile />
                    </RequireAuth>
                )
            }
        ]
    },
    {
        path: '/admin',
        element: <>Проверка пользователя на права доступа к админ панели</>,
        children: [
            {
                path: "create-course",
                element: <>Создать курс</>
            }
        ]
    }
]);

if (container) {
    const root = createRoot(container)

    root.render(
        <Provider store={store}>
            <SnackbarProvider>
                <AuthGuard>
                    <RouterProvider router={router} />
                </AuthGuard>
            </SnackbarProvider>
        </Provider>,
    )
} else {
    throw new Error(
        "Root element with ID 'root' was not found in the document. Ensure there is a corresponding HTML element with the ID 'root' in your HTML file.",
    )
}
