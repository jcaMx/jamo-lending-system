import CustomerSidebar from '@/components/sidebars/CustomerSidebar'
import { SidebarProvider } from '@/components/ui/sidebar'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SidebarProvider className="h-screen w-screen overflow-hidden">
      <div className="flex h-full w-full bg-gray-50 overflow-hidden">
        <CustomerSidebar />
        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-auto p-4 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}
