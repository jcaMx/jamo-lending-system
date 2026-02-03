import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
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

  // OCP applied: To add a new role, you just add a new key/value to this object. No other logic changes.

};

// Add breadcrumbs to the props interface
export default function AppLayout({ children, breadcrumbs }: { children: React.ReactNode; breadcrumbs?: BreadcrumbItem[] }) {
  const { props } = usePage();


  // Cursor prompt debug
  console.group('🟢 AppLayout Debug Cursor');
  console.log('props.auth:', props.auth);
  console.log('children type:', typeof children);
  console.groupEnd();

  const roles: string[] = props.auth?.roles ?? [];
  const matchedRole = roles.find(role => SidebarRegistry[role]);
  const SidebarComponent = matchedRole
    ? SidebarRegistry[matchedRole]
    : CustomerSidebar; // safe fallback

  return (
    <SidebarProvider>
      <div className="flex h-screen">
        <SidebarComponent /> {/* dynamically selected sidebar */}
        <main className="flex-1 overflow-y-auto">
          {/* You can render breadcrumbs here if needed */}
          {breadcrumbs && (
            <nav className="p-4">
              {/* Add your breadcrumb rendering logic here */}
            </nav>
          )}
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}