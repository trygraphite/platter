import { type NextRequest, NextResponse } from "next/server";

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = req.headers.get("host");
  const pathname = url.pathname;

  // Skip middleware for API routes and location routes
  if (pathname.startsWith("/api/") || pathname.startsWith("/location/")) {
    return NextResponse.next();
  }

  // Extract subdomain
  let currentHost = null;

  if (process.env.NODE_ENV === "production") {
    if (hostname?.includes(".vercel.app")) {
      const parts = hostname.split(".");
      if (parts.length >= 3) {
        currentHost = parts[0];
      } else {
        currentHost = null;
      }
    } else {
      currentHost = hostname?.replace(`.${process.env.BASE_DOMAIN}`, "");
    }
  } else {
    currentHost = hostname?.split(":")[0]?.replace(".localhost", "") ?? "";
  }

  // Special handling for root domain or www
  if (!currentHost || currentHost === "www" || currentHost === "app") {
    return NextResponse.redirect(
      new URL(`https://${process.env.MARKETING_DOMAIN}`),
    );
  }

  // Instead of checking database here, just rewrite to the dynamic route
  // Let the page component handle the database validation and 404s
  return NextResponse.rewrite(new URL(`/${currentHost}${pathname}`, req.url));
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
