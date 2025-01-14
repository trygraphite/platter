import { MenuPage } from "@/components/order-menu-page/menuPage";
import { Params } from "@/types/pages";
import db from "@platter/db";
import { notFound } from "next/navigation";


// interface RestaurantDetails {
//   name: string;
//   description: string;
//   image: string;
//   cuisine: string;
//   openingHours: string;
//   closingHours: string;
//   menu: Category[];
// }

// interface Category {
//   id: string;
//   name: string;
//   menuItems: MenuItem[];
// }

// interface MenuItem {
//   id: string;
//   name: string;
//   description: string;
//   price: number;
//   image?: string;
// }

export default async function Page({ params }: { params: Params }) {
      const { qrId, domain } = await params;


  const restaurantDetails = await db.user.findUnique({
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
      select: {
        id: true,
        name: true,
        menuItems: {
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
}) as any;

  if (!restaurantDetails) {
    return notFound();
  }

  return (
    <MenuPage 
      qrId={qrId}
      category={restaurantDetails.categories}
      restaurantDetails={restaurantDetails}
    />
  );
}
