"use client";
import * as LucideIcons from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import {
  animateValue,
  formatCurrency,
  formatNumberWithCommas,
} from "../../../../../packages/ui/src/lib/utils";

interface AnimatedStatsCardProps {
  title: string;
  value: number;
  iconName?: keyof typeof LucideIcons;
  description?: string;
  formatType?: string;
  currency?: string;
  suffix?: string;
  duration?: number;
  className?: string;
}

const AnimatedStatsCard = ({
  title,
  value,
  iconName,
  description = "",
  formatType = "number",
  currency = "₦",
  suffix = "", // Default empty suffix
  duration = 1000,
  className = "",
}: AnimatedStatsCardProps) => {
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    animateValue(0, value, duration, setAnimatedValue);
  }, [value, duration]);

  // Format the displayed value based on type
  const formattedValue = (() => {
    switch (formatType) {
      case "currency":
        return formatCurrency(animatedValue, "en-NG", currency);
      case "plain":
        return animatedValue.toString() + suffix; // Add suffix for plain format
      default:
        return formatNumberWithCommas(animatedValue.toString()) + suffix; // Add suffix for number format
    }
  })();
  const IconComponent = iconName
    ? (LucideIcons[iconName] as React.ElementType)
    : null;

  return (
    <div
      className={`rounded-lg border bg-white p-6 flex flex-col ${className}`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        {IconComponent && (
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50">
            <IconComponent className="h-4 w-4 text-blue-500" />
          </div>
        )}
      </div>
      <div className="text-2xl font-bold">{formattedValue}</div>
      {description && (
        <p className="text-xs text-gray-500 mt-1">{description}</p>
      )}
    </div>
  );
};

export default AnimatedStatsCard;
