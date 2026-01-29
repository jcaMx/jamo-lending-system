import { PropsWithChildren } from 'react';
import  CustomerSidebar from '@/components/sidebars/CustomerSidebar';

export default function CustomerLayout({ children }: PropsWithChildren) {
  return (
    <div className="flex h-screen">
      <CustomerSidebar />
      <main className="flex-1 p-6 bg-gray-100">
        {children}
      </main>
    </div>
  );
}
