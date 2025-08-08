"use client";

import { logoutAction } from "@/actions/staff-auth";
import type { StaffUser } from "@/utils/auth";
import { Button } from "@platter/ui/components/button";
import {
  BarChart3,
  Bell,
  LogOut,
  Menu,
  Package,
  Settings,
  User,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface StaffNavigationProps {
  user: StaffUser;
}

export function StaffNavigation({ user }: StaffNavigationProps) {
  const pathname = usePathname();

  const navigationItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: BarChart3,
      show: true, // Always show dashboard
    },
    {
      name: "Orders",
      href: "/orders",
      icon: Package,
      show: user.canManageOrders,
    },
    {
      name: "Menu",
      href: "/menu",
      icon: Menu,
      show: user.canManageMenu,
    },
    {
      name: "Tables",
      href: "/tables",
      icon: Users,
      show: user.canManageTables,
    },
    {
      name: "Reports",
      href: "/reports",
      icon: BarChart3,
      show: user.canViewReports,
    },
    {
      name: "Settings",
      href: "/settings",
      icon: Settings,
      show: true, // Always show settings
    },
  ];

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(href);
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <Link
              href="/dashboard"
              className="text-xl font-semibold text-gray-900"
            >
              Staff Portal
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navigationItems
              .filter((item) => item.show)
              .map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive(item.href)
                        ? "text-blue-600 bg-blue-50"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {item.name}
                  </Link>
                );
              })}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <button
              type="button"
              className="p-2 text-gray-400 hover:text-gray-500"
            >
              <Bell className="h-5 w-5" />
            </button>

            <div className="flex items-center space-x-3">
              <div className="text-sm">
                <p className="text-gray-900 font-medium">{user.name}</p>
                <p className="text-gray-500">{user.staffRole}</p>
              </div>
              <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
            </div>

            <form action={logoutAction}>
              <button
                type="submit"
                className="p-2 text-gray-400 hover:text-gray-500"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </form>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigationItems
              .filter((item) => item.show)
              .map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center px-3 py-2 text-base font-medium rounded-md transition-colors ${
                      isActive(item.href)
                        ? "text-blue-600 bg-blue-50"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    {item.name}
                  </Link>
                );
              })}
          </div>
        </div>
      </div>
    </nav>
  );
}
