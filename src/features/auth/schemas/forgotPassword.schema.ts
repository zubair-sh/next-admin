import { z } from "zod";

export const forgotPasswordSchema = z.object({
  email: z.string().email("invalid_email"),
});

export const forgotPasswordRequestSchema = {
  body: forgotPasswordSchema,
};

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
