import authReducer from "@/features/auth/slices/authSlice";
import { api } from "@/services/api";
import { combineReducers } from "@reduxjs/toolkit";
import uiReducer from "./slices/uiSlice";

const appReducer = combineReducers({
  [api.reducerPath]: api.reducer,
  auth: authReducer,
  ui: uiReducer,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const rootReducer = (state: any, action: any) => {
  if (action.type === "auth/logout") {
    state = undefined;
  }
  return appReducer(state, action);
};

export type RootState = ReturnType<typeof appReducer>;
