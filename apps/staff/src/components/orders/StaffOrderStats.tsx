"use client";

import { AlertCircle, CheckCircle, CheckSquare, Package } from "lucide-react";
import type React from "react";
import type { StaffOrderStatsProps } from "@/types/orders";

export function StaffOrderStats({
  stats,
}: StaffOrderStatsProps): React.JSX.Element {
  const statCards = [
    {
      title: "Total Orders",
      value: stats.total,
      icon: Package,
      color: "bg-blue-500",
      textColor: "text-blue-600",
      bgColor: "bg-blue-50",
    },

    {
      title: "Confirmed",
      value: stats.confirmed,
      icon: CheckSquare,
      color: "bg-blue-500",
      textColor: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Preparing",
      value: stats.preparing,
      icon: AlertCircle,
      color: "bg-purple-500",
      textColor: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Delivered",
      value: stats.delivered,
      icon: CheckCircle,
      color: "bg-green-500",
      textColor: "text-green-600",
      bgColor: "bg-green-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      {statCards.map((stat) => (
        <div key={stat.title} className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center">
            <div className={`p-2 ${stat.bgColor} rounded-lg`}>
              <stat.icon className={`h-5 w-5 ${stat.textColor}`} />
            </div>
            <div className="ml-3">
              <p className="text-xs font-medium text-gray-600">{stat.title}</p>
              <p className="text-xl font-semibold text-gray-900">
                {stat.value}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
