import { API_ENDPOINTS } from "@/lib/constants";
import { api } from "@/services/api";
import { User } from "@/types";

export interface AuthResponse {
  accessToken?: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password?: string;
}

export interface RegisterRequest {
  email: string;
  password?: string;
  referalCode?: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface UpdatePasswordRequest {
  password: string;
}

export interface UpdateProfileRequest {
  email?: string;
  firstName?: string;
  lastName?: string;
  image?: File;
}

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: API_ENDPOINTS.LOGIN,
        method: "POST",
        body: credentials,
        credentials: "include",
      }),
    }),
    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (data) => ({
        url: API_ENDPOINTS.REGISTER,
        method: "POST",
        body: data,
        credentials: "include",
      }),
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: API_ENDPOINTS.LOGOUT,
        method: "POST",
      }),
    }),
    getCurrentUser: builder.query<User, void>({
      query: () => API_ENDPOINTS.ME,
      providesTags: ["User"],
    }),
    updateProfile: builder.mutation<User, UpdateProfileRequest>({
      query: (data) => {
        const formData = new FormData();
        if (data.email) formData.append("email", data.email);
        if (data.firstName) formData.append("firstName", data.firstName);
        if (data.lastName) formData.append("lastName", data.lastName);
        if (data.image) formData.append("image", data.image);

        return {
          url: API_ENDPOINTS.ME,
          method: "PATCH",
          body: formData,
        };
      },
      invalidatesTags: ["User"],
    }),
    updatePassword: builder.mutation<User, UpdatePasswordRequest>({
      query: (data) => ({
        url: API_ENDPOINTS.UPDATE_PASSWORD,
        method: "POST",
        body: data,
      }),
    }),
    forgotPassword: builder.mutation<string, ForgotPasswordRequest>({
      query: (data) => ({
        url: API_ENDPOINTS.FORGOT_PASSWORD,
        method: "POST",
        body: data,
      }),
    }),
    deleteAccount: builder.mutation<string, void>({
      query: () => ({
        url: API_ENDPOINTS.DELETE_ACCOUNT,
        method: "POST",
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useGetCurrentUserQuery,
  useUpdateProfileMutation,
  useUpdatePasswordMutation,
  useForgotPasswordMutation,
  useDeleteAccountMutation,
} = authApi;
