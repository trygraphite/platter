
import { Button } from "@platter/ui/components/button";
import { MessageSquare, QrCode, Star, UtensilsCrossed } from "@platter/ui/lib/icons";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-12">
            How to Use Our QR Service
          </h1>

          <div className="space-y-12">
            <div className="flex flex-col md:flex-row items-center gap-6 p-6 bg-white dark:bg-gray-800/50 rounded-lg shadow-lg">
              <div className="flex-shrink-0 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <QrCode className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-2">1. Scan QR Code</h2>
                <p className="text-muted-foreground">
                  Find the QR code on your room's desk or restaurant table and
                  scan it with your smartphone's camera.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-6 p-6 bg-white dark:bg-gray-800/50 rounded-lg shadow-lg">
              <div className="flex-shrink-0 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <UtensilsCrossed className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-2">
                  2. Browse & Order
                </h2>
                <p className="text-muted-foreground">
                  Browse our menu, select your items, and place your order
                  directly through your phone.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-6 p-6 bg-white dark:bg-gray-800/50 rounded-lg shadow-lg">
              <div className="flex-shrink-0 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <MessageSquare className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-2">
                  3. Track Your Order
                </h2>
                <p className="text-muted-foreground">
                  Track your order status in real-time and receive notifications
                  when it's ready.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-6 p-6 bg-white dark:bg-gray-800/50 rounded-lg shadow-lg">
              <div className="flex-shrink-0 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Star className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-2">
                  4. Share Your Experience
                </h2>
                <p className="text-muted-foreground">
                  After your meal, we'd love to hear your feedback. Leave a
                  review to help us serve you better.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link href="/">
              <Button size="lg">Return to Home</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
