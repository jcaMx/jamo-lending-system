import { PropsWithChildren } from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import CustomerSidebar from '@/components/sidebars/CustomerSidebar';
import { TopBar } from '@/components/dashboard/TopBar';

export default function CustomerLayout({ children }: PropsWithChildren) {
  return (
    <SidebarProvider>
      <CustomerSidebar />
      <SidebarInset className="flex flex-col min-h-screen overflow-x-hidden bg-gray-50">
        <TopBar />
        <div className="flex-1 p-4 lg:p-8 w-full max-w-7xl mx-auto">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
