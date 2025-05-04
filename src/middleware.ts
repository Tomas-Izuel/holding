import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AUTH_TOKEN } from "./types/common";

export function middleware(request: NextRequest) {
  const authToken = request.cookies.get(AUTH_TOKEN);

  if (!authToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
