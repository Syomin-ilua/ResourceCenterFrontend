import { api } from "./api";
import type { Course } from "../types";

export type TCourses = Omit<Course, "questions">

export const courseApi = api.injectEndpoints({
    endpoints: (builder) => ({
        createCourse: builder.mutation<{ message: string }, FormData>({
            query: (courseData) => ({
                url: "/course",
                method: "POST",
                body: courseData
            })
        }),
        getCourses: builder.query<Course[], { search?: string }>({
            query: ({ search }) => {
                const params: { [key: string]: string | number } = {};
                if (search) params.search = search;
                return {
                    url: `/courses`,
                    method: "GET",
                    params
                }
            }
        }),
        getCourse: builder.query<Course, string>({
            query: (id) => ({
                url: `/course/${id}`,
                method: "GET",
            })
        }),
        deleteCourse: builder.mutation<{ message: string }, string>({
            query: (id) => ({
                url: `/delete-course/${id}`,
                method: "DELETE"
            })
        }),
        updateCourse: builder.mutation<{ message: string }, { courseId: string, courseData: FormData }>({
            query: ({ courseId, courseData }) => ({
                url: `/courses/${courseId}`,
                method: "PUT",
                body: courseData
            })
        })
    })
});

export const { endpoints: { createCourse, getCourse, getCourses, deleteCourse, updateCourse } } = courseApi;
export const { useCreateCourseMutation, useDeleteCourseMutation, useGetCourseQuery, useLazyGetCoursesQuery, useGetCoursesQuery, useUpdateCourseMutation } = courseApi;
