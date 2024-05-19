import { api } from "./api";
import type { Book } from "../types";

export const courseApi = api.injectEndpoints({
    endpoints: (builder) => ({
        addBook: builder.mutation<{ message: string }, FormData>({
            query: (bookData) => ({
                url: "/books",
                method: "POST",
                body: bookData
            })
        }),
        deleteBook: builder.mutation<{ message: string }, string>({
            query: (id) => ({
                url: `/books/${id}`,
                method: "DELETE",
            })
        }),
        getAllBooks: builder.query<Book[], { search?: string }>({
            query: ({ search }) => {
                const params: { [key: string]: string | number } = {};
                if (search) params.search = search;
                return {
                    url: `/books`,
                    method: "GET",
                    params
                }
            }
        }),
        getBook: builder.query<Book, string>({
            query: (id) => ({
                url: `/books/${id}`,
                method: "GET",
            })
        }),
        editBook: builder.mutation<{ message: string }, { editBook: FormData, id: string }>({
            query: ({ editBook, id }) => ({
                url: `/books/${id}`,
                method: "PUT",
                body: editBook
            })
        })
    })
});

export const { endpoints: { getAllBooks, getBook, deleteBook, addBook, editBook } } = courseApi;
export const { useGetAllBooksQuery, useGetBookQuery, useLazyGetAllBooksQuery, useLazyGetBookQuery, useAddBookMutation, useDeleteBookMutation, useEditBookMutation } = courseApi;