import { passwordRequiredSchema } from "@/lib/schemas";
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("invalid_email"),
  password: passwordRequiredSchema,
});

export const loginRequestSchema = {
  body: loginSchema,
};

export type LoginFormData = z.infer<typeof loginSchema>;
