export type Role = "superadmin" | "admin" | "teacher" | "student";

export type Permission =
  | "users:read"
  | "users:create"
  | "users:update"
  | "users:delete";

export const PERMISSIONS = {
  USERS: {
    READ: "users:read" as const,
    CREATE: "users:create" as const,
    UPDATE: "users:update" as const,
    DELETE: "users:delete" as const,
  },
} as const;

const rolePermissions: Record<Role, Permission[]> = {
  superadmin: [
    PERMISSIONS.USERS.READ,
    PERMISSIONS.USERS.CREATE,
    PERMISSIONS.USERS.UPDATE,
    PERMISSIONS.USERS.DELETE,
  ],
  admin: [
    PERMISSIONS.USERS.READ,
    PERMISSIONS.USERS.CREATE,
    PERMISSIONS.USERS.UPDATE,
    PERMISSIONS.USERS.DELETE,
  ],
  teacher: [],
  student: [],
};

export function hasPermission(role: Role, permission: Permission): boolean {
  return rolePermissions[role]?.includes(permission) ?? false;
}

export function hasAnyPermission(
  role: Role,
  permissions: Permission[]
): boolean {
  return permissions.some((permission) => hasPermission(role, permission));
}

export function hasAllPermissions(
  role: Role,
  permissions: Permission[]
): boolean {
  return permissions.every((permission) => hasPermission(role, permission));
}

export function getPermissionsForRole(role: Role): Permission[] {
  return rolePermissions[role] || [];
}
