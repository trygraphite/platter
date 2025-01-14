import { type NextRequest, NextResponse } from "next/server";
import { readSiteDomain } from "./utils/actions/read-site-domain";

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = req.headers.get("host");
  const pathname = url.pathname;

  // Skip middleware for API routes
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Extract subdomain
  const currentHost =
    process.env.NODE_ENV === "production"
      ? hostname?.replace(`.${process.env.BASE_DOMAIN}`, "")
      : (hostname?.split(":")[0]?.replace(".localhost", "") ?? "");

  // Special handling for root domain or www
  if (!currentHost || currentHost === "www" || currentHost === "app") {
    return NextResponse.redirect(
      new URL(`https://${process.env.MARKETING_DOMAIN}`),
    );
  }

  // Verify the subdomain exists
  const response = await readSiteDomain(currentHost);

  // If no matching domain is found, redirect to marketing site
  if (!response || response === null) {
    return NextResponse.redirect(
      new URL(`https://${process.env.MARKETING_DOMAIN}`),
    );
  }

  const site_subdomain = response.subdomain;

  // Rewrite to the dynamic route
  return NextResponse.rewrite(
    new URL(`/${site_subdomain}${pathname}`, req.url),
  );
}

export const config = {
  matcher: [
    // Skip api routes, public files, and next internal routes
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};