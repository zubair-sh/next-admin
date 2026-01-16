import {
  PUBLIC_ROUTES,
  AUTH_ROUTES,
  ROUTES,
  PUBLIC_API_ROUTES,
} from "@/lib/constants";
import { updateSession } from "@/lib/supabase/proxy";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const user = await updateSession(request);

  const token = request.cookies.get("accessToken")?.value;

  const isAuthenticated = !!token || user;

  const isPublicRoute = PUBLIC_ROUTES.some((route) =>
    route === "/"
      ? request.nextUrl.pathname === "/"
      : request.nextUrl.pathname.startsWith(route)
  );

  const isApiRoute = request.nextUrl.pathname.startsWith("/api");
  const isPublicApiRoute = PUBLIC_API_ROUTES.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  if (isApiRoute) {
    if (!isPublicApiRoute && !isAuthenticated) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.next();
  }

  const isAuthRoute = AUTH_ROUTES.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  if (isAuthenticated && isAuthRoute) {
    const url = request.nextUrl.clone();
    url.pathname = ROUTES.DASHBOARD;
    return NextResponse.redirect(url);
  }

  if (!isAuthenticated && !isPublicRoute && !isAuthRoute) {
    const url = request.nextUrl.clone();
    url.pathname = ROUTES.LOGIN;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
