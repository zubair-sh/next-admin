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
  DeleteAccountAction,
  forgotPasswordAction,
  loginAction,
  logoutAction,
  registerAction,
  updatePasswordAction,
} from "../actions";

export function useAuth() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const user = useAppSelector(selectCurrentUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  const login = useCallback(
    async (data: { email: string; password: string }) => {
      try {
        setIsLoading(true);
        const user = await loginAction(data);

        // Dispatch credentials to Redux store
        dispatch(
          loginUser({
            user,
            token: "",
          })
        );

        // Set cookie for middleware access
        setCookie("accessToken", "", {
          maxAge: 60 * 60 * 24 * 30,
          path: "/",
        });

        toast.success("Login successful");

        router.push(ROUTES.DASHBOARD);
        router.refresh(); // Refresh to update server components/middleware state
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        const errorMessage =
          error?.data?.message || "Invalid email or password";
        toast.error(errorMessage);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [dispatch, router]
  );

  const signup = useCallback(
    async (data: { email: string; password: string }) => {
      try {
        setIsLoading(true);
        await registerAction(data);

        router.push(ROUTES.SIGN_UP_SUCCESS);
        router.refresh(); // Refresh to update server components/middleware state
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        const errorMessage =
          error?.data?.message || "Invalid email or password";
        toast.error(errorMessage);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [router]
  );

  const forgotPassword = useCallback(async (data: { email: string }) => {
    try {
      setIsLoading(true);
      await forgotPasswordAction(data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const errorMessage = error?.data?.message || "";
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updatePassword = useCallback(
    async (data: { password: string }) => {
      try {
        setIsLoading(true);
        await updatePasswordAction(data);
        router.push(ROUTES.DASHBOARD);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        const errorMessage = error?.data?.message || "";
        toast.error(errorMessage);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [router]
  );

  const logout = useCallback(async () => {
    try {
      setIsLoading(true);
      dispatch(logoutUser());
      deleteCookie("accessToken");
      router.push(ROUTES.LOGIN);
      router.refresh();
      await logoutAction();
    } catch {
      // Ignore errors during logout
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, router]);

  const deleteAccount = useCallback(async () => {
    try {
      setIsLoading(true);
      await DeleteAccountAction();
      dispatch(logoutAction());
      deleteCookie("accessToken");
      router.push(ROUTES.LOGIN);
      router.refresh();
    } catch {
      // Ignore errors during logout
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, router]);

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
