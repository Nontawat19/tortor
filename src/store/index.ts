import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import userMapReducer from "./slices/userMapSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    userMap: userMapReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
