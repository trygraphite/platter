import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@platter/ui/components/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@platter/ui/components/table";

interface ComplaintsTableProps {
  complaints: Array<{
    id: string;
    content: string;
    category: string | null;
    status: string;
    createdAt: Date;
    qrCode: {
      code: string;
    };
    table: {
      number: string;
    } | null;
  }>;
}

export function ComplaintsTable({ complaints }: ComplaintsTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Complaints</CardTitle>
        <CardDescription>List of all customer complaints</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Table</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Content</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {complaints.map((complaint) => (
              <TableRow key={complaint.id}>
                <TableCell>{complaint.table?.number || "N/A"}</TableCell>
                <TableCell>{complaint.category || "Uncategorized"}</TableCell>
                <TableCell>{complaint.content}</TableCell>
                <TableCell>{complaint.status}</TableCell>
                <TableCell>
                  {complaint.createdAt.toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
