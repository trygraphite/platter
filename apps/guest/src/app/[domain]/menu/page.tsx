import { DynamicMenu } from "@/components/menu-page/dynamic-menu";
import { MenuHeader } from "@/components/menu-page/menu-header";
import Header from "@/components/shared/header";
import type { Params } from "@/types/pages";
import db from "@platter/db";
import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";

export default async function MenuPage({ params }: { params: Params }) {
  const domain = await params;
  const { domain: domainName } = domain;

  // First get user by subdomain
  const user = await db.user.findUnique({
    where: {
      subdomain: domainName,
    },
  });

  if (!user) {
    return notFound();
  }

  // Get categories specific to this user
  const categories = await db.category.findMany({
    where: {
      userId: user.id,
      isActive: true,
    },
    orderBy: { name: "asc" },
  });

  // Get menu items that belong to this user's categories
  const menuItems = await db.menuItem.findMany({
    where: {
      isAvailable: true,
      category: {
        userId: user.id,
      },
    },
    include: {
      category: true,
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="min-h-screen bg-secondary">
      <Header restaurantName={user.name ?? "Resturant"} reviewLink={user.googleReviewLink} />
      <MenuHeader userDetails={user.name ?? "Resturant"} />
      <DynamicMenu
        initialCategories={categories}
        initialMenuItems={menuItems}
      />
    </div>
  );
}
