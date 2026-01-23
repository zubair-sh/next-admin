import {
  emailRequiredSchema,
  passwordRequiredSchema,
  stringMax24,
  stringRequired,
  stringRequiredMax24,
  stringSchema,
} from "@/lib/schemas";
import { z } from "zod";

export const createUserSchema = z.object({
  email: emailRequiredSchema,
  password: passwordRequiredSchema,
  firstName: stringRequiredMax24,
  lastName: stringMax24,
  roleId: stringRequired,
  status: z.enum(["active", "inactive", "deleted"]),
});

export const updateUserSchema = z.object({
  email: emailRequiredSchema,
  firstName: stringRequiredMax24,
  lastName: stringMax24,
  roleId: stringRequired,
  status: z.enum(["active", "inactive", "deleted"]),
});

export const getUsersRequestSchema = {
  query: z.object({
    status: stringSchema,
    roleId: stringSchema,
    search: stringSchema,
    page: stringSchema,
    pageSize: stringSchema,
    sortBy: z.enum(["email", "fullName", "status", "createdAt"]).optional(),
    sortOrder: z.enum(["desc", "asc"]).optional(),
  }),
};

export const getUserRequestSchema = {
  params: z.object({
    id: stringRequired,
  }),
};

export const createUserRequestSchema = {
  body: createUserSchema,
};

export const updateUserRequestSchema = {
  params: z.object({
    id: stringRequired,
  }),
  body: updateUserSchema,
};

export type CreateUserFormData = z.infer<typeof createUserSchema>;
export type UpdateUserFormData = z.infer<typeof updateUserSchema>;
