import { Toaster } from "@platter/ui/components/sonner";
import type React from "react";
import { EdgeStoreProvider } from "@/lib/edgestore/edgestore";

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <EdgeStoreProvider>
      {children}
      <Toaster />
    </EdgeStoreProvider>
  );
}

export default Providers;
