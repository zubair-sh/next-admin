/* eslint-disable @typescript-eslint/no-explicit-any */
// src/utils/withAuth.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "../supabase/server";
import { IUser } from "@/features/users/types";

export interface Request extends NextRequest {
  user: IUser;
  params?: Record<string, string>;
  query?: Record<string, string>;
  data?: any;
}

type Handler = (
  req: Request,
  context: { params: Record<string, string> },
) => Promise<NextResponse>;

export function guardAuth(handler: Handler) {
  return async function (
    req: NextRequest,
    context: { params: Record<string, string> },
  ) {
    // 1. Retrieve the session. If none or not valid, return 401.
    const supabase = await createClient();
    const {
      data: { user: supabaseUser },
    } = await supabase.auth.getUser();

    if (!supabaseUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // 2. Fetch full user details from database including role and permissions
    const { default: prisma } = await import("@/lib/prisma");
    const dbUser = await prisma.user.findUnique({
      where: { id: supabaseUser.id },
      include: {
        role: {
          include: {
            permissions: true,
          },
        },
      },
    });

    if (!dbUser) {
      return NextResponse.json({ message: "User not found" }, { status: 401 });
    }

    // 3. Attach the user onto req
    const authReq = req as Request;
    authReq.user = dbUser;

    // 4. Call the real handler
    return handler(authReq, context);
  };
}
