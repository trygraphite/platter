import { MenuPage } from "@/components/order-menu-page/menuPage";
import type { Params } from "@/types/pages";
import type { RestaurantDetails, MenuCategory } from "@/types/menu";
import db from "@platter/db";
import { notFound } from "next/navigation";

export default async function Page({ params }: { params: Params }) {
  const { qrId, domain } = await params;

  const restaurant = await db.user.findUnique({
    where: {
      subdomain: domain,
    },
    select: {
      name: true,
      description: true,
      image: true,
      cuisine: true,
      openingHours: true,
      closingHours: true,
      categories: {
        where: {
          isActive: true,
        },
        select: {
          id: true,
          name: true,
          menuItems: {
            where: {
              isAvailable: true,
            },
            select: {
              id: true,
              name: true,
              description: true,
              price: true,
              image: true,
              isAvailable: true,
            },
          },
        },
      },
    },
  });

  if (!restaurant) {
    return notFound();
  }

  const { categories, ...restaurantDetails } = restaurant;

  return (
    <MenuPage
      qrId={qrId}
      categories={categories as MenuCategory[]}
      restaurantDetails={restaurantDetails as RestaurantDetails}
    />
  );
}
