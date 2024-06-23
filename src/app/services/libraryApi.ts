import type { LibraryCard } from "../types";
import { api } from "./api";

export const libraryApi = api.injectEndpoints({
    endpoints: (builder) => ({
        joinLibrary: builder.mutation<{ message: string }, void>({
            query: () => ({
                url: "/library",
                method: "POST"
            })
        }),
        deleteUserInLibrary: builder.mutation<{ message: string }, string>({
            query: (id) => ({
                url: `/library/${id}`,
                method: "DELETE"
            })
        }),
        getAllLibraryCard: builder.query<LibraryCard[], void>({
            query: () => ({
                url: `/library`,
                method: "GET"
            })
        })
    })
});

export const { endpoints: { joinLibrary, deleteUserInLibrary, getAllLibraryCard } } = libraryApi;
export const { useJoinLibraryMutation, useDeleteUserInLibraryMutation, useGetAllLibraryCardQuery, useLazyGetAllLibraryCardQuery } = libraryApi;