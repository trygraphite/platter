"use client";

import { Button } from "@platter/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@platter/ui/components/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@platter/ui/components/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@platter/ui/components/table";
import {
  type ColumnDef,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React from "react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  title?: string;
  description?: string;
  pageSize?: number;
  className?: string;
  // New optional props to control features
  showPagination?: boolean;
  showPageSizeSelector?: boolean;
  maxItems?: number; // For use when pagination is disabled
}

export function DataTable<TData, TValue>({
  columns,
  data,
  title,
  description,
  pageSize = 5,
  className,
  showPagination = true,
  showPageSizeSelector = true,
  maxItems,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);

  // If pagination is disabled and maxItems is set, limit the data
  const displayData = React.useMemo(
    () => (!showPagination && maxItems ? data.slice(0, maxItems) : data),
    [data, showPagination, maxItems],
  );

  // Memoize the table configuration to improve performance
  const tableConfig = React.useMemo(
    () => ({
      data: displayData,
      columns,
      getCoreRowModel: getCoreRowModel(),
      getPaginationRowModel: showPagination
        ? getPaginationRowModel()
        : undefined,
      onSortingChange: setSorting,
      getSortedRowModel: getSortedRowModel(),
      state: {
        sorting,
      },
      initialState: {
        pagination: {
          pageSize,
        },
      },
    }),
    [columns, displayData, pageSize, showPagination, sorting],
  );

  const table = useReactTable(tableConfig);

  return (
    <Card className={`w-full ${className}`}>
      {(title || description) && (
        <CardHeader>
          {title && <CardTitle>{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent>
        <div className="w-full rounded-md border">
          <Table className="w-full">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="text-left pl-5">
                      {header.isPlaceholder
                        ? null
                        : // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          (flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          ) as any)}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="text-left pl-5">
                        {
                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          ) as any
                        }
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {showPagination && (
          <div className="flex items-center justify-between space-x-2 py-4">
            {showPageSizeSelector && (
              <div className="flex items-center space-x-2">
                <p className="text-sm text-muted-foreground">
                  Page {table.getState().pagination.pageIndex + 1} of{" "}
                  {table.getPageCount()}
                </p>
                <Select
                  value={`${table.getState().pagination.pageSize}`}
                  onValueChange={(value) => {
                    table.setPageSize(Number(value));
                  }}
                >
                  <SelectTrigger className="h-8 w-[70px]">
                    <SelectValue
                      placeholder={table.getState().pagination.pageSize}
                    />
                  </SelectTrigger>
                  <SelectContent side="top">
                    {[5, 10, 20, 30, 40, 50].map((size) => (
                      <SelectItem key={size} value={`${size}`}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
