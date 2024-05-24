import { api } from "./api";
import type { Membership } from "../types";

export const unionApi = api.injectEndpoints({
    endpoints: (builder) => ({
        addUserProfsouz: builder.mutation<{ message: string }, void>({
            query: () => ({
                url: "/add-user-union",
                method: "POST"
            })
        }),
        deleteUserInUnion: builder.mutation<{ message: string }, string>({
            query: (id) => ({
                url: `/union/${id}`,
                method: "DELETE"
            })
        }),
        getAllUserInUnion: builder.query<Membership[], void>({
            query: () => ({
                url: "/union",
                method: "GET"
            })
        })
    })
});

export const { endpoints: { addUserProfsouz, deleteUserInUnion, getAllUserInUnion } } = unionApi;
export const { useAddUserProfsouzMutation, useDeleteUserInUnionMutation, useGetAllUserInUnionQuery, useLazyGetAllUserInUnionQuery } = unionApi; 