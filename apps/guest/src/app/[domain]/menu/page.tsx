import { DynamicMenu } from "@/components/menu-page/dynamic-menu";
import { MenuHeader } from "@/components/menu-page/menu-header";
import Header from "@/components/shared/header";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function MenuPage() {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
    include: { user: true },
  });

  const menuItems = await prisma.menuItem.findMany({
    where: { isAvailable: true },
    include: {
      category: true,
    },
    orderBy: { name: "asc" },
  });
  console.log(categories[0]?.user.name);
  const username = categories[0]?.user.name;
  return (
    <div className="min-h-screen bg-secondary">
      <Header restaurantName={username ?? "Resturant"} reviewLink="" />
      <MenuHeader userDetails={username ?? "Resturant"} />
      <DynamicMenu
        initialCategories={categories}
        initialMenuItems={menuItems}
      />
    </div>
  );
}
