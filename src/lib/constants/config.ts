export const APP_CONFIG = {
  name: process.env.NEXT_PUBLIC_APP_NAME || "Next Admin",
  version: process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0",
  apiUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api",
  appUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  enableDarkMode: process.env.NEXT_PUBLIC_ENABLE_DARK_MODE === "true",
  defaultLocale: process.env.NEXT_PUBLIC_DEFAULT_LOCALE || "en",
} as const;

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

export const STORAGE_KEYS = {
  ACCESS_TOKEN: "access_token",
  REFRESH_TOKEN: "refresh_token",
  USER_ROLE: "user_role",
  THEME_MODE: "theme-mode",
  LOCALE: "NEXT_LOCALE",
} as const;

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
} as const;

export const LANGUAGES = [
  { code: "hr", label: "Croatian" },
  { code: "en", label: "English" },
];
