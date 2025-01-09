"use client";

import React from "react";
import Container from "./container";
import Link from "next/link";
import { Building2, ExternalLink, Info, Menu, ForkKnifeCrossedIcon, LucideMapPinHouse } from "@platter/ui/lib/icons";
import { buttonVariants } from "@platter/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@platter/ui/components/dropdown-menu";
import { Button } from "@platter/ui/components/button";

interface HeaderProps {
  restaurantName: string;
  reviewLink?: string;
}

function Header({ restaurantName, reviewLink }: HeaderProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <nav className="sticky z-[100] h-14 inset-x-0 top-0 w-full border-b border-gray-200 bg-white/75 dark:bg-gray-950/75 backdrop-blur-lg transition-all">
      <Container>
        <div className="flex h-14 items-center justify-between border-zinc-200">
          <Link
            href="/"
            className="flex items-center gap-2 z-40 font-semibold text-primary"
          >
            <LucideMapPinHouse className="h-5 w-5" />
            <span className="hidden sm:inline">{restaurantName}</span>
          </Link>

          <div className="flex items-center gap-4">
            <ul className="hidden md:flex items-center gap-6">
             
                <li>
                  <Link
                    href="/menu"
                    target="_blank"
                    className={buttonVariants({
                      size: "sm",
                      variant: "ghost",
                    })}
                  >
                    Menu
                    <ForkKnifeCrossedIcon className="ml-1 h-4 w-4" />
                  </Link>
                </li>
            
              {reviewLink && (
                <li>
                  <Link
                    href={reviewLink}
                    target="_blank"
                    className={buttonVariants({
                      size: "sm",
                      variant: "ghost",
                    })}
                  >
                    Review
                    <ExternalLink className="ml-1 h-4 w-4" />
                  </Link>
                </li>
              )}
              <li>
                <Link
                  href="/about"
                  className={buttonVariants({
                    size: "sm",
                    variant: "ghost",
                  })}
                >
                  <Info className="mr-1 h-4 w-4" />
                  About
                </Link>
              </li>
            </ul>

          

            <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
              <DropdownMenuTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" aria-label="Menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {reviewLink && (
                  <DropdownMenuItem asChild>
                    <Link
                      href={reviewLink}
                      target="_blank"
                      className="flex items-center gap-2 w-full"
                    >
                      Review
                      <ExternalLink className="h-4 w-4 ml-auto" />
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild>
                  <Link href="/about" className="flex items-center gap-2 w-full">
                    <Info className="h-4 w-4" />
                    About
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </Container>
    </nav>
  );
}

export default Header;