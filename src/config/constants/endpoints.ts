export const ApiEndpoints = {
  LOGIN: "/auth/login",
  SIGN_UP: "/auth/sign-up",
  LOGOUT: "/auth/logout",
  REFRESH: "/auth/refresh-token",
  FORGOT_PASSWORD: "/auth/forgot-password",
  RESET_PASSWORD: "/auth/reset-password",
  DELETE_ACCOUNT: "/auth/delete-account",
  VERIFY_EMAIL: "/auth/verify-email",
  CALLBACK: "/auth/callback",
  PROFILE: "/auth/profile",

  PERMISSIONS: "/permissions",
  PERMISSION_BY_ID: (id: string | number) => `/permissions/${id}`,
  PERMISSIONS_EXPORT: "/permissions/export",

  ROLES: "/roles",
  ROLE_BY_ID: (id: string | number) => `/roles/${id}`,
  ROLES_EXPORT: "/roles/export",

  USERS: "/users",
  USER_BY_ID: (id: string | number) => `/users/${id}`,
  USERS_EXPORT: "/users/export",
} as const;
