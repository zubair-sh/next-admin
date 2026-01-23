/* eslint-disable @typescript-eslint/no-explicit-any */
// src/utils/requestHandler.ts
import type { NextRequest } from "next/server";

type Request = NextRequest & {
  params?: Record<string, string>;
  query?: Record<string, string>;
  data?: any;
};

export function requestHandler(
  handler: (
    req: Request,
    context: { params: Record<string, string> },
  ) => Promise<Response>,
) {
  return async function (
    req: NextRequest,
    context: { params: Promise<Record<string, string>> },
  ) {
    const extendedReq = req as Request;

    // 1) Attach route params:
    const params = await context.params;
    extendedReq.params = params || {};

    // 2) Build `req.query` from the URL's search params
    const url = new URL(req.url);
    const queryObj: Record<string, string> = {};

    url.searchParams.forEach((value, key) => {
      queryObj[key] = value;
    });
    extendedReq.query = queryObj;

    // 3) Parse JSON body if method is POST / PUT / PATCH
    const method = req.method.toUpperCase();

    if (["POST", "PUT", "PATCH"].includes(method)) {
      try {
        // NextRequest.json() will throw if there is no valid JSON
        extendedReq.data = await req.json();
      } catch {
        // Body might be empty, which is fine.
        extendedReq.data = {};
      }
    }

    // Finally, call the real handler with our extended request
    return handler(extendedReq, { params });
  };
}
