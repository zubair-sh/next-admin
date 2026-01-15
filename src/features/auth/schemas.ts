import z from "zod";

export const emailSchema = z.string().email("email");

export const passwordSchema = z
  .string()
  .min(6, "min6")
  .regex(/[A-Z]/, "passwordUppercase")
  .regex(/[a-z]/, "passwordLowercase")
  .regex(/[0-9]/, "passwordNumber")
  .regex(/[^A-Za-z0-9]/, "passwordSpecial");
