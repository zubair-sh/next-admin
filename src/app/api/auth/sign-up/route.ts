import { requestHandler, validate } from "@/lib/api-middlewares";
import { AuthService } from "@/features/auth/services";
import { signUpRequestSchema } from "@/features/auth/schemas";
import { NextResponse } from "next/server";

export const POST = requestHandler(
  validate(signUpRequestSchema, async (req) => {
    try {
      await AuthService.signUp(req.data);
      return NextResponse.json(
        { message: "User registered successfully" },
        { status: 200 },
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
  }),
);
