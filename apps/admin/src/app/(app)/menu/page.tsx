import QRCodePage from "@/components/qrcode/qr-page-content";
import RestaurantPage from "@/components/resturant/menu-page";
import UpdateRestaurantDetailsForm from "@/components/setting/ProfileForm";
import getServerSession from "@/lib/auth/server";
import db from "@platter/db";
import { redirect } from "next/navigation";

export default async function EditRestaurantPage() {
  const session = await getServerSession();

  if (session === null) return redirect("/login");

  return (
    <div className="container mx-auto py-8">
      <RestaurantPage />
    </div>
  );
}
