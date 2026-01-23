import { IRole } from "@/features/roles/types";
import { PaginationParams } from "@/types";

export interface IUser {
  id: string;
  email: string;
  fullName?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  image?: string | null;
  status: "active" | "inactive" | "deleted";
  roleId: string;
  role?: IRole;
  createdAt: Date;
  updatedAt: Date | null;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  fullName?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  roleId: string;
  status?: "active" | "inactive" | "deleted";
}

export interface UpdateUserRequest {
  email?: string;
  password?: string;
  fullName?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  roleId?: string;
  status?: "active" | "inactive" | "deleted";
}

export interface UsersQueryParams extends PaginationParams {
  status?: string;
  roleId?: string;
}

export interface ExportUsersParams {
  format?: "csv" | "xlsx";
  search?: string;
  status?: string;
  roleId?: string;
}
