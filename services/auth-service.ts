"use server";

import { ROUTES } from "@/lib/constants";
import { createClient } from "@/lib/supabase/server";
import { User } from "@/types";
import { headers } from "next/headers";

export const login = async (data: { email: string; password: string }) => {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  });

  if (error) {
    throw error;
  }
};

export const signup = async (data: { email: string; password: string }) => {
  const origin = (await headers()).get("origin");
  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      emailRedirectTo: `${origin}/${ROUTES.DASHBOARD}`,
    },
  });

  if (error) {
    throw error;
  }
};

export const forgotPassword = async (data: { email: string }) => {
  const origin = (await headers()).get("origin");
  const supabase = await createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
    redirectTo: `${origin}${ROUTES.CALLBACK}?next=${ROUTES.UPDATE_PASSWORD}`,
  });

  if (error) {
    throw error;
  }
};

export const updatePassword = async (data: { password: string }) => {
  const supabase = await createClient();

  const { error } = await supabase.auth.updateUser({ password: data.password });

  if (error) {
    throw error;
  }
};

export const signOut = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
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
