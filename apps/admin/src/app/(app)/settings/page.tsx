import UpdateRestaurantDetailsForm from "@/components/setting/ProfileForm";
import getServerSession from "@/lib/auth/server";
import db from "@platter/db";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function EditRestaurantPage() {
  const user = await getServerSession();

  const userId = user?.session?.userId;

  if (!userId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
          <p className="text-gray-600 mb-6">
            Please log in to view the Settings page.
          </p>
          <Link
            href="/login"
            className="inline-block px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }
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
