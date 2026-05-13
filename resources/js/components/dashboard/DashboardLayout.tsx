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
      <SidebarInset>
        <TopBar />
        <main className="flex-1 p-4 lg:p-8 transition-all duration-300">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
