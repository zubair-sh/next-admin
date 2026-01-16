export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  SIGN_UP: "/sign-up",
  SIGN_UP_SUCCESS: "/sign-up-success",
  FORGOT_PASSWORD: "/forgot-password",
  UPDATE_PASSWORD: "/update-password",

  DASHBOARD: "/dashboard",
  USERS: "/users",
  SETTINGS: "/settings",
  PROFILE: "/profile",

  CALLBACK: "/callback",
} as const;

export const PUBLIC_ROUTES = ["/", "/error", "/callback"];

export const AUTH_ROUTES = [
  "/login",
  "/sign-up",
  "/sign-up-success",
  "/forgot-password",
];

export const API_ENDPOINTS = {
  // Auth
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  FORGOT_PASSWORD: "/auth/forgot-password",
  UPDATE_PASSWORD: "/auth/update-password",
  LOGOUT: "/auth/logout",
  DELETE_ACCOUNT: "/auth/delete-account",
  REFRESH: "/auth/refresh-token",
  ME: "/auth/me",

  // Users
  USERS: "/users",
  USER_BY_ID: (id: string) => `/users/${id}`,
  USERS_EXPORT: "/users/export",
} as const;

export const PUBLIC_API_ROUTES = [
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/forgot-password",
  "/api/auth/refresh-token",
  "/api/auth/verify-otp",
  "/api/auth/exchange-code",
];
