import UpdateRestaurantDetailsForm from "@/components/setting/ProfileForm";
import getServerSession from "@/lib/auth/server";
import db from "@platter/db";

export default async function EditRestaurantPage() {
  const user = await getServerSession();

  const userId = user?.session?.userId;

  const restaurantData = await db.user.findUnique({
    where: { id: userId as string },
  });

  if (!restaurantData) {
    return <div>Restaurant not found.</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Edit Restaurant Details</h1>
      <UpdateRestaurantDetailsForm initialData={restaurantData} />
    </div>
  );
}
