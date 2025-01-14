import { PrismaClient } from '@prisma/client';
import { OrdersPage } from "@/components/view-orders/view-order";
import { notFound } from 'next/navigation';
import { Params } from '@/types/pages';

const prisma = new PrismaClient();

export default async function Page({ params }: { params: Params }) {
      const { qrId } = await params;

  try {
    // Step 1: Fetch QRCode details
    const qrCode = await prisma.qRCode.findUnique({
      where: { id: qrId },
      include: { table: true }
    });

    if (!qrCode) {
      notFound();
    }

    // Step 2: Get the associated Table
    const table = qrCode.table;

    if (!table) {
      return <div>Table not found for this QR code.</div>;
    }

    // Step 3: Fetch Orders for this Table
    // const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const initialOrders = await prisma.order.findMany({
      where: {
        tableId: table.id,
        // createdAt: {
        //   gte: twentyFourHoursAgo
        // }
      },
      include: {
        items: {
          include: {
            menuItem: true
          }
        },
        table: true,
        user: true,
        review: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Step 4: Pass data to child component
    return (
      <OrdersPage
        qrId={qrId}
        initialOrders={initialOrders}
        tableId={table.id}
        tableNumber={table.number}
      />
    );
  } catch (error) {
    console.error("Error loading orders:", error);
    return <div>Error loading orders. Please try again later.</div>;
  }
}

