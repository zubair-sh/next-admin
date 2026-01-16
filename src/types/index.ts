// Import the Prisma models
import type { User as PrismaUser, Role as PrismaRole } from "@prisma/client";

export type IUser = PrismaUser;
export type IUserRole = PrismaRole;

export type AuthResponse = {
  user: IUser | null;
  error: Error | null;
};

export interface ApiResponse<T> {
  message: string;
  data: T;
  errors: string[] | null;
}

// Paginated response data structure
export interface PaginatedData<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
