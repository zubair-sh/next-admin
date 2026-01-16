"use server";

import { ROUTES } from "@/lib/constants";
import { createClient } from "@/lib/supabase/server";
import { User } from "@/types";
import { EmailOtpType } from "@supabase/supabase-js";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const loginAction = async (data: {
  email: string;
  password: string;
}) => {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  });

  if (error) {
    throw error;
  }
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw "User not found";

  return user;
};

export const registerAction = async (data: {
  email: string;
  password: string;
}) => {
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

export const forgotPasswordAction = async (data: { email: string }) => {
  const origin = (await headers()).get("origin");
  const supabase = await createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
    redirectTo: `${origin}${ROUTES.CALLBACK}?next=${ROUTES.UPDATE_PASSWORD}`,
  });

  if (error) {
    throw error;
  }
};

export const updatePasswordAction = async (data: { password: string }) => {
  const supabase = await createClient();

  const { error } = await supabase.auth.updateUser({ password: data.password });

  if (error) {
    throw error;
  }
};

export const logoutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect(ROUTES.LOGIN);
};

export const DeleteAccountAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect(ROUTES.LOGIN);
};

export const loginWithCodeAction = async (code: string) => {
  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    throw error;
  }
};

export const verifyOtpAction = async (type: string, tokenHash: string) => {
  const supabase = await createClient();

  const { error } = await supabase.auth.verifyOtp({
    type: type as EmailOtpType,
    token_hash: tokenHash,
  });

  if (error) {
    throw error;
  }
};

export const getSessionAction = async () => {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
};

export const getCurrentUserAction = async (): Promise<User | null> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  return user;
};
