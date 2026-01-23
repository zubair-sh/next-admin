import { z } from "zod";

export const passwordSchema = z.string().superRefine((value, ctx) => {
  if (value === "") return;

  if (value.length < 8) {
    ctx.addIssue({
      code: z.ZodIssueCode.too_small,
      minimum: 8,
      type: "string",
      inclusive: true,
      message: "password_min_length",
    });
  }

  if (!/[A-Z]/.test(value)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "password_uppercase_required",
    });
  }

  if (!/[a-z]/.test(value)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "password_lowercase_required",
    });
  }

  if (!/[0-9]/.test(value)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "password_number_required",
    });
  }

  if (!/[^A-Za-z0-9]/.test(value)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "password_special_char_required",
    });
  }
});

export const passwordRequiredSchema = z
  .string()
  .min(8, "password_min_length")
  .regex(/[A-Z]/, "password_uppercase_required")
  .regex(/[a-z]/, "password_lowercase_required")
  .regex(/[0-9]/, "password_number_required")
  .regex(/[^A-Za-z0-9]/, "password_special_char_required");

export const stringSchema = z.string().optional().nullable();
export const stringRequired = z.string().trim().min(1, "required");
export const stringMax24 = z.string().max(24, "max_length_24");
export const stringMax50 = z.string().max(50, "max_length_50");
export const stringMax100 = z.string().max(100, "max_length_100");
export const stringRequiredMax24 = stringRequired.max(24, "max_length_24");
export const stringRequiredMax50 = stringRequired.max(50, "max_length_50");
export const stringRequiredMax100 = stringRequired.max(100, "max_length_100");

export const emailRequiredSchema = z
  .string()
  .email("invalid_email")
  .min(1, "required");
export const emailSchema = z.string().email("invalid_email").optional();
