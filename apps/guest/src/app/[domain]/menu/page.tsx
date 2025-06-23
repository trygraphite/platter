// Updated MenuPage component (page.tsx)
import { DynamicMenu } from "@/components/menu-page/dynamic-menu"
import { MenuHeader } from "@/components/menu-page/menu-header"
import Header from "@/components/shared/header"
import type { Params } from "@/types/pages"
import db from "@platter/db"
import { notFound } from "next/navigation"

export default async function MenuPage({ params }: { params: Params }): Promise<JSX.Element> {
  const domain = await params
  const { domain: domainName } = domain

  // First get user by subdomain
  const user = await db.user.findUnique({
    where: {
      subdomain: domainName,
    },
  })

  if (!user) {
    return notFound()
  }

  // Get category groups specific to this user
  const categoryGroups = await db.categoryGroup.findMany({
    where: {
      userId: user.id,
      isActive: true,
    },
    include: {
      categories: {
        where: {
          isActive: true,
        },
        orderBy: { position: "asc" },
      },
    },
    orderBy: { position: "asc" },
  })

  // Get categories that don't belong to any group
  const ungroupedCategories = await db.category.findMany({
    where: {
      userId: user.id,
      isActive: true,
      groupId: null,
    },
    orderBy: { position: "asc" },
  })

  // Get menu items with varieties
  const menuItems = await db.menuItem.findMany({
    where: {
      isAvailable: true,
      category: {
        userId: user.id,
      },
    },
    include: {
      category: {
        include: {
          categoryGroup: true,
        },
      },
      varieties: {
        where: {
          isAvailable: true,
        },
        orderBy: [
          { isDefault: "desc" }, 
          { position: "asc" },
          { name: "asc" },
        ],
      },
    },
    orderBy: [{ category: { position: "asc" } }, { position: "asc" }, { name: "asc" }],
  })

  return (
    <div className="min-h-screen bg-secondary">
      <Header restaurantName={user.name ?? "Restaurant"} reviewLink={user.googleReviewLink} />
      <MenuHeader userDetails={user.name ?? "Restaurant"} />
      <DynamicMenu
        initialCategoryGroups={categoryGroups}
        initialUngroupedCategories={ungroupedCategories}
        initialMenuItems={menuItems}
      />
    </div>
  )
}