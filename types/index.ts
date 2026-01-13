export type User = {
  id: string;
  email?: string;
  created_at: string;
  updated_at?: string;
  full_name?: string;
  avatar_url?: string;
};

export type AuthResponse = {
  user: User | null;
  error: Error | null;
};
