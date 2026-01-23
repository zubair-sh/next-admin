import {
  requestHandler,
  validate,
  guardAuth,
  guardPermission,
} from "@/lib/api-middlewares";
import { RolesService } from "@/features/roles/services";
import {
  getRoleRequestSchema,
  updateRoleRequestSchema,
} from "@/features/roles/schemas";
import { NextResponse } from "next/server";
import { PERMISSIONS } from "@/config/constants/permissions";

export const GET = requestHandler(
  guardAuth(
    guardPermission(PERMISSIONS.ROLES.READ)(
      validate(getRoleRequestSchema, async (req) => {
        const result = await RolesService.getById(req.params.id);
        if (!result) {
          return NextResponse.json(
            { message: "Role not found" },
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
    guardPermission(PERMISSIONS.ROLES.UPDATE)(
      validate(updateRoleRequestSchema, async (req) => {
        try {
          const result = await RolesService.update(req.params.id, req.data);
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
    guardPermission(PERMISSIONS.ROLES.DELETE)(
      validate(getRoleRequestSchema, async (req) => {
        try {
          await RolesService.delete(req.params.id);
          return NextResponse.json({
            message: "Role deleted successfully",
          });
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          return NextResponse.json({ message: error.message }, { status: 400 });
        }
      }),
    ),
  ),
);
