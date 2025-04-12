import { NextRequest, NextResponse } from "next/server";
import { decodeJwtPayload } from "./utils/helper";

const AUTH_ROUTE = "/auth/sign-in";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cookie = request.cookies.get("refreshToken");
  const token = cookie?.value;

  if (token) {
    const {exp, role} = decodeJwtPayload(token);
    // if token is expired redirect to login
    if (exp < Date.now() / 1000) {
      return redirectToLogin(request);
    }

    if (pathname === AUTH_ROUTE) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    if(role !== "super_admin" && pathname === "/dashboard/users") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
  }

  return redirectToLogin(request);
}

// Helper function to redirect to login
function redirectToLogin(request: NextRequest) {
  const loginUrl = new URL(AUTH_ROUTE, request.url);
  loginUrl.searchParams.set("from", request.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    // "/((?!_next/static|_next/image|favicon.ico|api/auth|.*\\..*$).*)",
    "/((?!_next/static|_next/image|favicon.ico|api/auth|auth/|.*\\..*$).*)",
  ],
};
