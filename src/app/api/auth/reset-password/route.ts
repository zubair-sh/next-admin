import { requestHandler, validate } from "@/lib/api-middlewares";
import { AuthService } from "@/features/auth/services";
import { resetPasswordRequestSchema } from "@/features/auth/schemas";
import { NextResponse } from "next/server";

export const POST = requestHandler(
  validate(resetPasswordRequestSchema, async (req) => {
    try {
      const result = await AuthService.resetPassword(req.data.password);
      return NextResponse.json(result, { status: 200 });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
  }),
);
