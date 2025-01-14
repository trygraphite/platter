import { ReviewPage } from '@/components/review/review-form';
import { Params } from '@/types/pages';
import { PrismaClient } from '@prisma/client';
import { notFound } from 'next/navigation';

const prisma = new PrismaClient();

export default async function Page({ params }: { params: Params }) {

    const { qrId } = await params;


  try {
    const qrCode = await prisma.qRCode.findUnique({
      where: { id: qrId },
      include: { table: true, user: true }

    });

    if (!qrCode) {
      notFound();
    }

    const table = qrCode.table;

    if (!table) {
      return <div>Table not found for this QR code.</div>;
    }

    return (
      <ReviewPage 
        qrId={qrId}
        tableId={table.id}
        userId = {qrCode.user.id}
        title={`Review Your Experience at ${qrCode.user.name}`}
        description="We value your feedback to improve our service."
      />
    );
  } catch (error) {
    console.error("Error loading review page:", error);
    return <div>Error loading review page. Please try again later.</div>;
  }
}

