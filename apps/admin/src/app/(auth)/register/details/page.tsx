import RestaurantDetailsForm from "@/components/auth/restaurant-details-form";
import getServerSession from "@/lib/auth/server";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: " Details",
};

async function DetailsPage() {
  const session = await getServerSession();
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="container max-w-3xl py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Restaurant Details</h1>
        <p className="text-muted-foreground mt-2">
          Please provide your restaurant information to complete your
          registration.
        </p>
      </div>
      <RestaurantDetailsForm />
    </div>
  );
}

export default DetailsPage;