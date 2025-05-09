// pages/[domain]/page.tsx

import { ActionButtons } from "@/components/sections/Actionbtns";
import { QrCodeSection } from "@/components/sections/Qrcode";
import { RestaurantHero } from "@/components/sections/restaurant-hero";
import Header from "@/components/shared/header";
import type { Params } from "@/types/pages";
import db from "@platter/db";
import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";

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
      googleReviewLink: true
    },
  });
  return metadata;
};

export async function generateMetadata(
  { params }: { params: Params }): Promise<Metadata> {
  const domain = (await params).domain;
  
  if (!domain) {
    return {
      title: "PlatterNG",
      description: "Food ordering platform",
    };
  }
  
  let userData;
  
  try {
    userData = await getRestaurantMetadata(domain);
  } catch (error) {
    // Error handling remains but without logging
  }
  
  const name = userData?.name || 'Restaurant';
  const logo = userData?.icon || userData?.image;
  const description = userData?.description || `Order food, track your meal, and leave reviews at ${name}.`;
  
  // Base URL construction
  const baseUrl = process.env.NODE_ENV === 'production' 
    ? `https://${domain}.${process.env.BASE_DOMAIN || 'platterng.com'}`
    : `http://${domain}.localhost:3001`;
  
  // Generate the Open Graph image URL
  const ogImageUrl = `${process.env.NODE_ENV === 'production' 
    ? `https://${process.env.BASE_DOMAIN || 'platterng.com'}`
    : 'http://localhost:3001'}/og-image.jpg`;
  
  const metadata: Metadata = {
    title: {
      default: `${name} | PlatterNG`,
      template: `%s | ${name} - PlatterNG`,
    },
    description,
    keywords: ['restaurant', 'food ordering', 'dining', name, 'menu', 'reviews', userData?.cuisine].filter(Boolean),
    authors: [{ name: 'PlatterNG' }],
    metadataBase: new URL(baseUrl),
    themeColor: '#000000',
    icons: {
      icon: logo || '/favicon.ico',
      apple: logo || '/apple-icon.png',
    },
    openGraph: {
      type: 'website',
      locale: 'en_US',
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
      card: 'summary_large_image',
      title: `${name} | PlatterNG`,
      description,
      images: [ogImageUrl],
      creator: '@platterng',
    },
  };

  return metadata;
}

async function Page({ params }: { params: Params }) {
    const domain = await params;
  const { domain: domainName } = domain;
  
  const restaurantDetails = await db.user.findUnique({
    where: {
      subdomain: domainName,
    },
    select: {
      name: true,
      description: true,
      image: true,
      cuisine: true,
      openingHours: true,
      closingHours: true,
      googleReviewLink: true,
    },
  });

  if (!restaurantDetails) {
    return notFound();
  }

  return (
    <section className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <Header restaurantName={restaurantDetails.name} reviewLink={restaurantDetails.googleReviewLink} />
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col items-center text-center space-y-8">
          <RestaurantHero
            name={restaurantDetails.name}
            description={restaurantDetails.description}
            logo={restaurantDetails.image}
          />
          <ActionButtons reviewLink={restaurantDetails.googleReviewLink} />
          <QrCodeSection />
        </div>
      </div>
    </section>
  );
}

export default Page;