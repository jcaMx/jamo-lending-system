import { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function Show() {
  const { props } = usePage();
  const borrower = props.borrower; // comes from Laravel controller
  const [activeTab, setActiveTab] = useState('profile');

  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Borrowers', href: '/borrowers' },
    { title: borrower?.name || 'Borrower Details', href: `/borrowers/${borrower?.id}` },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Borrower: ${borrower?.name}`} />

      <div className="p-6 space-y-6">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-800">
            {borrower?.name}
          </h1>
          <Button asChild>
            <Link href="/borrowers">Back to List</Link>
          </Button>
        </div>

        {/* Tabs Navigation */}
        <div className="border-b border-gray-200 flex gap-6">
          {['profile', 'loans', 'repayments'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 text-sm font-medium transition-all ${
                activeTab === tab
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="mt-4">
          {activeTab === 'profile' && (
            <Card>
              <CardContent className="p-4 space-y-2">
                <p><strong>Email:</strong> {borrower.email}</p>
                <p><strong>Phone:</strong> {borrower.phone}</p>
                <p><strong>Address:</strong> {borrower.address}</p>
              </CardContent>
            </Card>
          )}

          {activeTab === 'loans' && (
            <Card>
              <CardContent className="p-4">
                <p>Borrower’s loans list will appear here.</p>
              </CardContent>
            </Card>
          )}

          {activeTab === 'repayments' && (
            <Card>
              <CardContent className="p-4">
                <p>Repayment history will appear here.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
