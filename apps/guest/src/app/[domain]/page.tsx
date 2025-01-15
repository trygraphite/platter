// pages/[domain]/page.tsx

import { ActionButtons } from "@/components/sections/Actionbtns";
import { QrCodeSection } from "@/components/sections/Qrcode";
import { RestaurantHero } from "@/components/sections/restaurant-hero";
import Header from "@/components/shared/header";
import type { Params } from "@/types/pages";
import db from "@platter/db";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

const getRestaurantMetadata = async (params: string) => {
  const metadata = await db.user.findUnique({
    where: {
      subdomain: params,
    },
    select: {
      name: true,
      description: true,
      image: true,
      cuisine: true,
      openingHours: true,
      closingHours: true,
    },
  });
  return metadata;
};

export async function generateMetadata({
  params,
}: { params: Params }): Promise<Metadata> {
  const { domain } = await params;
  const data = await getRestaurantMetadata(domain);
  return {
    title: data?.name,
    description: data?.description,
  };
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
      // add google maps review link
    },
  });

  if (!restaurantDetails) {
    return notFound();
  }

  return (
    <section className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <Header restaurantName={restaurantDetails.name} reviewLink="" />
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col items-center text-center space-y-8">
          <RestaurantHero
            name={restaurantDetails.name}
            description={restaurantDetails.description}
            logo={restaurantDetails.image}

            // pass google maps review link
          />
          <ActionButtons reviewLink="" />
          <QrCodeSection />
        </div>
      </div>
    </section>
  );
}

export default Page;
