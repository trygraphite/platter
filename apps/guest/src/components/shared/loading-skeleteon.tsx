import { Skeleton } from "@platter/ui/components/skeleton";
import { Card, CardHeader, CardContent } from "@platter/ui/components/card";

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="container max-w-2xl mx-auto px-4">
        <Skeleton className="h-10 w-32 mb-6" />

        <Card className="shadow-lg">
          <CardHeader>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-32" />
          </CardHeader>
          <CardContent className="space-y-6">
            <Skeleton className="h-32 w-full rounded-lg" />
            <div className="space-y-4">
              <Skeleton className="h-6 w-40" />
              <div className="space-y-2">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-6 w-full" />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
