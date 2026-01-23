import { requestHandler, guardAuth } from "@/lib/api-middlewares";
import { AuthService } from "@/features/auth/services";
import { NextResponse } from "next/server";

export const POST = requestHandler(
  guardAuth(async () => {
    try {
      await AuthService.deleteAccount();
      return NextResponse.json(
        { message: "Account deleted successfully" },
        { status: 200 },
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
  }),
);
