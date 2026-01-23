import { passwordSchema } from "@/lib/schemas";
import { z } from "zod";

export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "password_match",
    path: ["confirmPassword"],
  });

export const resetPasswordRequestSchema = {
  body: resetPasswordSchema,
};

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
