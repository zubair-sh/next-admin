import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AuthKeys, AppRoutes } from "./config/constants";

export function middleware(request: NextRequest) {
  const isAuthenticated =
    request.cookies.get(AuthKeys.isAuthenticated)?.value === "true";
  const { pathname } = request.nextUrl;

  // Define paths
  const authRoutes = [
    AppRoutes.LOGIN,
    AppRoutes.SIGN_UP,
    AppRoutes.FORGOT_PASSWORD,
    AppRoutes.RESET_PASSWORD,
  ];
  const protectedRoutes = [AppRoutes.HOME]; // Add other protected roots here

  // 1. Redirect unauthenticated users trying to access protected routes
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );
  if (isProtectedRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL(AppRoutes.LOGIN, request.url));
  }

  // 2. Redirect authenticated users trying to access auth routes
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL(AppRoutes.HOME, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
