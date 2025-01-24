import UpdateRestaurantDetailsForm from "@/components/setting/ProfileForm";
import getServerSession from "@/lib/auth/server";
import db from "@platter/db";
import { redirect } from "next/navigation";

export default async function EditRestaurantPage() {
  const user = await getServerSession();

  if (!user) {
     return redirect("/login");
  }
  const restaurantData = await db.user.findUnique({
    where: { id: user.user.id },
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
