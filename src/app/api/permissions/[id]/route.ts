import {
  requestHandler,
  validate,
  guardAuth,
  guardPermission,
} from "@/lib/api-middlewares";
import { PermissionsService } from "@/features/permissions/services";
import {
  getPermissionRequestSchema,
  updatePermissionRequestSchema,
} from "@/features/permissions/schemas";
import { NextResponse } from "next/server";
import { PERMISSIONS } from "@/config/constants/permissions";

export const GET = requestHandler(
  guardAuth(
    guardPermission(PERMISSIONS.PERMISSIONS.READ)(
      validate(getPermissionRequestSchema, async (req) => {
        const result = await PermissionsService.getById(req.params.id);
        if (!result) {
          return NextResponse.json(
            { message: "Permission not found" },
            { status: 404 },
          );
        }
        return NextResponse.json(result);
      }),
    ),
  ),
);

export const PATCH = requestHandler(
  guardAuth(
    guardPermission(PERMISSIONS.PERMISSIONS.UPDATE)(
      validate(updatePermissionRequestSchema, async (req) => {
        try {
          const result = await PermissionsService.update(
            req.params.id,
            req.data,
          );
          return NextResponse.json(result);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          return NextResponse.json({ message: error.message }, { status: 400 });
        }
      }),
    ),
  ),
);

export const DELETE = requestHandler(
  guardAuth(
    guardPermission(PERMISSIONS.PERMISSIONS.DELETE)(
      validate(getPermissionRequestSchema, async (req) => {
        try {
          await PermissionsService.delete(req.params.id);
          return NextResponse.json({
            message: "Permission deleted successfully",
          });
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          return NextResponse.json({ message: error.message }, { status: 400 });
        }
      }),
    ),
  ),
);
