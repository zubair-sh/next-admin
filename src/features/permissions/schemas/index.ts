import { z } from "zod";

export const createPermissionSchema = z.object({
  action: z.string().min(1, "required"),
  subject: z.string().min(1, "required"),
  description: z.string().nullable().optional(),
});

export const updatePermissionSchema = createPermissionSchema;

export const getPermissionsRequestSchema = {
  query: z.object({
    action: z.string().optional().nullable(),
    subject: z.string().optional().nullable(),
    search: z.string().optional().nullable(),
    page: z.string().optional(),
    pageSize: z.string().optional(),
    sortBy: z.string().optional(),
    sortOrder: z.enum(["desc", "asc"]).optional(),
  }),
};

export const getPermissionRequestSchema = {
  params: z.object({
    id: z.string().min(1, "required"),
  }),
};

export const createPermissionRequestSchema = {
  body: createPermissionSchema,
};

export const updatePermissionRequestSchema = {
  params: z.object({
    id: z.string().min(1, "required"),
  }),
  body: createPermissionSchema.partial(),
};

export type CreatePermissionFormData = z.infer<typeof createPermissionSchema>;
export type UpdatePermissionFormData = z.infer<typeof updatePermissionSchema>;
