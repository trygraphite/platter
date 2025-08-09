import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@platter/ui/components/sidebar";
import { ChevronDown, type LucideIcon } from "lucide-react";
import { useState } from "react";

export function NavSecondary({
  items,
  ...props
}: {
  items: {
    title: string;
    url?: string;
    icon: LucideIcon;
    children?: { title: string; url: string }[];
  }[];
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <div key={item.title}>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  size="sm"
                  onClick={() =>
                    item.children
                      ? setOpenDropdown(
                          openDropdown === item.title ? null : item.title,
                        )
                      : null
                  }
                >
                  <a href={item.url || "#"}>
                    <item.icon />
                    <span>{item.title}</span>
                    {item.children && <ChevronDown className="ml-auto" />}
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {item.children && openDropdown === item.title && (
                <SidebarMenu className="pl-4">
                  {item.children.map((child) => (
                    <SidebarMenuItem key={child.title}>
                      <SidebarMenuButton asChild size="sm">
                        <a href={child.url}>{child.title}</a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              )}
            </div>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
