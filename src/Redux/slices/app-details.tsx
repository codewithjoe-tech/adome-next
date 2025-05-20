import { tenantType } from "@/types";
import { createSlice } from "@reduxjs/toolkit";
import { PersistPartial } from "redux-persist/lib/persistReducer"; 

type initialStateType = {
    appname: string;
    schemaName: string;
    logo: string;
    tenant: tenantType;
} & PersistPartial;

const initialState: initialStateType = {
    appname: "public",
    schemaName: "public",
    logo: "",
    tenant: {
        id: null,
        name: "",
        domain: null,
        contact_email: "",
        location: "",
        description: "",
        blog: false,
        community: false,
        newsletter: false,
        logo: "",
        subscription_plan: "",
        subdomain: "",
        courses: false,
    },
    _persist: { version: -1, rehydrated: false },
};

const appSlice = createSlice({
    name: "app",
    initialState,
    reducers: {
        setAppInfo: (state, action) => {
            return {
                ...state,
                tenant: action.payload.tenant,
                appname: action.payload.appname,
                schemaName: action.payload.schemaName,
                logo: action.payload.logo,
            };
        },
        resetAppInfo: () => initialState, 
    },
});

export const { setAppInfo, resetAppInfo } = appSlice.actions;
export default appSlice.reducer;
