import db from "@platter/db";
import { notFound } from "next/navigation";
import { MenuPage } from "@/components/order-menu-page/menuPage";
import type {
  CategoryGroup,
  MenuCategory,
  RestaurantDetails,
} from "@/types/menu";
import type { Params } from "@/types/pages";

export default async function Page({
  params,
}: {
  params: Params;
}): Promise<JSX.Element> {
  const { qrId, domain } = await params;

  // Get restaurant details
  const restaurant = await db.user.findUnique({
    where: {
      subdomain: domain,
    },
    select: {
      id: true,
      name: true,
      description: true,
      image: true,
      cuisine: true,
      openingHours: true,
      closingHours: true,
    },
  });

  if (!restaurant) {
    return notFound();
  }

  // Get category groups specific to this user
  const categoryGroups = await db.categoryGroup.findMany({
    where: {
      userId: restaurant.id,
      isActive: true,
    },
    orderBy: { position: "asc" },
    select: {
      id: true,
      name: true,
      description: true,
      position: true,
    },
  });

  // Get all categories for this user
  const categories = await db.category.findMany({
    where: {
      userId: restaurant.id,
      isActive: true,
    },
    select: {
      id: true,
      name: true,
      groupId: true,
      position: true,
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
          position: true,
          varieties: {
            where: {
              isAvailable: true,
            },
            select: {
              id: true,
              name: true,
              description: true,
              price: true,
              position: true,
              isAvailable: true,
              isDefault: true,
            },
            orderBy: { position: "asc" },
          },
        },
        orderBy: { position: "asc" },
      },
    },
    orderBy: { position: "asc" },
  });

  const { id, ...restaurantDetails } = restaurant;

  return (
    <MenuPage
      qrId={qrId}
      categories={categories as MenuCategory[]}
      categoryGroups={categoryGroups as CategoryGroup[]}
      restaurantDetails={restaurantDetails as RestaurantDetails}
    />
  );
}
