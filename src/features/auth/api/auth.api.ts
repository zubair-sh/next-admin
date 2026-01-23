import { api } from "@/store/api";
import { ApiEndpoints } from "@/config/constants";
import {
  AuthResponse,
  ForgotPasswordRequest,
  LoginRequest,
  ResetPasswordRequest,
  SignUpRequest,
  UpdateProfileRequest,
} from "../types";
import { IUser } from "@/features/users/types";

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: ApiEndpoints.LOGIN,
        method: "POST",
        body: credentials,
        credentials: "include",
      }),
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: ApiEndpoints.LOGOUT,
        method: "POST",
      }),
    }),
    signUp: builder.mutation<void, SignUpRequest>({
      query: (data) => ({
        url: ApiEndpoints.SIGN_UP,
        method: "POST",
        body: data,
      }),
    }),
    forgotPassword: builder.mutation<void, ForgotPasswordRequest>({
      query: (data) => ({
        url: ApiEndpoints.FORGOT_PASSWORD,
        method: "POST",
        body: data,
      }),
    }),
    resetPassword: builder.mutation<AuthResponse, ResetPasswordRequest>({
      query: (data) => ({
        url: ApiEndpoints.RESET_PASSWORD,
        method: "POST",
        body: data,
      }),
    }),
    deleteAccount: builder.mutation<string, void>({
      query: () => ({
        url: ApiEndpoints.DELETE_ACCOUNT,
        method: "POST",
      }),
    }),
    getProfile: builder.query<IUser, void>({
      query: () => ({
        url: ApiEndpoints.PROFILE,
        method: "GET",
      }),
      providesTags: ["Auth"],
    }),
    updateProfile: builder.mutation<IUser, UpdateProfileRequest>({
      query: (data) => ({
        url: ApiEndpoints.PROFILE,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Auth"],
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useSignUpMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useDeleteAccountMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
} = authApi;
