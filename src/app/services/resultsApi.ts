import type { Course } from "../types";
import { api } from "./api";
import type { ResultsTest } from "../types";

// type ResultsTest = {
//     id?: string
//     resultProcent: number
//     idUser: string
//     idCourse: string
//     course?: Omit<Course, "questions">
// }

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
    })
});


export const { endpoints: { addResults, getAllResultsUser } } = resultsApi;
export const { useAddResultsMutation, useGetAllResultsUserQuery } = resultsApi;
