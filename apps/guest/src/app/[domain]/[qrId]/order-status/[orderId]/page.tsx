import OrderStatusPage from "@/components/order-status-page/orderStatusPage";
import ErrorCard from "@/components/shared/error-card";
import type { Params } from "@/types/pages";
import db from "@platter/db";
import { OrderStatus } from "@prisma/client";
import { notFound } from "next/navigation";

export default async function OrderPage({ params }: { params: Params }) {
  const { qrId, orderId } = await params;

  try {
    console.log("QR ID HERE", qrId);

    const order = await db.order.findUnique({
      where: { id: orderId },
      include: {
        items: { include: { menuItem: true } },
        table: true,
        user: true,
      },
    });

    if (!order) {
      notFound();
    }

    // Calculate time metrics if not already set
    if (order.status === OrderStatus.DELIVERED && !order.totalTime) {
      await db.order.update({
        where: { id: order.id },
        data: {
          confirmationTime: order.confirmedAt
            ? Math.floor(
                (order.confirmedAt.getTime() - order.createdAt.getTime()) /
                  60000,
              )
            : null,
          preparationTime:
            order.readyAt && order.confirmedAt
              ? Math.floor(
                  (order.readyAt.getTime() - order.confirmedAt.getTime()) /
                    60000,
                )
              : null,
          deliveryTime:
            order.deliveredAt && order.readyAt
              ? Math.floor(
                  (order.deliveredAt.getTime() - order.readyAt.getTime()) /
                    60000,
                )
              : null,
          totalTime: order.deliveredAt
            ? Math.floor(
                (order.deliveredAt.getTime() - order.createdAt.getTime()) /
                  60000,
              )
            : null,
        },
      });
    }

    if (!order.table) {
      notFound();
    }

    return (
      <OrderStatusPage
        initialOrder={order}
        qrId={qrId}
        table={order.table}
        user={order.user}
      />
    );
  } catch (error) {
    console.error("Error in OrderPage:", error);
    return (
      <div className="container mx-auto p-4">
        <ErrorCard />
      </div>
    );
  }
}
