import { IUser } from "@/features/users/types";

export interface AuthResponse {
  accessToken: string;
  user: IUser;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignUpRequest {
  email: string;
  password: string;
  role: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  code?: string;
  password: string;
}

export interface UpdateProfileRequest {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
}
