import { Button } from "@platter/ui/components/button";
import { HourglassLoader } from "@platter/ui/components/timeLoader";
import { ChefHat, Home, Utensils } from "lucide-react";
import Link from "next/link";
import Container from "@/components/shared/container";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <main>
        <Container className="flex-1">
          <section className="w-full py-12 md:py-20 lg:py-32">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center space-y-8 text-center">
                <div className="space-y-3">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                    Page Not Found
                  </h1>
                  <p className="mx-auto max-w-[700px] text-gray-500 dark:text-gray-400 md:text-xl">
                    The page you're looking for doesn't exist or has been moved
                    from our menu.
                  </p>
                </div>

                <div className="flex justify-center w-full py-6">
                  <HourglassLoader label="Finding your way back..." />
                </div>

                <div className="space-y-4">
                  <div className="flex justify-center items-center space-x-2">
                    <ChefHat className="h-6 w-6 text-red-500" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Need assistance? Contact our support team for immediate
                      help with your Platter Admin dashboard.
                    </p>
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2 mt-8 w-full max-w-md">
                  <Button color="primary">
                    <Link href="/" className="flex items-center gap-2">
                      <Home size={16} /> Dashboard
                    </Link>
                  </Button>
                  <Button color="secondary">
                    <Link href="/orders" className="flex items-center gap-2">
                      <Utensils size={16} /> Orders
                    </Link>
                  </Button>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-lg w-full max-w-2xl mt-12">
                  <h3 className="text-lg font-medium mb-3">Quick Navigation</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <Link
                      href="/menu"
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Menu Items
                    </Link>
                    <Link
                      href="/orders"
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Orders
                    </Link>
                    <Link
                      href="/settings"
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Settings
                    </Link>
                    <Link
                      href="/reviews"
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      reviews
                    </Link>
                    <Link
                      href="/complaints"
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      complaints
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </Container>
      </main>
    </div>
  );
}
