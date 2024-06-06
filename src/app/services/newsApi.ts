import type { News } from "../types";
import { api } from "./api";

export const newsApi = api.injectEndpoints({
    endpoints: (builder) => ({
        addNews: builder.mutation<News, FormData>({
            query: (newsData) => ({
                url: "/news",
                method: "POST",
                body: newsData
            })
        }),
        deleteNews: builder.mutation<News, string>({
            query: (id) => ({
                url: `/news/${id}`,
                method: "DELETE",
            })
        }),
        updateNews: builder.mutation<News, { newsData: FormData, id: string }>({
            query: ({ newsData, id }) => ({
                url: `/news/${id}`,
                method: "PUT",
                body: newsData
            })
        }),
        getAllNews: builder.query<News[], { newsCategory?: string }>({
            query: ({ newsCategory }) => {
                const params: { [key: string]: string } = {};
                if (newsCategory) params.newsCategory = newsCategory;
                return {
                    url: `/news`,
                    method: "GET",
                    params
                }
            }
        }),
        getNewsById: builder.query<News,  string>({
            query: (id) => ({
                url: `/news/${id}`,
                method: "GET",
            })
        })
    })
})

export const { endpoints: { addNews, deleteNews, updateNews, getAllNews, getNewsById } } = newsApi;

export const {useAddNewsMutation, useDeleteNewsMutation, useUpdateNewsMutation, useGetAllNewsQuery, useGetNewsByIdQuery, useLazyGetAllNewsQuery, useLazyGetNewsByIdQuery} = newsApi