import { Toaster } from "@platter/ui/components/sonner";
import type React from "react";

function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <Toaster />
    </>
  );
}

export default Providers;
