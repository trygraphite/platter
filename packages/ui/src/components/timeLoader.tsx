// components/ui/hourglass-loader.tsx
"use client";
import "../styles/glassLoader.css";
import { cn } from "../lib/utils";

interface HourglassLoaderProps {
  className?: string;
  label?: string;
  fullScreen?: boolean;
}

export function HourglassLoader({
  className,
  label,
  fullScreen = false,
}: HourglassLoaderProps) {
  const containerClasses = fullScreen
    ? "fixed inset-0 flex items-center justify-center bg-white/80 z-50"
    : "flex items-center justify-center";

  return (
    <div className={containerClasses}>
      <div className="flex flex-col items-center">
        <div className={cn("loader", className)} />
        {label && <span className="mt-4 text-sm text-gray-600">{label}</span>}
      </div>
    </div>
  );
}