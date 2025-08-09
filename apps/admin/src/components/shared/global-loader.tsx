// components/ui/GlobalLoading.tsx
"use client";

import { Loader2 } from "lucide-react";
import { useNavigationLoading } from "@/hooks/use-navigation-loading";

export default function GlobalLoading() {
  const isLoading = useNavigationLoading();

  if (!isLoading) return null;

  return (
    <>
      {/* Top loading bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-primary/20">
        <div
          className="h-full bg-primary animate-pulse"
          style={{
            animation: "loading-bar 2s ease-in-out infinite",
            background:
              "linear-gradient(90deg, transparent, hsl(var(--primary)), transparent)",
            backgroundSize: "200% 100%",
          }}
        />
      </div>

      {/* Full screen overlay (optional - you can remove this if you only want the top bar) */}
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 flex items-center justify-center">
        <div className="bg-card p-6 rounded-lg shadow-lg border flex flex-col items-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading page...</p>
        </div>
      </div>

      <style jsx>{`
        @keyframes loading-bar {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </>
  );
}
