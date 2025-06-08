// app/loading.tsx (for root level) or app/dashboard/loading.tsx (for specific routes)

import { Loader2, CheckCircle2 } from "lucide-react";

export default function AuthLoading() {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-card p-8 rounded-lg shadow-lg border flex flex-col items-center space-y-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <CheckCircle2 className="absolute inset-0 m-auto w-6 h-6 text-primary animate-pulse" />
        </div>
        <div className="text-center">
          <h3 className="text-lg font-semibold text-foreground">Loading...</h3>
          <p className="text-sm text-muted-foreground mt-1">Please wait a moment...</p>
        </div>
      </div>
    </div>
  );
}