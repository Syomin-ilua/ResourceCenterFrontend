import type { User } from "../types";
import { api } from "./api";

type LoginUserData = Pick<User, "email" | "password">;
type RegisterUserData = Omit<User, "adminType" | "avatarURL" | "certificates" | "id">

export const userApi = api.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation<{ token: string }, LoginUserData>({
            query: (userData) => ({
                url: "/login",
                method: "POST",
                body: userData
            })
        }),
        signUp: builder.mutation<User, RegisterUserData>({
            query: (userData) => ({
                url: "/register",
                method: "POST",
                body: userData
            })
        }),
        updateUser: builder.mutation<User, { userData: FormData, id: string }>({
            query: ({ userData, id }) => ({
                url: `/edit-user/${id}`,
                method: "PUT",
                body: userData
            })
        }),
        current: builder.query<User, void>({
            query: () => ({
                url: "/current",
                method: "GET",
            })
        })
    })
});

export const { useSignUpMutation, useLoginMutation, useCurrentQuery, useLazyCurrentQuery, useUpdateUserMutation } = userApi;

export const { endpoints: { login, signUp, updateUser, current } } = userApi;