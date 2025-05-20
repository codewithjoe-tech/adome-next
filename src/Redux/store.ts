import { configureStore, combineReducers } from "@reduxjs/toolkit";
import localforage from "localforage"; // Using localforage
import { persistReducer, persistStore } from "redux-persist";
import userProvider from "./slices/user-details";
import appProvider from "./slices/app-details";

// Persist configuration
const persistConfig = {
  key: "root",
  storage: localforage, 
  whitelist: ["user", "app"], 
};

const rootReducer = combineReducers({
  user: userProvider,
  app: appProvider,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, 
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
