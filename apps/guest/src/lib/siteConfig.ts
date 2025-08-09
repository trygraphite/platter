// src/config/site.ts
import { readSiteDomain } from "@/utils/actions/read-site-domain";

export type SiteConfig = {
  name: string;
  restaurantName?: string;
  subdomain: string;
  description: string;
  url: string;
  ogImage: string;
  themeColor?: string;
  logoUrl?: string;
  links: {
    landing: string;
  };
  mainNav: Array<{
    title: string;
    href: string;
  }>;
  features: Array<{
    title: string;
    description: string;
  }>;
  contact: {
    supportNote: string;
    phone?: string;
    email?: string;
  };
};

// Default configuration
const defaultConfig: SiteConfig = {
  name: "PlatterNG",
  subdomain: "app",
  description:
    "PlatterNG The Future of Dining. Order, track, and review your meals with ease.",
  url: "https://guest.platterng.com",
  ogImage: "https://guest.platterng.com/og-image.jpg",
  links: {
    landing: "https://www.platterng.com",
  },
  mainNav: [
    { title: "Home", href: "/" },
    { title: "Menu", href: "/menu" },
    { title: "Order Status", href: "/status" },
    { title: "Leave Review", href: "/review" },
    { title: "File Complaint", href: "/complaint" },
    { title: "Call Waiter", href: "/call" },
  ],
  features: [
    {
      title: "Table-Based Ordering",
      description:
        "Orders are linked to the specific table guests are seated at.",
    },
    {
      title: "Live Order Status",
      description: "Track your meal's progress from kitchen to table.",
    },
    {
      title: "No App Install Needed",
      description: "Just scan and interact through your browser.",
    },
    {
      title: "Feedback Options",
      description:
        "Help the restaurant improve with food reviews and complaints.",
    },
  ],
  contact: {
    supportNote:
      "For order issues, please contact a restaurant staff member directly.",
  },
};

// Get current host from URL in client components
export function getSubdomainFromUrl(): string | null {
  if (typeof window === "undefined") return null;

  const hostname = window.location.hostname;

  // Local development
  if (hostname.includes("localhost")) {
    const subdomain = hostname.split(".")[0];
    return subdomain === "localhost" ? null : subdomain || null;
  }

  // Production with custom domain
  const baseDomain = process.env.NEXT_PUBLIC_BASE_DOMAIN || "platterng.com";
  return hostname.replace(`.${baseDomain}`, "");
}

// Server-side function to get site config
export async function getSiteConfig(subdomain?: string): Promise<SiteConfig> {
  try {
    if (!subdomain) {
      return defaultConfig;
    }

    // Fetch restaurant data from database
    const siteData = await readSiteDomain(subdomain);

    if (!siteData) {
      return defaultConfig;
    }

    // Create dynamic site config
    return {
      ...defaultConfig,
      subdomain: subdomain,
      name: `${siteData.name} | PlatterNG`,
      restaurantName: siteData.name,
      description: `Order food, track your meal, and leave reviews at ${siteData.name}.`,
      url:
        process.env.NODE_ENV === "production"
          ? `https://${subdomain}.${process.env.NEXT_PUBLIC_BASE_DOMAIN}`
          : `http://${subdomain}.localhost:3000`,
      ogImage: `/api/og?restaurant=${encodeURIComponent(siteData.name)}`,
      themeColor: siteData.themeColor || "#000000",
      logoUrl: siteData.logoUrl,
      contact: {
        ...defaultConfig.contact,
        phone: siteData.contactPhone,
        email: siteData.contactEmail,
      },
    };
  } catch (error) {
    console.error("Error fetching site configuration:", error);
    return defaultConfig;
  }
}

// This is used as the default export for backward compatibility
export const siteConfig = defaultConfig;
