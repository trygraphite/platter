import { EdgeStoreProvider } from "@/lib/edgestore/edgestore";
import { Toaster } from "@platter/ui/components/sonner";
import type React from "react";

function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <EdgeStoreProvider>
        {children}
        <Toaster />
      </EdgeStoreProvider>
    </>
  );
}

export default Providers;
