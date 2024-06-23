import type { User } from "../types";
import { api } from "./api";

type LoginUserData = Pick<User, "email" | "password">;
type RegisterUserData = Omit<User, "adminType" | "avatarURL" | "unions" | "id" | "participation">

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
                url: "/users",
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
        }),
        getAllUsers: builder.query<User[], void>({
            query: () => ({
                url: "/users",
                method: "GET"
            })
        }),
        deleteUser: builder.mutation<User, string>({
            query: (id) => ({
                url: `users/${id}`,
                method: "DELETE",
            })
        }),
        editUserAdmin: builder.mutation<User, { userData: FormData, id: string }>({
            query: ({ userData, id }) => ({
                url: `users/${id}`,
                method: "PUT",
                body: userData
            })
        }),
        getUserById: builder.query<User, string>({
            query: (id) => ({
                url: `users/${id}`,
                method: "GET",
            })
        })
    })
});

export const { useSignUpMutation, useLoginMutation, useCurrentQuery, useLazyCurrentQuery, useUpdateUserMutation, useDeleteUserMutation, useEditUserAdminMutation, useGetAllUsersQuery, useLazyGetAllUsersQuery, useGetUserByIdQuery } = userApi;

export const { endpoints: { login, signUp, updateUser, current, editUserAdmin, getAllUsers, deleteUser, getUserById } } = userApi;