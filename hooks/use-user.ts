"use client";

import { createClient } from "@/lib/supabase/client";
import { getCurrentUser } from "@/services/auth-service";
import { User } from "@/types";
import { useEffect, useState } from "react";

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const user = await getCurrentUser();

      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    getUser();

    const supabase = createClient();
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          setUser(session.user);
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return { user, loading };
}
