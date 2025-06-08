import { OrderSummaryPage } from "@/components/order-summary-page/orderSummaryPage";
import type { Params } from "@/types/pages";
import db from "@platter/db";
import { notFound } from "next/navigation";

export default async function Page({ params }: { params: Params }) {
  const { qrId, orderId, domain } = await params;

  const qrCodeData = await db.qRCode.findUnique({
    where: {
      id: qrId,
    },
    select: {
      tableId: true,
      table: {
        select: {
          id: true,
          number: true,
          capacity: true,
          isAvailable: true,
        },
      },
      user: {
        select: {
          name: true,
          description: true,
          image: true,
          cuisine: true,
          subdomain: true,
        },
      },
    },
  });
  if (!qrCodeData || !qrCodeData.user || qrCodeData.user.subdomain !== domain) {
    return notFound();
  }

  const restaurantDetails = {
    name: qrCodeData.user.name,
    description: qrCodeData.user.description ?? "",
    image: qrCodeData.user.image ?? "",
    cuisine: qrCodeData.user.cuisine ?? "",
  };

  // Include table information in the props
  return (
    <OrderSummaryPage
      domain={domain}
      qrId={qrId}
      restaurantDetails={restaurantDetails}
      tableDetails={
        qrCodeData.table || {
          id: "",
          number: "",
          capacity: 4,
          isAvailable: false,
        }
      }
    />
  );
}
