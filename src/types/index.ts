export type User = {
  id: string;
  email?: string;
  role?: string;
  created_at: string;
  updated_at?: string;
  full_name?: string;
  avatar_url?: string;
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
