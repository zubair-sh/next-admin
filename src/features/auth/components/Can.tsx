"use client";

import { ReactNode } from "react";
import { usePermission } from "../hooks/usePermission";

interface CanProps {
  permission?: string;
  role?: string;
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * A declarative component to show/hide content based on permissions or roles.
 *
 * Usage:
 * <Can permission={PERMISSIONS.USERS.CREATE}>
 *   <Button>Add User</Button>
 * </Can>
 *
 * <Can role="Admin">
 *   <AdminDashboard />
 * </Can>
 */
export function Can({ permission, role, children, fallback = null }: CanProps) {
  const { can, hasRole } = usePermission();

  let allowed = false;

  if (role) {
    allowed = hasRole(role);
  } else if (permission) {
    allowed = can(permission);
  }

  if (allowed) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
}
