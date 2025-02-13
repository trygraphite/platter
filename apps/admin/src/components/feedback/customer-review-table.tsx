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

interface CustomerReviewsTableProps {
  reviews: Array<{
    id: string;
    rating: number;
    comment: string;
    createdAt: Date;
    order: {
      orderNumber: string;
    } | null;
  }>;
}

export function CustomerReviewsTable({ reviews }: CustomerReviewsTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Reviews</CardTitle>
        <CardDescription>Recent customer reviews and ratings</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Rating</TableHead>
              <TableHead>Comment</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reviews.slice(0, 5).map((review) => (
              <TableRow key={review.id}>
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
