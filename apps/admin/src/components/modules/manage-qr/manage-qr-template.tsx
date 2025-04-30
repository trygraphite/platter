// app/qr-codes/page.tsx
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import db from '@platter/db';
import PageHeader from '@/components/custom/page-header';
import QRCodesTable from './components/qrcode-table';

export const dynamic = 'force-dynamic';

async function getQRCodes() {
  try {
    const qrCodes = await db.qRCode.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        table: {
          select: {
            number: true,
          },
        },
        location: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    return qrCodes;
  } catch (error) {
    console.error('Error fetching QR codes:', error);
    return [];
  }
}

export default async function ManageQRCodesPage() {
  const qrCodes = await getQRCodes();
  
  return (
    <div className="container mx-auto py-8">
      <PageHeader
        title="Manage QR Codes"
        description="View and manage your QR codes"
      />
      
      <Suspense fallback={
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="ml-2">Loading QR codes...</span>
        </div>
      }>
        <QRCodesTable qrCodes={qrCodes} />
      </Suspense>
    </div>
  );
}