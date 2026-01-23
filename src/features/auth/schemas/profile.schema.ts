import { z } from "zod";
import {
  stringMax24,
  stringRequiredMax24,
  emailRequiredSchema,
  passwordSchema,
} from "@/lib/schemas";

export const updateProfileSchema = z.object({
  firstName: stringRequiredMax24,
  lastName: stringMax24,
  email: emailRequiredSchema,
  password: passwordSchema,
});

export const updateProfileRequestSchema = {
  body: updateProfileSchema,
};

export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;
