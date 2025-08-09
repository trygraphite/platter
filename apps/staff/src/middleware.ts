import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if user is authenticated
  const hasSession = request.cookies.has("staff-session");

  // Public routes that don't require authentication
  const publicRoutes = ["/login"];
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route),
  );

  // If user is not authenticated and trying to access protected route
  if (!hasSession && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If user is authenticated and trying to access login page
  if (hasSession && isPublicRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
