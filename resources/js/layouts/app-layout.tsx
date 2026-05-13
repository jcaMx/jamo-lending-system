import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';
import { usePage } from '@inertiajs/react';
import { AppSidebar as StaffSidebar } from '@/components/sidebars/StaffSidebar';
import CustomerSidebar from '@/components/sidebars/CustomerSidebar';
import { SidebarProvider } from '@/components/ui/sidebar';

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
        <div className="min-h-screen w-screen bg-gray-50 overflow-x-hidden">
          <SidebarComponent />
          <div className="ml-64 min-h-screen w-[calc(100vw-16rem)]">
            <main className="p-4 lg:p-6 w-full max-w-none">
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
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider className="h-screen w-screen overflow-hidden">
      <div className="flex h-full w-full bg-gray-50 overflow-hidden">
        {/* Sidebar */}
        <SidebarComponent />

        {/* Main content */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Optional breadcrumbs */}
          {breadcrumbs && (
            <div className="px-6 py-3 text-sm text-gray-500">
              {breadcrumbs.map((b, i) => (
                <span key={i}>
                  {b.title}
                  {i < breadcrumbs.length - 1 && ' / '}
                </span>
              ))}
            </div>
          )}

          {/* Page content */}
          <div className="flex-1 overflow-auto p-6">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
