import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type { Session } from "./lib/auth/types";

export async function middleware(request: NextRequest) {
  const sessionRes = await fetch(
    `${request.nextUrl.origin}/api/auth/get-session`,
    {
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
    },
  );

  const session: Session = sessionRes.ok ? await sessionRes.json() : null;

  const path = request.nextUrl.pathname;
  const isPublicRoute =
    path.startsWith("/login") || path.startsWith("/register");

  // Not logged in, redirect to login except for public routes
  if (!session) {
    if (isPublicRoute) return NextResponse.next();

    const callbackUrl = encodeURIComponent(request.nextUrl.pathname);
    return NextResponse.redirect(
      new URL(`/login?from=${callbackUrl}`, request.url),
    );
  }

  // Logged in but not verified, force verify except on verify page
  if (!session.user.emailVerified && path !== "/verify") {
    return NextResponse.redirect(new URL("/verify", request.url));
  }

  // Prevent accessing public routes or verify page when logged in and verified
  if (isPublicRoute || (session.user.emailVerified && path === "/verify")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|static|.*\\..*|_next/static|_next/image|favicon.ico).*)"],
};
