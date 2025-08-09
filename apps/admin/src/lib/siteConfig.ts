export const siteConfig = {
  name: "PlatterNG Admin",
  description:
    "Admin dashboard for restaurant owners. Manage orders, menu, staff, and more.",
  url: "https://admin.platterng.com",
  ogImage: "https://admin.platterng.com/og-image.jpg",
  links: {
    docs: "https://platterng.com/faq",
    landing: "https://www.platterng.com",
  },
  mainNav: [
    { title: "Dashboard", href: "/dashboard" },
    { title: "Orders", href: "/orders" },
    { title: "Menu", href: "/menu" },
    { title: "QR Codes", href: "/qr" },
    { title: "Reviews", href: "/reviews" },
    { title: "Complaints", href: "/complaints" },
    { title: "Staff", href: "/staff" },
    { title: "Settings", href: "/settings" },
    { title: "Pricing", href: "/pricing" },
  ],
  permissions: {
    admin: [
      "view_all",
      "manage_orders",
      "edit_menu",
      "generate_qr",
      "manage_staff",
      "delete_reviews",
      "view_analytics",
    ],
    staff: ["manage_orders", "generate_qr"],
  },
  support: {
    email: "admin-support@platterng.com",
  },
};

export type SiteConfig = typeof siteConfig;
