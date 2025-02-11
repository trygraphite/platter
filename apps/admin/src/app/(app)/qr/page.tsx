import QRCodePage from "@/components/qrcode/qr-page-content";
import getServerSession from "@/lib/auth/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function EditRestaurantPage() {
const session = await getServerSession();
const userId = session?.session?.userId;
if (!userId) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
        <p className="text-gray-600 mb-6">
          Please log in to view the Qr Code page.
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

return (
  <div className="container mx-auto py-8">
    <QRCodePage />
  </div>
);
}
