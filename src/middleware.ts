import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Auth-page bounce only. Protected-route gating is handled client-side by
// the dashboard/admin layouts via AuthContext, because the refresh_token
// cookie is HttpOnly + SameSite and is not always visible to middleware on
// RSC navigations — which previously caused authenticated users to get
// bounced back to /login in an infinite loop.
const AUTH_PAGES = ["/login", "/register"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasRefreshToken = request.cookies.has("refresh_token");

  const isAuthPage = AUTH_PAGES.some((route) => pathname === route);
  if (isAuthPage && hasRefreshToken) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/register"],
};
