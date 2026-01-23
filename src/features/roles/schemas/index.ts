import { z } from "zod";

export const createRoleSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().nullable().optional(),
  permissionIds: z.array(z.string()).optional(),
  isSystem: z.boolean().optional(),
});

export const updateRoleSchema = createRoleSchema.partial();

export const getRolesRequestSchema = {
  query: z.object({
    name: z.string().optional().nullable(),
    search: z.string().optional().nullable(),
    page: z.string().optional(),
    pageSize: z.string().optional(),
    sortBy: z.enum(["name", "createdAt"]).optional(),
    sortOrder: z.enum(["desc", "asc"]).optional(),
  }),
};

export const getRoleRequestSchema = {
  params: z.object({
    id: z.string().min(1, "required"),
  }),
};

export const createRoleRequestSchema = {
  body: createRoleSchema,
};

export const updateRoleRequestSchema = {
  params: z.object({
    id: z.string().min(1, "required"),
  }),
  body: updateRoleSchema,
};

export type CreateRoleFormData = z.infer<typeof createRoleSchema>;
export type UpdateRoleFormData = z.infer<typeof updateRoleSchema>;
