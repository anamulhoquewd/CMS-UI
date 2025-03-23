import { getStorage } from "@/store/local";
import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const accessToken = getStorage("accessToken");

  if (!accessToken ) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
//   matcher: ["/dashboard/:path*", "/profile/:path*"], // Protected Routes
  matcher: ["/"], // Protected Routes
};
