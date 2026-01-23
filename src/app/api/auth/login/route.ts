import { requestHandler, validate } from "@/lib/api-middlewares";
import { AuthService } from "@/features/auth/services";
import { NextResponse } from "next/server";
import { loginRequestSchema } from "@/features/auth/schemas";
import { rateLimit } from "@/lib/rate-limit";

// Rate limiter: 5 requests per 5 minutes
const limiter = rateLimit({
  interval: 5 * 60 * 1000,
  uniqueTokenPerInterval: 500,
});

export const POST = requestHandler(
  validate(loginRequestSchema, async (req) => {
    try {
      // Basic rate limiting based on IP (or fall back to generic 'global')
      const ip = req.headers.get("x-forwarded-for") ?? "global";
      try {
        await limiter.check(5, ip);
      } catch {
        return NextResponse.json(
          { message: "Too many requests, try again after 5 minutes" },
          { status: 429 },
        );
      }

      const result = await AuthService.login(req.data);
      return NextResponse.json(result, { status: 200 });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
  }),
);
