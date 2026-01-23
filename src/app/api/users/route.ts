import {
  requestHandler,
  validate,
  guardAuth,
  guardPermission,
} from "@/lib/api-middlewares";
import { UsersService } from "@/features/users/services";
import {
  createUserRequestSchema,
  getUsersRequestSchema,
} from "@/features/users/schemas";
import { NextResponse } from "next/server";
import { match, pick } from "@/lib/utils";
import { PERMISSIONS } from "@/config/constants/permissions";

export const GET = requestHandler(
  guardAuth(
    guardPermission(PERMISSIONS.USERS.READ_ALL)(
      validate(getUsersRequestSchema, async (req) => {
        const options = pick(req.query, [
          "page",
          "pageSize",
          "sortBy",
          "sortOrder",
        ]);
        const filters = {
          ...pick(req.query, ["status", "roleId"]),
          ...match(req.query, ["email", "fullName", "firstName", "lastName"]),
        };
        const result = await UsersService.getAll(filters, options);
        return NextResponse.json(result);
      }),
    ),
  ),
);

export const POST = requestHandler(
  guardAuth(
    guardPermission(PERMISSIONS.USERS.CREATE)(
      validate(createUserRequestSchema, async (req) => {
        try {
          const result = await UsersService.create(req.data);
          return NextResponse.json(result, { status: 201 });
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          return NextResponse.json({ message: error.message }, { status: 400 });
        }
      }),
    ),
  ),
);
