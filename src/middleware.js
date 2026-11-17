import { NextResponse } from "next/server";

export function middleware(request) {
  const session = request.cookies.get("meow_session");
  const { pathname } = request.nextUrl;

  if (!session && pathname !== "/login" && !pathname.startsWith("/api/auth")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};