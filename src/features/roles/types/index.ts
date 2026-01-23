import { IPermission } from "@/features/permissions/types";
import { PaginationParams } from "@/types";

export interface IRole {
  id: string;
  name: string;
  description?: string | null;
  isSystem?: boolean;
  permissions?: IPermission[];
  createdAt?: Date;
  updatedAt?: Date | null;
}

export interface CreateRoleRequest {
  name: string;
  description?: string | null;
  permissionIds?: string[];
  isSystem?: boolean;
}

export interface UpdateRoleRequest {
  name?: string;
  description?: string | null;
  permissionIds?: string[];
  isSystem?: boolean;
}

export interface RolesQueryParams extends PaginationParams {
  name?: string;
}

export interface ExportRolesParams {
  format?: "csv" | "xlsx";
  search?: string;
}
