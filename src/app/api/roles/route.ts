import {
  requestHandler,
  validate,
  guardAuth,
  guardPermission,
} from "@/lib/api-middlewares";
import { RolesService } from "@/features/roles/services";
import {
  createRoleRequestSchema,
  getRolesRequestSchema,
} from "@/features/roles/schemas";
import { NextResponse } from "next/server";
import { match, pick } from "@/lib/utils";
import { PERMISSIONS } from "@/config/constants/permissions";

export const GET = requestHandler(
  guardAuth(
    guardPermission(PERMISSIONS.ROLES.READ_ALL)(
      validate(getRolesRequestSchema, async (req) => {
        const options = pick(req.query, [
          "page",
          "pageSize",
          "sortBy",
          "sortOrder",
        ]);
        const filters = {
          ...match(req.query, ["name"]),
        };
        const result = await RolesService.getAll(filters, options);
        return NextResponse.json(result);
      }),
    ),
  ),
);

export const POST = requestHandler(
  guardAuth(
    guardPermission(PERMISSIONS.ROLES.CREATE)(
      validate(createRoleRequestSchema, async (req) => {
        try {
          const result = await RolesService.create(req.data);
          return NextResponse.json(result, { status: 201 });
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          return NextResponse.json({ message: error.message }, { status: 400 });
        }
      }),
    ),
  ),
);
