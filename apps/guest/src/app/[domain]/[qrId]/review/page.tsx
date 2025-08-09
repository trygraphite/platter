import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import { ReviewPage } from "@/components/review/review-form";
import TableNotFound from "@/components/shared/TableNotFound";
import type { Params } from "@/types/pages";

const prisma = new PrismaClient();

export default async function Page({
  params,
}: {
  params: Params;
}): Promise<JSX.Element> {
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

    if (!table) {
      return <div>Table not found for this QR code.</div>;
    }

    if (!qrCode.user) {
      return <div>User not found for this QR code.</div>;
    }

    return (
      <ReviewPage
        qrId={qrId}
        tableId={table.id}
        userId={qrCode.user.id}
        title={`Review Your Experience at ${qrCode.user.name}`}
        description="We value your feedback to improve our service."
      />
    );
  } catch (_error) {
    return (
      <div>
        <TableNotFound />
      </div>
    );
  }
}
