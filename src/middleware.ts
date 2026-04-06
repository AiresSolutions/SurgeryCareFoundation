import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_ROUTES = ["/dashboard", "/fundraiser", "/admin", "/moderator", "/finance"];
const AUTH_PAGES = ["/login", "/register"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasRefreshToken = request.cookies.has("refresh_token");

  // Redirect unauthenticated users away from protected routes
  const isProtected = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));
  if (isProtected && !hasRefreshToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users away from auth pages
  const isAuthPage = AUTH_PAGES.some((route) => pathname === route);
  if (isAuthPage && hasRefreshToken) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/fundraiser/:path*",
    "/admin/:path*",
    "/moderator/:path*",
    "/finance/:path*",
    "/login",
    "/register",
  ],
};
