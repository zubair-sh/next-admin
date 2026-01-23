import { PaginationParams } from "@/types";

export interface IPermission {
  id: string;
  action: string;
  subject: string;
  description?: string | null;
  createdAt: Date;
  updatedAt: Date | null;
}

export interface CreatePermissionRequest {
  action: string;
  subject: string;
}

export interface UpdatePermissionRequest {
  action: string;
  subject: string;
}

export interface PermissionsQueryParams extends PaginationParams {
  action?: string;
  subject?: string;
}

export interface ExportPermissionsParams {
  format?: "csv" | "xlsx";
  search?: string;
  action?: string;
  subject?: string;
}
