import CustomerSidebar from '@/components/sidebars/CustomerSidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { TopBar } from './TopBar'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <CustomerSidebar />
      <SidebarInset className="flex min-h-screen min-w-0 flex-col overflow-x-hidden bg-gray-50">
        <TopBar />
        <main className="min-w-0 flex-1 overflow-x-hidden px-4 py-4 lg:px-8 lg:py-6">
          <div className="mx-auto w-full max-w-none">
            {children}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
