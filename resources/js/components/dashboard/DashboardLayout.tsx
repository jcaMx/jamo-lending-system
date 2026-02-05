import CustomerSidebar from '../../../js/components/sidebars/CustomerSidebar'
import { SidebarProvider } from '@/components/ui/sidebar'

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen w-screen bg-gray-50 overflow-x-hidden">
        <CustomerSidebar />
        <div className="ml-64 min-h-screen w-[calc(100vw-16rem)]">
          <main className="p-4 lg:p-6 w-full max-w-none">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
