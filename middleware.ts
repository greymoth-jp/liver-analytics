import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED = ["/dashboard", "/livers", "/payouts", "/import", "/settings", "/reports"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const requiresAuth = PROTECTED.some((p) => pathname.startsWith(p));
  if (requiresAuth) {
    const session = request.cookies.get("better-auth.session_token");
    if (!session) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/livers/:path*",
    "/payouts/:path*",
    "/import/:path*",
    "/settings/:path*",
    "/reports/:path*",
    "/api/auth/:path*",
    "/api/stripe/webhook",
  ],
};
