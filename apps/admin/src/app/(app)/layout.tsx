"use client"

import { AppSidebar } from "@/components/navigation/app-sidebar";
import DynamicBreadcrumb from "@/components/navigation/dynamic-breadcrumb";
import { NotificationCenter } from "@/components/navigation/notification-alert";
import GlobalLoading from "@/components/shared/global-loader";
import { ToastProvider } from "@/context/toast-context";
import { useSession } from "@/lib/auth/client";
import { Separator } from "@platter/ui/components/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@platter/ui/components/sidebar";


// Get the API URL from environment variables or use a default
const SERVER_URL = process.env.NEXT_PUBLIC_SOCKET_SERVER_URL || "http://localhost:3002";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  
  return (
    <ToastProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 border-b">
            <div className="flex items-center gap-2 px-4 flex-1">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <DynamicBreadcrumb />
              
              {/* Add notification center to the right side of the header */}
              <div className="ml-auto mr-[10%] flex items-center">
                {userId && (
                  <NotificationCenter 
                    serverUrl={SERVER_URL} 
                    userId={userId} 
                  />
                )}
              </div>
            </div>
          </header>
          <main className="p-4">
          <GlobalLoading />
          {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </ToastProvider>
  );
}