"use client";

import {
  useDeleteAccountMutation,
  useForgotPasswordMutation,
  useLoginMutation,
  useLogoutMutation,
  useResetPasswordMutation,
  useSignUpMutation,
} from "@/features/auth/api";
import { loginUser, logoutUser } from "@/features/auth/store";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { setCookie, deleteCookie } from "cookies-next";
import { toast } from "sonner";
import { AuthKeys, AppRoutes } from "@/config/constants";

export function useAuth() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const user = useAppSelector((state) => state.auth.user);

  const [loginMutation, { isLoading: isLoginLoading }] = useLoginMutation();
  const [logoutMutation, { isLoading: isLogoutLoading }] = useLogoutMutation();

  const [signUpMutation, { isLoading: isSignUpLoading }] = useSignUpMutation();
  const [
    forgotPasswordMutation,
    { isLoading: isForgotPasswordLoading, isSuccess: isForgotPasswordSuccess },
  ] = useForgotPasswordMutation();
  const [resetPasswordMutation, { isLoading: isResetPasswordLoading }] =
    useResetPasswordMutation();
  const [deleteAccountMutation, { isLoading: isDeleteAccountLoading }] =
    useDeleteAccountMutation();

  const login = useCallback(
    async (data: { email: string; password: string }) => {
      try {
        const response = await loginMutation(data).unwrap();
        dispatch(loginUser(response));
        setCookie(AuthKeys.isAuthenticated, "true", { path: "/" });
        router.push(AppRoutes.HOME);
        router.refresh();
      } catch (error: unknown) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const errorMessage = (error as any)?.data?.message || "";
        toast.error(errorMessage);
      }
    },
    [dispatch, loginMutation, router],
  );

  const logout = useCallback(async () => {
    dispatch(logoutUser());
    deleteCookie(AuthKeys.isAuthenticated, { path: "/" });
    router.push(AppRoutes.LOGIN);
    router.refresh();
    try {
      await logoutMutation().unwrap();
    } catch {}
  }, [dispatch, logoutMutation, router]);

  const signUp = useCallback(
    async (data: { email: string; password: string; role: string }) => {
      try {
        await signUpMutation(data).unwrap();
        router.push(AppRoutes.SIGN_UP_SUCCESS);
        router.refresh();
      } catch (error: unknown) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const errorMessage = (error as any)?.data?.message || "";
        toast.error(errorMessage);
      }
    },
    [signUpMutation, router],
  );

  const forgotPassword = useCallback(
    async (data: { email: string }) => {
      try {
        await forgotPasswordMutation(data).unwrap();
      } catch (error: unknown) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const errorMessage = (error as any)?.data?.message || "";
        toast.error(errorMessage);
      }
    },
    [forgotPasswordMutation],
  );

  const resetPassword = useCallback(
    async (data: { password: string; code?: string }) => {
      try {
        const response = await resetPasswordMutation(data).unwrap();
        dispatch(loginUser(response));
        setCookie(AuthKeys.isAuthenticated, "true", { path: "/" });
        router.push(AppRoutes.HOME);
        router.refresh();
      } catch (error: unknown) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const errorMessage = (error as any)?.data?.message || "";
        toast.error(errorMessage);
      }
    },
    [router, resetPasswordMutation, dispatch],
  );

  const deleteAccount = useCallback(async () => {
    try {
      await deleteAccountMutation().unwrap();
    } catch {
    } finally {
      dispatch(logoutUser());
      deleteCookie(AuthKeys.isAuthenticated, { path: "/" });
      router.push(AppRoutes.LOGIN);
      router.refresh();
    }
  }, [dispatch, router, deleteAccountMutation]);

  const isLoading =
    isLoginLoading ||
    isLogoutLoading ||
    isSignUpLoading ||
    isForgotPasswordLoading ||
    isResetPasswordLoading ||
    isDeleteAccountLoading;

  const isSuccess = isForgotPasswordSuccess;

  return {
    user,
    isLoading,
    isSuccess,
    login,
    logout,
    signUp,
    forgotPassword,
    resetPassword,
    deleteAccount,
  };
}
