import { passwordSchema } from "@/lib/schemas";
import { z } from "zod";

export const signUpSchema = z.object({
  email: z.string().email("invalid_email"),
  password: passwordSchema,
  role: z.string().optional(),
});

export const signUpRequestSchema = {
  body: signUpSchema,
};

export type SignUpFormData = z.infer<typeof signUpSchema>;
