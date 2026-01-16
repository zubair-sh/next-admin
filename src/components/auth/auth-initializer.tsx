"use client";

import { useEffect, useRef } from "react";
import { useAppDispatch } from "@/store/hooks";
import { getCurrentUserAction } from "@/features/auth/actions";
import { loginUser } from "@/features/auth/slices/authSlice";

export function AuthInitializer() {
  const dispatch = useAppDispatch();
  const mounted = useRef(false);

  useEffect(() => {
    if (mounted.current) return;
    mounted.current = true;

    const initAuth = async () => {
      try {
        const user = await getCurrentUserAction();
        if (user) {
          dispatch(loginUser({ user, token: "" }));
        }
      } catch {
        // User not authenticated, do nothing
      }
    };

    initAuth();
  }, [dispatch]);

  return null;
}
