"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@platter/ui/components/button";
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger,
  SheetTitle 
} from "@platter/ui/components/sheet";
import { Menu, X } from "lucide-react";
import Image from "next/image";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-100 shadow-sm">
      <div className="container-wide flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            {/* Replace with your logo */}
            <Image src="/logo.png" alt="Platter Logo" width={40} height={40} className="rounded-full bg-primary" />
            <span className="font-bold text-xl text-gray-900">Platter</span>
          </Link>
        </div>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/pricing" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">
            Pricing
          </Link>   
          {/* <Link href="/blogs" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">
            Blog
          </Link>    */}
          <Link href="/contact" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">
            Contact
          </Link>
        </nav>

        {/* Desktop call-to-action buttons */}
        <div className="hidden md:flex items-center gap-4">
          {/* <Link href="/login">
            <Button variant="ghost" className="text-primary hover:text-primary-600 hover:bg-primary-50">
              Login
            </Button>
          </Link> */}
          <Link href="/request">
            <Button className="bg-primary hover:bg-primary-600 text-white">
              Get Started
            </Button>
          </Link>
        </div>

        {/* Mobile menu button */}
        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" aria-label="Menu">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px] ">
            {/* Added SheetTitle for accessibility */}
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            
            <div className="flex flex-col gap-6 ">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                <Image src="/logo.png" alt="Platter Logo" width={40} height={40} className="rounded-full bg-primary" />
                <span className="font-bold text-xl text-gray-900">Platter</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Close menu"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <p className="text-md py-1 px-2  ">X</p>
                </Button>
              </div>

              <nav className="flex flex-col gap-4">
              
                <Link
                  href="/pricing"
                  className="text-base font-medium text-gray-600 hover:text-primary transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Pricing
                </Link>
              
                <Link
                  href="/contact"
                  className="text-base font-medium text-gray-600 hover:text-primary transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contact
                </Link>
              </nav>

              <div className="flex flex-col gap-2 mt-4">
                <Link
                  href="/login"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Button variant="outline" className="w-full">
                    Login
                  </Button>
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Button className="w-full bg-primary hover:bg-primary-600 text-white">
                    Create Free Account
                  </Button>
                </Link>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}