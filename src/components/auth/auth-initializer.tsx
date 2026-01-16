"use client";

import { useEffect, useRef } from "react";
import { useAppDispatch } from "@/store/hooks";
import { loginUser } from "@/features/auth/slices/authSlice";
import { authApi } from "@/features/auth/api/authApi";

export function AuthInitializer() {
  const dispatch = useAppDispatch();
  const mounted = useRef(false);

  useEffect(() => {
    if (mounted.current) return;
    mounted.current = true;

    const initAuth = async () => {
      try {
        const user = await dispatch(
          authApi.endpoints.getCurrentUser.initiate()
        ).unwrap();
        if (user) {
          dispatch(loginUser({ user }));
        }
      } catch {
        // User not authenticated, do nothing
      }
    };

    initAuth();
  }, [dispatch]);

  return null;
}
