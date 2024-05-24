import type { Course } from "../types";
import { api } from "./api";
import type { ResultsTest } from "../types";

type TGetAllResults = ResultsTest & {
    course: Omit<Course, "questions">
}

type TAddResultsTest = Omit<ResultsTest, "id">

export const resultsApi = api.injectEndpoints({
    endpoints: (builder) => ({
        addResults: builder.mutation<ResultsTest, TAddResultsTest>({
            query: (resultsData) => ({
                url: "/results",
                method: "POST",
                body: resultsData
            })
        }),
        getAllResultsUser: builder.query<TGetAllResults[], string>({
            query: (id) => ({
                url: `/results/${id}`,
                method: "GET",
            })
        }),
        deleteResult: builder.mutation<{ message: string }, string>({
            query: (id) => ({
                url: `/results/${id}`,
                method: "DELETE",
            })
        }),
    })
});


export const { endpoints: { addResults, getAllResultsUser, deleteResult } } = resultsApi;
export const { useAddResultsMutation, useGetAllResultsUserQuery, useDeleteResultMutation } = resultsApi;
