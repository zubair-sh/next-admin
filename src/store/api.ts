import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQuery";

// Define tag types for cache invalidation
export const tagTypes = [
  "Auth",
  "User",
  "Users",
  "Permission",
  "Permissions",
  "Role",
  "Roles",
] as const;

export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes,
  endpoints: () => ({}),
});
