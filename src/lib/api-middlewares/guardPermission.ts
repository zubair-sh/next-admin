import { NextResponse } from "next/server";
import { checkPermission } from "@/lib/utils/permissions-server";
import { Request } from "./guardAuth";

// Define Handler type locally or import if available
type Handler = (
  req: Request,
  context: { params: Record<string, string> },
) => Promise<NextResponse>;

export function guardPermission(permission: string) {
  return function (handler: Handler) {
    return async function (
      req: Request,
      context: { params: Record<string, string> },
    ) {
      // guardAuth ensures user is populated
      const user = req.user;

      if (!user) {
        // Should catch cases where guardAuth wasn't used, but guardAuth handles 401.
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
      }

      if (!checkPermission(user, permission)) {
        return NextResponse.json({ message: "Forbidden" }, { status: 403 });
      }

      return handler(req, context);
    };
  };
}
