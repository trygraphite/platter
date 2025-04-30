import UpdateRestaurantDetailsForm from "@/components/setting/ProfileForm";
import getServerSession from "@/lib/auth/server";
import db from "@platter/db";
import { redirect } from "next/navigation";

export default async function EditRestaurantPage() {
  const user = await getServerSession();

  const userId = user?.session?.userId;

  try {
    const restaurantData = await db.user.findUnique({
      where: { id: userId },
    });

    if (!restaurantData) {
      return <div>Restaurant not found</div>;
    }

    return (
      <div className="container mx-auto py-8">
        <h1 className="text-2xl font-bold mb-6">Edit Restaurant Details</h1>
        <UpdateRestaurantDetailsForm initialData={restaurantData} />
      </div>
    );
  } catch (error) {
    console.error("Error fetching restaurant data:", error);
    return <div>Failed to load restaurant data</div>;
  }
}