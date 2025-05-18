export const siteConfig = {
  name: "PlatterNG",
  description:
    "PlatterNG is a QR-based ordering system built for in-dining restaurants in Nigeria.",
  url: "https://www.platterng.com",
  ogImage: "https://www.platterng.com/og-image.jpg",
  links: {
    twitter: "@platterng",
    github: "https://github.com/platterng",
    linkedin: "https://linkedin.com/company/platterng",
    facebook: "https://facebook.com/platterng",
  },
  mainNav: [
    { title: "Home", href: "/" },
    { title: "Features", href: "/features" },
    { title: "Pricing", href: "/pricing" },
    { title: "FAQ", href: "/faq" },
    { title: "Demo", href: "/demo" },
    { title: "Terms & Conditions", href: "/terms" },
    { title: "Contact", href: "/contact" },
  ],
  features: [
    {
      title: "Order by QR Code",
      description: "Let customers scan, browse menus, and order from their seats.",
    },
    {
      title: "Built for Local Restaurants",
      description: "Tailored to Nigerian restaurant operations with simple setup and support.",
    },
    {
      title: "End-to-End Experience",
      description: "Handle orders, feedback, complaints, and payments from one platform.",
    },
    {
      title: "Instant Setup",
      description: "Get started in minutes with our onboarding tool and pricing plans.",
    },
  ],
  contact: {
    email: "support@platterng.com",
    phone: "+234 81 4911 3328",
    address: "Abuja, Nigeria",
  },
  creator: "PlatterNG Team",
  keywords: [
    "qr code ordering",
    "restaurant qr code",
    "digital menu nigeria",
    "contactless ordering",
    "restaurant app nigeria",
    "restaurant management system",
    "nigerian restaurants",
    "restaurant ordering system",
    "restaurant qr ordering"
  ],
  metaDescription: "PlatterNG is a QR-based ordering system built for in-dining restaurants in Nigeria. Improve service speed, reduce manual order-taking, and give guests an amazing experience from their phones.",
  defaultTitle: "PlatterNG - QR Ordering System for Nigerian Restaurants"
}

export type SiteConfig = typeof siteConfig;