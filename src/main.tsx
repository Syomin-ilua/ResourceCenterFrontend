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
import { CourseContextProvider } from "./pages/course/CourseContext"
import { CoursesContextProvider } from "./pages/courses/CoursesContext"
import { AdminPanel } from "./pages/admin/AdminPanel"
import { Users } from "./pages/admin/AdminPanel/users"
import { Books } from "./pages/admin/AdminPanel/books"
import { CoursesAdmin } from "./pages/admin/AdminPanel/courses"
import { BooksPage } from "./pages/books"
import { BooksContextProvider } from "./pages/books/BooksContext"
import { Book } from "./pages/book"
import { Profsouz } from "./pages/news"
import { ProfsouzContextProvider } from "./pages/news/NewsContext"
import { CurrentNews } from "./pages/currentNews"
import { News } from "./pages/admin/AdminPanel/news"
import { Events } from "./pages/admin/AdminPanel/events"
import { Cultural } from "./pages/cultural"
import { RequireRole } from "./hoc/RequireRole"

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
                    <CoursesContextProvider>
                        <Courses />
                    </CoursesContextProvider>
                )
            },
            {
                path: ":id",
                element: (
                    <RequireAuth>
                        <CourseContextProvider>
                            <Course />
                        </CourseContextProvider>
                    </RequireAuth>
                )
            }
        ]
    },
    {
        path: "/library",
        element: <Layout />,
        children: [
            {
                path: "",
                element: <BooksContextProvider>
                    <BooksPage />
                </BooksContextProvider>
            },
            {
                path: ":id",
                element: <RequireAuth>
                    <Book />
                </RequireAuth>
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
        element:
            <RequireAuth>
                <RequireRole>
                    <Layout />
                </RequireRole>
            </RequireAuth>,
        children: [
            {
                path: "users",
                element:
                    <AdminPanel>
                        <Users />
                    </AdminPanel>
            },
            {
                path: "courses",
                element: <AdminPanel>
                    <CoursesAdmin />
                </AdminPanel>
            },
            {
                path: "books",
                element: <AdminPanel>
                    <Books />
                </AdminPanel>
            },
            {
                path: "news",
                element: <AdminPanel>
                    <News />
                </AdminPanel>
            },
            {
                path: "events",
                element: <AdminPanel>
                    <Events />
                </AdminPanel>
            },
        ]
    },
    {
        path: "/profsouz",
        element: <Layout />,
        children: [
            {
                path: "",
                element: <ProfsouzContextProvider>
                    <Profsouz />
                </ProfsouzContextProvider>
            },
            {
                path: "news/:id",
                element: <CurrentNews />
            }
        ]
    },
    {
        path: "/cultural",
        element: <Layout />,
        children: [
            {
                path: "",
                element: <Cultural />
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
