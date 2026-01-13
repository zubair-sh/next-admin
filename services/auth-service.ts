"use server";

import { ROUTES } from "@/lib/constants";
import { createClient } from "@/lib/supabase/server";
import { User } from "@/types";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const login = async (data: { email: string; password: string }) => {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    throw error;
  }

  return redirect(ROUTES.DASHBOARD);
};

export const signup = async (formData: FormData) => {
  const origin = (await headers()).get("origin");
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    return redirect(`/sign-up?message=${error.message}`);
  }

  return redirect("/sign-up-success");
};

export const forgotPassword = async (formData: FormData) => {
  const origin = (await headers()).get("origin");
  const email = formData.get("email") as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?next=/update-password`,
  });

  if (error) {
    return redirect(`/forgot-password?message=${error.message}`);
  }

  return redirect(
    "/forgot-password?message=Check email to continue sign in process"
  );
};

export const signOut = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/login");
};

export const getSession = async () => {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
};

export const getUser = async (): Promise<User | null> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  return {
    id: user.id,
    email: user.email,
    created_at: user.created_at,
    updated_at: user.updated_at,
    full_name: user.user_metadata?.full_name,
    avatar_url: user.user_metadata?.avatar_url,
  } as User;
};
