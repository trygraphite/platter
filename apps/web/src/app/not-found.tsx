import { Button } from "@platter/ui/components/button";
import Link from "next/link";
import { siteConfig } from "@/lib/siteConfig";

export const metadata = {
  title: "Page Not Found",
};

export default function NotFound() {
  return (
    <div className="container-wide flex flex-col items-center justify-center min-h-[70vh] py-12 md:py-16 lg:py-20">
      <div className="text-center space-y-6 max-w-md mx-auto">
        <h1 className="text-6xl font-bold text-primary">404</h1>
        <h2 className="text-3xl font-semibold">Page Not Found</h2>

        <p className="text-lg text-muted-foreground">
          Sorry, we couldn't find the page you were looking for. It might have
          been moved or deleted.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/">Return Home</Link>
          </Button>

          <Button variant="outline" asChild size="lg">
            <Link href="/contact">Contact Support</Link>
          </Button>
        </div>

        <div className="pt-10">
          <p className="text-sm text-muted-foreground">
            Need immediate assistance? Contact us at{" "}
            <a
              href={`mailto:${siteConfig.contact.email}`}
              className="font-medium underline underline-offset-4 hover:text-primary"
            >
              {siteConfig.contact.email}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
