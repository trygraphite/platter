import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type { Session } from "./lib/auth/types";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const publicRoutes = ["/login", "/register"];

  const isPublicRoute = publicRoutes.some((route) => path.startsWith(route));
  const isOnboardingRoute = path.startsWith("/onboarding");
  const isVerifyRoute = path === "/verify";

  let session: Session | null = null;

  try {
    const sessionRes = await fetch(
      `${request.nextUrl.origin}/api/auth/get-session`,
      {
        headers: {
          cookie: request.headers.get("cookie") || "",
        },
        signal: AbortSignal.timeout(5000),
      },
    );
    session = sessionRes.ok ? await sessionRes.json() : null;
  } catch (error) {
    console.error("Middleware - Session fetch error:", error);
    if (!isPublicRoute) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }

  if (!session) {
    if (isPublicRoute) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (!session.user.emailVerified) {
    if (isVerifyRoute || isPublicRoute) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/verify", request.url));
  }

  if (session.user.emailVerified && !session.user.hasCompletedOnboarding) {
    if (isOnboardingRoute || isPublicRoute) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/onboarding", request.url));
  }

  if (session.user.emailVerified && session.user.hasCompletedOnboarding) {
    if (isOnboardingRoute || isVerifyRoute || isPublicRoute) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|static|.*\\..*|_next/static|_next/image|favicon.ico).*)"],
};
