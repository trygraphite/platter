  import Link from "next/link";
  import { Button } from "@platter/ui/components/button";
  import Image from "next/image";

  export function Hero() {
    return (
      <section className="relative overflow-hidden bg-white pt-16 md:pt-20 lg:pt-24">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center my-4 lg:my-24">
            <div className="flex flex-col gap-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900">
                Create a Free
                <span className="block text-primary">QR Code Menu</span>
                & Waiter App
              </h1>
              <p className="text-lg text-gray-600 max-w-xl">
                Create your digital restaurant menu with QR codes in minutes. Free forever, no credit card required. Includes
                ordering system and staff management tools.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-2">
                <Link href="/register">
                  <Button size="lg" className="bg-primary hover:bg-primary-600 text-white font-medium px-8">
                    Create Free QR Menu
                  </Button>
                </Link>
                <p className="text-sm text-gray-500 flex items-center gap-2 mt-2 sm:mt-0">
                  *No credit card required • Instant setup • One month free!
                </p>
              </div>
            </div>
            <div className="relative lg:-right-16 xl:-right-36 2xl:-right-40 transform lg:scale-110 xl:scale-150">
              <div className="rounded-lg overflow-hidden shadow-xl">
                <Image 
                  src="/assets/dashboard02.png" 
                  alt="Platter admin dashboard" 
                  width={2000} 
                  height={1000}
                  className="w-full h-auto"
                  priority
                />
              </div>
            </div>
          </div>
        </div>

        {/* Gradient blur effect */}
        <div className="absolute top-1/2 right-0 -z-10 -translate-y-1/2 transform-gpu blur-3xl">
          <div
            className="aspect-[1108/632] w-[69.25rem] bg-gradient-to-r from-primary-200 to-secondary-200 opacity-20"
            style={{
              clipPath:
                "polygon(73.6% 51.7%, 91.7% 11.8%, 100% 46.4%, 97.4% 82.2%, 92.5% 84.9%, 75.7% 64%, 55.3% 47.5%, 46.5% 49.4%, 45% 62.9%, 50.3% 87.2%, 21.3% 64.1%, 0.1% 100%, 5.4% 51.1%, 21.4% 63.9%, 58.9% 0.2%, 73.6% 51.7%)",
            }}
          />
        </div>
      </section>
    );
  }