export const APP_NAME = "Next.js Supabase Starter";

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  SIGN_UP: "/sign-up",
  SIGN_UP_SUCCESS: "/sign-up-success",
  FORGOT_PASSWORD: "/forgot-password",
  UPDATE_PASSWORD: "/update-password",
  DASHBOARD: "/dashboard",
  CALLBACK: "/callback",
} as const;

export const API_ROUTES = {
  AUTH_CONFIRM: "/auth/confirm",
} as const;

export const PUBLIC_ROUTES = [
  "/",
  "/login",
  "/sign-up",
  "/sign-up-success",
  "/forgot-password",
  "/update-password",
  "/auth",
  "/error",
  "/callback",
];
