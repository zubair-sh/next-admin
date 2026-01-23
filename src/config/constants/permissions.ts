export const PERMISSIONS = {
  // User Management
  USERS: {
    CREATE: "user:create",
    READ: "user:read",
    READ_ALL: "user:read_all",
    UPDATE: "user:update",
    DELETE: "user:delete",
  },
  // Role Management
  ROLES: {
    CREATE: "role:create",
    READ: "role:read",
    READ_ALL: "role:read_all",
    UPDATE: "role:update",
    DELETE: "role:delete",
  },
  // Permission Management
  PERMISSIONS: {
    CREATE: "permission:create",
    READ: "permission:read",
    READ_ALL: "permission:read_all",
    UPDATE: "permission:update",
    DELETE: "permission:delete",
  },
  // Dashboard
  DASHBOARD: {
    READ: "dashboard:read",
  },
  ANALYTICS: {
    READ: "analytics:read",
  },
  // Settings
  SETTINGS: {
    READ: "settings:read",
    UPDATE: "settings:update",
  },
} as const;
