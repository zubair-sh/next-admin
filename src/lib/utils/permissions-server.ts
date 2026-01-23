import { IUser } from "@/features/users/types";

export const checkPermission = (user: IUser, permission: string) => {
  if (!user || !user.role) return false;

  // Super Admin has all permissions
  if (user.role.name === "Super Admin") return true;
  const [action, subject] = permission.split(":");
  return (
    user.role.permissions?.some(
      (p: { action: string; subject: string }) =>
        p.action === action && p.subject === subject,
    ) ?? false
  );
};
