// pages/[domain]/page.tsx

import { RestaurantPageContent } from "@/components/sections/restaurant-page-content";
import type { Params } from "@/types/pages";
import db from "@platter/db";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

// Type definitions for database query results
type CategoryWithMenuItems = {
  name: string;
  menuItems: Array<{
    id: string;
    name: string;
    description: string;
    price: number;
    image: string | null;
    varieties: Array<{
      id: string;
      name: string;
      price: number;
    }>;
  }>;
};

const getRestaurantMetadata = async (domain: string) => {
  const metadata = await db.user.findUnique({
    where: {
      subdomain: domain,
    },
    select: {
      id: true,
      name: true,
      description: true,
      image: true,
      icon: true,
      cuisine: true,
      openingHours: true,
      closingHours: true,
      address: true,
      city: true,
      state: true,
      zipCode: true,
      phone: true,
      website: true,
      googleReviewLink: true,
    },
  });
  return metadata;
};

export async function generateMetadata({
  params,
}: { params: Params }): Promise<Metadata> {
  const domain = (await params).domain;

  if (!domain) {
    return {
      title: "PlatterNG",
      description: "Food ordering platform",
    };
  }

  let userData: Awaited<ReturnType<typeof getRestaurantMetadata>>;

  try {
    userData = await getRestaurantMetadata(domain);
  } catch (error) {
    // Error handling remains but without logging
  }

  const name = userData?.name || "Restaurant";
  const logo = userData?.icon || userData?.image;
  const description =
    userData?.description ||
    `Order food, track your meal, and leave reviews at ${name}.`;

  // Base URL construction
  const baseUrl =
    process.env.NODE_ENV === "production"
      ? `https://${domain}.${process.env.BASE_DOMAIN || "platterng.com"}`
      : `http://${domain}.localhost:3001`;

  // Generate the Open Graph image URL
  const ogImageUrl = `${
    process.env.NODE_ENV === "production"
      ? `https://${process.env.BASE_DOMAIN || "platterng.com"}`
      : "http://localhost:3001"
  }/og-image.jpg`;

  const metadata: Metadata = {
    title: {
      default: `${name} | PlatterNG`,
      template: `%s | ${name} - PlatterNG`,
    },
    description,
    keywords: [
      "restaurant",
      "food ordering",
      "dining",
      name,
      "menu",
      "reviews",
      userData?.cuisine,
    ].filter(Boolean),
    authors: [{ name: "PlatterNG" }],
    metadataBase: new URL(baseUrl),
    themeColor: "#000000",
    icons: {
      icon: logo || "/favicon.ico",
      apple: logo || "/apple-icon.png",
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: baseUrl,
      title: `${name} | PlatterNG`,
      description,
      siteName: `${name} on PlatterNG`,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${name} - PlatterNG`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${name} | PlatterNG`,
      description,
      images: [ogImageUrl],
      creator: "@platterng",
    },
  };

  return metadata;
}

async function Page({ params }: { params: Params }): Promise<JSX.Element> {
  const domain = await params;
  const { domain: domainName } = domain;

  const restaurantDetails = await db.user.findUnique({
    where: {
      subdomain: domainName,
    },
    select: {
      id: true,
      name: true,
      description: true,
      image: true,
      icon: true,
      cuisine: true,
      openingHours: true,
      closingHours: true,
      googleReviewLink: true,
      address: true,
      city: true,
      state: true,
      zipCode: true,
      phone: true,
      website: true,
    },
  });

  if (!restaurantDetails) {
    return notFound();
  }

  // Fetch menu data
  const categories = await db.category.findMany({
    where: {
      userId: restaurantDetails.id,
      isActive: true,
      deletedAt: null,
    },
    include: {
      menuItems: {
        where: {
          isAvailable: true,
          deletedAt: null,
        },
        include: {
          varieties: {
            where: {
              isAvailable: true,
              deletedAt: null,
            },
            orderBy: [
              { isDefault: "desc" },
              { position: "asc" },
              { name: "asc" },
            ],
          },
        },
        orderBy: { position: "asc" },
      },
    },
    orderBy: { position: "asc" },
  });

  // Transform the data to match the expected format
  const menuData = {
    categories: categories.map((category: CategoryWithMenuItems) => ({
      name: category.name,
      items: category.menuItems.map((item) => ({
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.price,
        image: item.image,
        category: category.name,
        popular: false, // You can add a popular field to the database if needed
        varieties: item.varieties.map((variety) => ({
          id: variety.id,
          name: variety.name,
          price: variety.price,
        })),
      })),
    })),
  };

  return (
    <RestaurantPageContent
      restaurantDetails={restaurantDetails}
      menuData={menuData}
    />
  );
}

export default Page;
