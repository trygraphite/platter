import Link from "next/link";
import { Button } from "@platter/ui/components/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@platter/ui/components/card";

export default function ErrorCard(error: any) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="container max-w-2xl mx-auto px-4">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Order Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Sorry, we couldn't find the order you're looking for. It may have
              been deleted or you may have entered an incorrect URL.
            </p>
            <p className="text-muted-foreground">{error}</p>
          </CardContent>
          <CardFooter>
            <Button asChild>
              <Link href="/">Return to Home</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
