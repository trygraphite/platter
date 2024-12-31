import RestaurantHero from "@/components/sections/restaurant-hero";
import Container from "@/components/shared/container";
import db from "@platter/db";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import React from "react";

const getRestaurantMetadata = async (params: string) => {
  const metadata = await db.user.findUnique({
    where: {
      subdomain: params,
    },
    select: {
      name: true,
      description: true,
    },
  });
  return metadata;
};

export async function generateMetadata({
  params,
}: { params: Promise<{ domain: string }> }): Promise<Metadata> {
  const { domain } = await params;
  const data = await getRestaurantMetadata(domain);
  return {
    title: data?.name,
    description: data?.description,
  };
}

async function Page({ params }: { params: Promise<{ domain: string }> }) {
  const domain = await params;
  const { domain: domainName } = domain;
  const restaurantDetails = await db.user.findUnique({
    where: {
      subdomain: domainName,
    },
    select: {
      name: true,
      description: true,
      cuisine: true,
      openingHours: true,
      closingHours: true,
    },
  });

  if (!restaurantDetails) {
    return notFound();
  }

  return (
    <div>
      <RestaurantHero name={restaurantDetails.name} description={restaurantDetails.description} />
    </div>
  );
}

export default Page;
