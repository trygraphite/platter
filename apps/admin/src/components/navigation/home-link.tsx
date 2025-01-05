"use client";

import { Avatar, AvatarImage } from "@platter/ui/components/avatar";
import Link from "next/link";
import React from "react";

function HomeLink({ user }: { user: any }) {
  return (
    <div className="flex shrink-0 h-full">
      <Link
        className="flex items-center gap-2 w-full hover:bg-muted hover:border-border border-transparent"
        href="/"
      >
        <div className="text-sidebar-primary-foreground flex aspect-square">
          <Avatar className="size-8 rounded-[4px]">
            <AvatarImage
              src={
                user?.avatar || "https://avatar.vercel.sh/platter.svg?text=PL"
              }
              className="rounded-[4px]"
            />
          </Avatar>
        </div>
        <div className="grid flex-1 text-left text-sm leading-tight">
          <span className="truncate font-medium text-sm">
            {user?.name || "Loading..."}
          </span>
          <span className="truncate text-xs text-primary">
            {user?.address || "Loading..."}
          </span>
        </div>
      </Link>
    </div>
  );
}

export default HomeLink;
