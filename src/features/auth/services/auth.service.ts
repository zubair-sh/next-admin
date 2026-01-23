import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";
import { EmailOtpType } from "@supabase/supabase-js";
import { AppConstants, AppRoutes } from "@/config/constants";
import {
  AuthResponse,
  ForgotPasswordRequest,
  LoginRequest,
  ResetPasswordRequest,
  SignUpRequest,
} from "../types";
import { UsersService } from "@/features/users/services";
import { IUser } from "@/features/users/types";

export class AuthService {
  static async login(body: LoginRequest): Promise<AuthResponse> {
    const supabase = await createClient();
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: body.email,
      password: body.password,
    });

    if (error) {
      throw error;
    }

    const user = await UsersService.getById(authData.user.id, {
      role: { include: { permissions: true } },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return {
      user,
      accessToken: authData.session?.access_token || "",
    };
  }

  static async loginWithCode(code: string): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      throw error;
    }
  }

  static async verifyEmail(
    type: EmailOtpType,
    tokenHash: string,
  ): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash: tokenHash,
    });

    if (error) {
      throw error;
    }
  }

  static async signUp(body: SignUpRequest): Promise<void> {
    const supabase = await createClient();

    const { data, error } = await supabase.auth.signUp({
      email: body.email,
      password: body.password,
      options: {
        emailRedirectTo: `${AppConstants.appUrl + AppRoutes.CALLBACK}?next=${AppRoutes.EMAIL_VERIFY_SUCCESS}`,
      },
    });

    if (error) {
      throw error;
    }

    if (!data.user) {
      throw "User not found";
    }

    let user = await UsersService.getById(data.user.id);

    if (!user) {
      const roleName = body.role || "User";
      const dbRole = await prisma.role.findUnique({
        where: { name: roleName },
      });

      if (!dbRole) {
        throw new Error(`Role ${roleName} not found`);
      }

      user = (await prisma.user.create({
        data: {
          id: data.user.id,
          email: body.email,
          roleId: dbRole.id,
        },
      })) as IUser;
    }
  }

  static async logout() {
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw error;
    }
  }

  static async forgotPassword(body: ForgotPasswordRequest) {
    const supabase = await createClient();

    const { error } = await supabase.auth.resetPasswordForEmail(body.email, {
      redirectTo: `${AppConstants.appUrl + AppRoutes.CALLBACK}?next=${AppRoutes.RESET_PASSWORD}`,
    });

    if (error) {
      throw error;
    }
  }

  static async resetPassword(
    body: ResetPasswordRequest,
  ): Promise<AuthResponse> {
    const supabase = await createClient();

    const { data, error } = await supabase.auth.updateUser({
      password: body.password,
    });

    if (error) {
      throw error;
    }

    const user = await UsersService.getById(data.user.id, {
      role: { include: { permissions: true } },
    });

    if (!user) {
      throw "User not found";
    }

    return { user, accessToken: "" };
  }

  static async deleteAccount() {
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw error;
    }
  }
}
