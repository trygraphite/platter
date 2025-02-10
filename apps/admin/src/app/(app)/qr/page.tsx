import QRCodePage from "@/components/qrcode/qr-page-content";
import getServerSession from "@/lib/auth/server";
import { redirect } from "next/navigation";

export default async function EditRestaurantPage() {
  const session = await getServerSession();

  if (session === null) return redirect("/login");

  return (
    <div className="container mx-auto py-8">
      <QRCodePage />
    </div>
  );
}
