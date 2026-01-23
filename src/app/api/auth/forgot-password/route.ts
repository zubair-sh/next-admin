import { requestHandler, validate } from "@/lib/api-middlewares";
import { AuthService } from "@/features/auth/services";
import { forgotPasswordRequestSchema } from "@/features/auth/schemas";
import { NextResponse } from "next/server";

export const POST = requestHandler(
  validate(forgotPasswordRequestSchema, async (req) => {
    try {
      await AuthService.forgotPassword(req.data.email);
      return NextResponse.json(
        { message: "Check your email for password reset instructions" },
        { status: 200 },
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
  }),
);
