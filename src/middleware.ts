import { NextRequest, NextResponse } from "next/server";

const AUTH_ROUTE = "/auth/sign-in";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cookie = request.cookies.get("refreshToken");
  const token = cookie?.value;

  if (token) {
    const payload = decodeJwtPayload(token);
    // if token is expired redirect to login
    if (payload.exp < Date.now() / 1000) {
      return redirectToLogin(request);
    }

    if (pathname === AUTH_ROUTE) {
      return NextResponse.redirect(new URL("/", request.url));
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

// Helper function to decode payload. used for decode to public data. not for verification
function decodeJwtPayload(token: string) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => `%${("00" + c.charCodeAt(0).toString(16)).slice(-2)}`)
        .join("")
    );

    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Invalid token format", e);
    return null;
  }
}

export const config = {
  matcher: [
    // "/((?!_next/static|_next/image|favicon.ico|api/auth|.*\\..*$).*)",
    "/((?!_next/static|_next/image|favicon.ico|api/auth|auth/|.*\\..*$).*)",
  ],
};
