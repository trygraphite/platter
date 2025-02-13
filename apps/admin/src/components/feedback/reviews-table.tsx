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

interface ReviewsTableProps {
  reviews: Array<{
    id: string;
    rating: number;
    comment: string | null;
    createdAt: Date;
    order: {
      orderNumber: string;
    } | null;
    qrCode: {
      code: string;
    } | null;
    table: {
      number: string;
    } | null;
  }>;
}

export function ReviewsTable({ reviews }: ReviewsTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Reviews</CardTitle>
        <CardDescription>
          List of all customer reviews and ratings
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Table</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Comment</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reviews.map((review) => (
              <TableRow key={review.id}>
                <TableCell>{review.table?.number || "N/A"}</TableCell>
                <TableCell>{review.rating}</TableCell>
                <TableCell>{review.comment || "No comment"}</TableCell>
                <TableCell>{review.createdAt.toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
