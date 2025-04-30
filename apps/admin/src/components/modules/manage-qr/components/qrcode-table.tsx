// app/qr-codes/components/QRCodesTable.tsx
'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { QRCode } from '@prisma/client';
import { Eye, Trash2, Search, QrCode, Filter, ArrowUpDown } from 'lucide-react';
import { Button } from '@platter/ui/components/button';
import { Input } from '@platter/ui/components/input';
import { Badge } from '@platter/ui/components/badge';
import { Card, CardContent } from '@platter/ui/components/card';
import { ColumnDef } from '@tanstack/react-table';
import EmptyState from '@/components/custom/empty-state';
import DeleteQRCodeDialog from './delete-qr';
import ViewQRCodeDialog from './view-qrcode';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@platter/ui/components/select';
import { DataTable } from '@/components/custom/data-table';

type QRCodeWithRelations = QRCode & {
  user?: { name: string; email: string } | null;
  table?: { name: string; number: string } | null;
  location?: { name: string } | null;
};

interface QRCodesTableProps {
  qrCodes: QRCodeWithRelations[];
}

export default function QRCodesTable({ qrCodes }: QRCodesTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [qrCodeToDelete, setQrCodeToDelete] = useState<QRCodeWithRelations | null>(null);
  const [qrCodeToView, setQrCodeToView] = useState<QRCodeWithRelations | null>(null);

  const filteredQRCodes = qrCodes.filter((qrCode) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      qrCode.target.toLowerCase().includes(searchLower) ||
      (qrCode.targetNumber?.toLowerCase().includes(searchLower) ?? false) ||
      (qrCode.table?.name.toLowerCase().includes(searchLower) ?? false) ||
      (qrCode.location?.name.toLowerCase().includes(searchLower) ?? false);
    
    // Filter by type if not set to 'all'
    const matchesType = typeFilter === 'all' || qrCode.target.toLowerCase() === typeFilter.toLowerCase();
    
    return matchesSearch && matchesType;
  });

  const handleDeleteClick = (qrCode: QRCodeWithRelations) => {
    setQrCodeToDelete(qrCode);
  };

  const handleViewClick = (qrCode: QRCodeWithRelations) => {
    setQrCodeToView(qrCode);
  };

  // Get unique types for the filter dropdown
  const qrCodeTypes = ['all', ...Array.from(new Set(qrCodes.map(qr => qr.target.toLowerCase())))];

  // Helper function to get the table number value for sorting
  const getTableNumberValue = (qrCode: QRCodeWithRelations): string => {
    return qrCode.table?.number || qrCode.targetNumber || '';
  };

  // Define the columns for the DataTable
  const columns: ColumnDef<QRCodeWithRelations, any>[] = [
    {
      accessorKey: 'index',
      header: 'S/N',
      cell: ({ row }) => row.index + 1,
    },
    {
      accessorKey: 'target',
      header: 'Type',
      cell: ({ row }) => (
        <div className="  flex items-center gap-2">
          <QrCode className="h-4 w-4 text-muted-foreground" />
          <div className="capitalize">{row.original.target}</div>
        </div>
      ),
    },
    {
      accessorKey: 'tableNumber',
      accessorFn: getTableNumberValue,
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-0 hover:bg-transparent"
          >
            Table Number
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => row.original.table?.number || row.original.targetNumber || '-',
    },
    {
      accessorKey: 'createdAt',
      header: 'Created',
      cell: ({ row }) => (
        <span className="text-muted-foreground">
          {format(new Date(row.original.createdAt), 'MMM d, yyyy')}
        </span>
      ),
    },
    {
      id: 'actions',
      header: () => <div className="text-right mr-4">Actions</div>,
      cell: ({ row }) => (
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleViewClick(row.original)}
          >
            <Eye className="h-4 w-4" />
            <span className="sr-only">View</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleDeleteClick(row.original)}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
            <span className="sr-only">Delete</span>
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex flex-1 gap-4 items-center">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search QR codes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[140px]">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <SelectValue placeholder="Filter by type" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {qrCodeTypes.map((type) => (
                    <SelectItem key={type} value={type} className="capitalize">
                      {type === 'all' ? 'All Types' : type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Badge className="py-1 ml-auto md:ml-0">
            {filteredQRCodes.length} QR {filteredQRCodes.length === 1 ? 'Code' : 'Codes'}
          </Badge>
        </div>

        {filteredQRCodes.length === 0 ? (
          <EmptyState
            icon={<QrCode className="w-12 h-12 text-muted-foreground" />}
            title="No QR codes found"
            description={searchTerm || typeFilter !== 'all' ? "Try adjusting your search or filter" : "Create your first QR code to get started"}
            action={
              <div className="flex gap-2">
                {(searchTerm || typeFilter !== 'all') && (
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSearchTerm('');
                      setTypeFilter('all');
                    }}
                  >
                    Clear filters
                  </Button>
                )}
                {!searchTerm && typeFilter === 'all' && (
                  <Button variant="outline">Create QR Code</Button>
                )}
              </div>
            }
          />
        ) : (
          <div className="w-full">
            <DataTable
              columns={columns}
              data={filteredQRCodes}
              pageSize={10}
              showPageSizeSelector={true}
              className="border-none" 
            />
          </div>
        )}

        {qrCodeToDelete && (
          <DeleteQRCodeDialog
            qrCode={qrCodeToDelete}
            isOpen={!!qrCodeToDelete}
            onClose={() => setQrCodeToDelete(null)}
          />
        )}

        {qrCodeToView && (
          <ViewQRCodeDialog
            qrCode={qrCodeToView}
            isOpen={!!qrCodeToView}
            onClose={() => setQrCodeToView(null)}
          />
        )}
      </CardContent>
    </Card>
  );
}