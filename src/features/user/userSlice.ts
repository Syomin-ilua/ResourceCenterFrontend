import { createSlice } from "@reduxjs/toolkit";
import { userApi } from "../../app/services/userApi";
import type { RootState } from "../../app/store"
import type { User } from "../../app/types";

interface InitialState {
    isAuthenticated: boolean
    current: Omit<User, "password"> | null
    token?: string,
}

const initialState: InitialState = {
    isAuthenticated: false,
    current: null,
}

const slice = createSlice({
    name: "user",
    initialState,
    reducers: {
        logout: () => initialState
    },
    extraReducers: (builder) => {
        builder
            .addMatcher(userApi.endpoints.login.matchFulfilled, (state, action) => {
                state.isAuthenticated = true;
                state.token = action.payload.token;
            })
            .addMatcher(userApi.endpoints.current.matchFulfilled, (state, action) => {
                state.isAuthenticated = true;
                state.current = action.payload;
            })
    }
});


export const { logout } = slice.actions;
export default slice.reducer;

export const selectCurrent = (state: RootState) => state.user.current;
export const selectIsAuthenticated = (state: RootState) => state.user.isAuthenticated;
export const selectUnion = (state: RootState) => state.user.current?.unions
export const selectLibraryCard = (state: RootState) => state.user.current?.libraryCard;
export const selectUserId = (state: RootState) => state.user.current?.id ;