import { type NextRequest, NextResponse } from "next/server";
import { readSiteDomain } from "./utils/actions/read-site-domain";

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = req.headers.get("host");
  const pathname = url.pathname;

  // Skip middleware for API routes
  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  // Log hostname for debugging
  console.log("Hostname:", hostname);

  // Extract subdomain
  let currentHost = null;

  if (process.env.NODE_ENV === "production") {
    // Handle Vercel preview deployments
    if (hostname?.includes(".vercel.app")) {
      // Split the hostname into parts
      const parts = hostname.split(".");
      if (parts.length >= 3) {
        // Extract the subdomain (e.g., "the-grill" from "the-grill.platter-guest-two.vercel.app")
        currentHost = parts[0];
      } else {
        // Handle cases where there is no subdomain (e.g., "platter-guest-two.vercel.app")
        currentHost = null;
      }
    } else {
      // Handle custom domain or traditional subdomains
      currentHost = hostname?.replace(`.${process.env.BASE_DOMAIN}`, "");
    }
  } else {
    // Local development
    currentHost = hostname?.split(":")[0]?.replace(".localhost", "") ?? "";
  }

  // Log currentHost for debugging
  console.log("Current Host:", currentHost);

  // Special handling for root domain or www
  if (!currentHost || currentHost === "www" || currentHost === "app") {
    return NextResponse.redirect(
      new URL(`https://${process.env.MARKETING_DOMAIN}`),
    );
  }

  try {
    // Verify the subdomain exists
    const response = await readSiteDomain(currentHost);

    // Log response for debugging
    console.log("Response from readSiteDomain:", response);

    // If no matching domain is found, redirect to marketing site
    if (!response) {
      return NextResponse.redirect(
        new URL(`https://${process.env.MARKETING_DOMAIN}`),
      );
    }

    const site_subdomain = response.subdomain;

    // Rewrite to the dynamic route
    return NextResponse.rewrite(
      new URL(`/${site_subdomain}${pathname}`, req.url),
    );
  } catch (error) {
    console.error("Middleware error:", error);
    return NextResponse.redirect(
      new URL(`https://${process.env.MARKETING_DOMAIN}`),
    );
  }
}

export const config = {
  matcher: [
    // Skip api routes, public files, and next internal routes
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};
