import {
  requestHandler,
  validate,
  guardAuth,
  guardPermission,
} from "@/lib/api-middlewares";
import { UsersService } from "@/features/users/services";
import {
  getUserRequestSchema,
  updateUserRequestSchema,
} from "@/features/users/schemas";
import { NextResponse } from "next/server";
import { PERMISSIONS } from "@/config/constants/permissions";

export const GET = requestHandler(
  guardAuth(
    guardPermission(PERMISSIONS.USERS.READ)(
      validate(getUserRequestSchema, async (req) => {
        const result = await UsersService.getById(req.params.id);
        if (!result) {
          return NextResponse.json(
            { message: "User not found" },
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
    guardPermission(PERMISSIONS.USERS.UPDATE)(
      validate(updateUserRequestSchema, async (req) => {
        try {
          const result = await UsersService.update(req.params.id, req.data);
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
    guardPermission(PERMISSIONS.USERS.DELETE)(
      validate(getUserRequestSchema, async (req) => {
        try {
          await UsersService.delete(req.params.id);
          return NextResponse.json({
            message: "User deleted successfully",
          });
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          return NextResponse.json({ message: error.message }, { status: 400 });
        }
      }),
    ),
  ),
);
