import authReducer from "@/features/auth/slices/authSlice";
import { api } from "@/services/api";
import { combineReducers } from "@reduxjs/toolkit";
import uiReducer from "./slices/uiSlice";

const appReducer = combineReducers({
  [api.reducerPath]: api.reducer,
  auth: authReducer,
  ui: uiReducer,
});

export const rootReducer = (state: any, action: any) => {
  if (action.type === "auth/logout") {
    state = undefined;
  }
  return appReducer(state, action);
};

export type RootState = ReturnType<typeof appReducer>;
