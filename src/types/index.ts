export type User = {
  id: string;
  email?: string;
  role?: string;
  createdAt: string;
  updatedAt?: string;
  fullName?: string;
  avatar?: string;
};

export type AuthResponse = {
  user: User | null;
  error: Error | null;
};

export interface ApiResponse<T> {
  success: boolean;
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
