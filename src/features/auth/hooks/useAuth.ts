"use client";

import {
  loginUser,
  logoutUser,
  selectCurrentUser,
  selectIsAuthenticated,
} from "@/features/auth/slices/authSlice";
import { hasPermission, Permission, Role } from "@/lib/auth/permissions";
import { ROUTES } from "@/lib/constants/routes";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { deleteCookie, setCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import {
  useDeleteAccountMutation,
  useForgotPasswordMutation,
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useUpdatePasswordMutation,
} from "../api/authApi";

export function useAuth() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const user = useAppSelector(selectCurrentUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  const [loginMutation] = useLoginMutation();
  const [registerMutation] = useRegisterMutation();
  const [forgotPasswordMutation] = useForgotPasswordMutation();
  const [logoutMutation] = useLogoutMutation();
  const [updatePasswordMutation] = useUpdatePasswordMutation();
  const [deleteAccountMutation] = useDeleteAccountMutation();

  const login = useCallback(
    async (data: { email: string; password: string }) => {
      try {
        setIsLoading(true);
        const res = await loginMutation(data).unwrap();

        // Dispatch credentials to Redux store
        dispatch(loginUser(res));

        // Set cookie for middleware access
        setCookie("accessToken", res.accessToken || "", {
          maxAge: 60 * 60 * 24 * 30,
          path: "/",
        });

        toast.success("Login successful");

        router.push(ROUTES.DASHBOARD);
        router.refresh(); // Refresh to update server components/middleware state
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        const errorMessage = error?.data?.message || error.message || "";
        toast.error(errorMessage);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [dispatch, router, loginMutation]
  );

  const signup = useCallback(
    async (data: { email: string; password: string }) => {
      try {
        setIsLoading(true);
        await registerMutation(data).unwrap();

        router.push(ROUTES.SIGN_UP_SUCCESS);
        router.refresh(); // Refresh to update server components/middleware state
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        const errorMessage = error?.data?.message || error.message || "";
        toast.error(errorMessage);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [router, registerMutation]
  );

  const forgotPassword = useCallback(
    async (data: { email: string }) => {
      try {
        setIsLoading(true);
        await forgotPasswordMutation(data).unwrap();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        const errorMessage = error?.data?.message || error.message || "";
        toast.error(errorMessage);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [forgotPasswordMutation]
  );

  const updatePassword = useCallback(
    async (data: { password: string }) => {
      try {
        setIsLoading(true);

        await updatePasswordMutation(data).unwrap();

        router.push(ROUTES.DASHBOARD);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        const errorMessage = error?.data?.message || error.message || "";
        toast.error(errorMessage);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [router, updatePasswordMutation]
  );

  const logout = useCallback(async () => {
    try {
      setIsLoading(true);
      dispatch(logoutUser());
      deleteCookie("accessToken");
      router.push(ROUTES.LOGIN);
      router.refresh();
      await logoutMutation().unwrap();
    } catch {
      // Ignore errors during logout
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, router, logoutMutation]);

  const deleteAccount = useCallback(async () => {
    try {
      setIsLoading(true);
      await deleteAccountMutation().unwrap();
      dispatch(logoutUser());
      deleteCookie("accessToken");
      router.push(ROUTES.LOGIN);
      router.refresh();
    } catch {
      // Ignore errors during logout
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, router, deleteAccountMutation]);

  const checkPermission = useCallback(
    (permission: Permission): boolean => {
      if (!user?.role) return false;
      return hasPermission(user.role as Role, permission);
    },
    [user?.role]
  );

  return {
    user,
    isLoading,
    isAuthenticated,
    login,
    signup,
    forgotPassword,
    updatePassword,
    logout,
    deleteAccount,
    checkPermission,
  };
}
