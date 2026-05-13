import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';
import { usePage } from '@inertiajs/react';
import { AppSidebar as StaffSidebar } from '@/components/sidebars/StaffSidebar';
import CustomerSidebar from '@/components/sidebars/CustomerSidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { TopBar } from '@/components/dashboard/TopBar';

const SidebarRegistry: Record<string, React.FC> = {
  customer: CustomerSidebar,
  admin: StaffSidebar,
  cashier: StaffSidebar,
};

interface AppLayoutProps {
  children: ReactNode;
  breadcrumbs?: BreadcrumbItem[];
}

export default function AppLayout({ children, breadcrumbs }: AppLayoutProps) {
  const { props } = usePage();

  const roles: string[] = props.auth?.roles ?? [];
  const matchedRole = roles.find(role => SidebarRegistry[role]);
  const SidebarComponent = matchedRole
    ? SidebarRegistry[matchedRole]
    : CustomerSidebar;

  if (matchedRole === 'customer') {
    return (
      <SidebarProvider>
        <CustomerSidebar />
        <SidebarInset>
          <div className="flex h-full flex-col">
            <TopBar />
            <main className="flex-1 overflow-auto p-4 lg:p-6">
              {breadcrumbs && (
                <div className="mb-4 px-1 text-sm text-gray-500">
                  {breadcrumbs.map((b, i) => (
                    <span key={i}>
                      {b.title}
                      {i < breadcrumbs.length - 1 && ' / '}
                    </span>
                  ))}
                </div>
              )}
              {children}
            </main>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider className="h-screen w-screen overflow-hidden">
      <SidebarComponent />
      <SidebarInset>
        <div className="flex h-full w-full bg-gray-50 overflow-hidden flex-col">
          <TopBar />
          {/* Page content */}
          <main className="flex-1 overflow-auto p-6">
            {breadcrumbs && (
              <div className="mb-4 text-sm text-gray-500">
                {breadcrumbs.map((b, i) => (
                  <span key={i}>
                    {b.title}
                    {i < breadcrumbs.length - 1 && ' / '}
                  </span>
                ))}
              </div>
            )}
            {children}
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
