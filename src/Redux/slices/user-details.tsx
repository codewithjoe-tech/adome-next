import { UsersType } from "@/types";
import { createSlice } from "@reduxjs/toolkit";
import { PersistPartial } from "redux-persist/lib/persistReducer"; 

type InitialStateType = {
    user: UsersType;
    isLoggedIn: boolean;
} & PersistPartial; 

const initialState: InitialStateType = {
    user: {
        user: {
            email: "",
            full_name: "",
            username: "",
            profile_pic: "",
        },
        role: "",
        tenant: 0,
        blocked: false,
        banned: false,
        created_at: "",
        designation: "",
        id: 0,
        is_staff: false,
        is_admin: false,
        hasStaffPermission: false,
        hasBlogPermission: false,
        hasCommunityPermission: false,
        hasNewsletterPermission: false,
        hasCoursesPermission: false,
        hasBuilderPermission: false,
    },
    isLoggedIn: false,
    _persist: { version: -1, rehydrated: false }, 
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUserData: (state, action) => {
            return {
                ...state,
                user: action.payload.user,
                isLoggedIn: true,
            };
        },
        logout: () => {
            return initialState;
        },
    },
});

export const { setUserData, logout } = userSlice.actions;
export default userSlice.reducer;
