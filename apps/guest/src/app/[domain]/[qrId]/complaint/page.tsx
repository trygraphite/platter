import { ComplaintPage } from "@/components/complaints/complaints-form";
import { Params } from "@/types/pages";
import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";

const prisma = new PrismaClient();

export default async function Page({ params }: { params: Params }) {
  const { qrId } = await params;

  try {
    const qrCode = await prisma.qRCode.findUnique({
      where: { id: qrId },
      include: { table: true, user: true },
    });

    if (!qrCode) {
      notFound();
    }

    const table = qrCode.table;
    const user = qrCode.user;

    if (!table) {
      return <div>Table not found for this QR code.</div>;
    }

    return (
      <ComplaintPage
        qrId={qrId}
        tableId={table.id}
        userId={user.id}
        title={`Submit a Complaint for Table ${table.number}`}
        description="We value your feedback and will address your concerns promptly."
      />
    );
  } catch (error) {
    console.error("Error loading complaint page:", error);
    return <div>Error loading complaint page. Please try again later.</div>;
  }
}
