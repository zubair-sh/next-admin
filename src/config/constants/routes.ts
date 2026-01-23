export const AppRoutes = {
  HOME: "/dashboard",
  LOGIN: "/login",
  SIGN_UP: "/sign-up",
  SIGN_UP_SUCCESS: "/sign-up-success",
  EMAIL_VERIFY_SUCCESS: "/email-verify-success",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  CALLBACK: "/callback",
  DASHBOARD: "/dashboard",
  SETTINGS: "/settings",
  PROFILE: "/profile",
  NOT_FOUND: "/not-found",

  PERMISSIONS: "/admin/permissions",
  PERMISSION_DETAIL: (id: string) => `/admin/permissions/${id}`,
  PERMISSION_NEW: "/admin/permissions/new",

  ROLES: "/admin/roles",
  ROLE_DETAIL: (id: string) => `/admin/roles/${id}`,
  ROLE_NEW: "/admin/roles/new",

  USERS: "/admin/users",
  USER_DETAIL: (id: string) => `/admin/users/${id}`,
  USER_NEW: "/admin/users/new",
} as const;
