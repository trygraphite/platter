// app/qr-codes/components/DeleteQRCodeDialog.tsx
'use client';

import { useState } from 'react';
import { QRCode } from '@prisma/client';
import { Trash2, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@platter/ui/components//alert-dialog';
import { Button } from '@platter/ui/components/button';
import { toast } from '@platter/ui/components/sonner';

type QRCodeWithRelations = QRCode & {
  user?: { name: string; email: string } | null;
  table?: { name: string; number: string } | null;
  location?: { name: string } | null;
};

interface DeleteQRCodeDialogProps {
  qrCode: QRCodeWithRelations;
  isOpen: boolean;
  onClose: () => void;
}

export default function DeleteQRCodeDialog({
  qrCode,
  isOpen,
  onClose,
}: DeleteQRCodeDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      
      // In a real implementation, you'd make an API call to delete the QR code
      const response = await fetch(`/api/qr-codes/${qrCode.id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete QR code');
      }
      
      toast.success('QR code deleted', {
        description: `QR code for ${qrCode.target} has been deleted.`,
      });
      
      router.refresh();
      onClose();
    } catch (error) {
      console.error('Error deleting QR code:', error);
      toast.error('Failed to delete QR code. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-destructive">
            <Trash2 className="h-5 w-5" />
            Delete QR Code
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete the QR code for{' '}
            <span className="font-medium">{qrCode.target}</span>
            {qrCode.targetNumber && ` #${qrCode.targetNumber}`}?
            <br />
            <br />
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              'Delete'
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}