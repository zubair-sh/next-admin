import { requestHandler, validate, guardAuth } from "@/lib/api-middlewares";
import { UsersService } from "@/features/users/services";
import { updateProfileRequestSchema } from "@/features/auth/schemas";
import { NextResponse } from "next/server";

export const GET = requestHandler(
  guardAuth(async (req) => {
    const result = await UsersService.getById(req.user!.id, {
      role: { include: { permissions: true } },
    });
    if (!result) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    return NextResponse.json(result);
  }),
);

export const PATCH = requestHandler(
  guardAuth(
    validate(updateProfileRequestSchema, async (req) => {
      try {
        const result = await UsersService.update(req.user!.id, req.data, {
          role: { include: { permissions: true } },
        });
        return NextResponse.json(result);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 400 });
      }
    }),
  ),
);
