"use client";

import { useAppSelector } from "@/store/hooks";
import { useCallback } from "react";

export function usePermission() {
  const user = useAppSelector((state) => state.auth.user);

  /**
   * Check if the current user has a specific permission.
   * @param action The action to check (e.g., 'create', 'read', 'update', 'delete')
   * @param subject The subject to check (e.g., 'User', 'Post', 'Dashboard')
   * @returns boolean
   */
  const can = useCallback(
    (permission: string) => {
      if (!user || !user.role) return false;

      // Special case: Super Admin has all permissions
      if (user.role.name === "Super Admin") return true;

      const [action, subject] = permission.split(":");

      return (
        user.role.permissions?.some(
          (p: { action: string; subject: string }) =>
            p.action === action && p.subject === subject,
        ) ?? false
      );
    },
    [user],
  );

  /**
   * Check if the user has a specific role.
   * @param roleName The name of the role (e.g., 'Admin', 'User')
   * @returns boolean
   */
  const hasRole = useCallback(
    (roleName: string) => {
      return user?.role?.name === roleName;
    },
    [user],
  );

  return { can, hasRole };
}
