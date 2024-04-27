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
                element: <>Курсы</>
            },
            {
                path: "course/:id",
                element: <>Курс</>
            }
        ]
    },
    {
        path: '/profile',
        element: <Layout />,
        children: [
            {
                path: "",
                element: <>Профиль</>
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
        <React.StrictMode>
            <Provider store={store}>
                <RouterProvider router={router} /> 
            </Provider>
        </React.StrictMode>,
    )
} else {
    throw new Error(
        "Root element with ID 'root' was not found in the document. Ensure there is a corresponding HTML element with the ID 'root' in your HTML file.",
    )
}
