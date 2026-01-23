import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import { IUser } from "@/features/users/types";

export interface Request extends NextRequest {
  user?: IUser;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  query?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params?: any;
}

interface Schemas {
  params?: z.ZodSchema;
  query?: z.ZodSchema;
  body?: z.ZodSchema;
}

type Handler = (
  req: Request,
  context: { params: Record<string, string> },
) => Promise<NextResponse>;

export function validate(schemas: Schemas, handler: Handler) {
  return async function (
    req: Request,
    context: { params: Record<string, string> },
  ) {
    const {
      params: paramSchema,
      query: querySchema,
      body: bodySchema,
    } = schemas;

    if (paramSchema) {
      const result = paramSchema.safeParse(req.params);

      if (!result.success) {
        return NextResponse.json(
          { message: result.error.errors[0].message },
          { status: 400 },
        );
      }
      req.params = result.data;
    }

    if (querySchema) {
      const result = querySchema.safeParse(req.query);

      if (!result.success) {
        return NextResponse.json(
          { message: result.error.errors[0].message },
          { status: 400 },
        );
      }
      req.query = result.data;
    }

    if (bodySchema && ["POST", "PUT", "PATCH"].includes(req.method)) {
      try {
        const result = bodySchema.safeParse(req.data);

        if (!result.success) {
          return NextResponse.json(
            { message: result.error.errors[0].message },
            { status: 400 },
          );
        }
        req.data = result.data;
      } catch {
        return NextResponse.json(
          { message: "Invalid JSON body" },
          { status: 400 },
        );
      }
    }

    return handler(req, context);
  };
}
