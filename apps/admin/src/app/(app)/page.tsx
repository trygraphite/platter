import { AppSidebar } from "@/components/navigation/app-sidebar";

import DynamicBreadcrumb from "@/components/navigation/dynamic-breadcrumb";
import { Separator } from "@platter/ui/components/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@platter/ui/components/sidebar";
import PageContent from "./page-component";

export default function Page() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 border-b">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <DynamicBreadcrumb />
          </div>
        </header>
        <main className="p-4">
          <PageContent />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
