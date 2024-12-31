import { buttonVariants } from "@platter/ui/components/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="absolute top-0 z-[-2] h-screen w-screen bg-white bg-[radial-gradient(100%_50%_at_50%_0%,rgba(0,163,255,0.13)_0,rgba(0,163,255,0)_50%,rgba(0,163,255,0)_100%)]" />
      <div className="px-4 py-16 mx-auto text-center lg:px-8 lg:py-48 max-w-7xl space-y-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
          404 - Page Not Found
        </h1>

        <p className="text-muted-foreground">
          Oops! The page you are looking for might have been removed or is
          temporarily unavailable.
        </p>

        <div className="flex justify-center">
          <Link
            href="/"
            className={buttonVariants({
              variant: "default",
              className: "animate-bounce",
            })}
          >
            Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
