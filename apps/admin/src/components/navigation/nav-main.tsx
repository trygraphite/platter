"use client";

import { Collapsible } from "@platter/ui/components/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
} from "@platter/ui/components/sidebar";

import { LayoutPanelTop, SettingsIcon, QrCode, PanelTopDashed } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  {
    name: "Dashboard",
    url: "/",
    icon: LayoutPanelTop,
  },
  {
    name: "Menu",
    url: "/menu",
    icon: PanelTopDashed,
  },
  {
    name: "Qr Code",
    url: "/qr",
    icon: QrCode,
  },
  {
    name: "Settings",
    url: "settings",
    icon: SettingsIcon,
  },
];

export function NavMain() {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Application</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            key={item.name}
            asChild
            defaultOpen={false}
            className="group/collapsible"
          >
            <SidebarMenuButton
              asChild
              className={`hover:bg-muted border border-transparent hover:border-border ${
                pathname === item.url ? "bg-muted border-border" : ""
              }`}
            >
              <Link href={`${item.url}`}>
                <item.icon className={`${pathname === item.url ? "text-primary" : "text-foreground"}`}/>
                <span>{item.name}</span>
              </Link>
            </SidebarMenuButton>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
