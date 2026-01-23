import {
  requestHandler,
  validate,
  guardAuth,
  guardPermission,
} from "@/lib/api-middlewares";
import { PermissionsService } from "@/features/permissions/services";
import {
  createPermissionRequestSchema,
  getPermissionsRequestSchema,
} from "@/features/permissions/schemas";
import { NextResponse } from "next/server";
import { match, pick } from "@/lib/utils";
import { PERMISSIONS } from "@/config/constants/permissions";

export const GET = requestHandler(
  guardAuth(
    guardPermission(PERMISSIONS.PERMISSIONS.READ_ALL)(
      validate(getPermissionsRequestSchema, async (req) => {
        const options = pick(req.query, [
          "page",
          "pageSize",
          "sortBy",
          "sortOrder",
        ]);
        const filters = {
          ...pick(req.query, ["action", "subject"]),
          ...match(req.query, ["action", "subject", "description"]),
        };
        const result = await PermissionsService.getAll(filters, options);
        return NextResponse.json(result);
      }),
    ),
  ),
);

export const POST = requestHandler(
  guardAuth(
    guardPermission(PERMISSIONS.PERMISSIONS.CREATE)(
      validate(createPermissionRequestSchema, async (req) => {
        try {
          const result = await PermissionsService.create(req.data);
          return NextResponse.json(result, { status: 201 });
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          return NextResponse.json({ message: error.message }, { status: 400 });
        }
      }),
    ),
  ),
);
