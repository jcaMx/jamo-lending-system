import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

// test using http://127.0.0.1:8000/users/1

type User = {
  id: number;          // change from ID -> id
  username: string;
  fName: string;
  lName: string;
  role: string;        // primary role
  roles: string[];     // all roles
  permissions: string[];
  email: string;
  status: string;
  lastLogin: string;
};

type ShowProps = {
  user: User;
};

export default function Show({ user }: ShowProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'roles' | 'activity'>('profile');

  // Breadcrumbs
  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'System Users', href: '/users' },
    { title: user.username, href: `/users/${user.id}` }, // id, not ID
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`User: ${user.username}`} />

      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-2xl font-semibold text-gray-800">
            {user.fName} {user.lName}
          </h1>

          <div className="flex gap-2">
            {/* Back Button */}
            <Button asChild variant="outline">
              <Link href="/users">Back to List</Link>
            </Button>

            {/* Edit Button */}
            <Button asChild>
              <Link href={`/users/${user.id}/edit`}>Edit</Link>
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 flex gap-6">
          {['profile', 'roles', 'activity'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as 'profile' | 'roles' | 'activity')}
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
        <div className="mt-4 space-y-4">
          {activeTab === 'profile' && (
            <Card>
              <CardContent className="p-4 space-y-2">
                <p><strong>Username:</strong> {user.username}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Role:</strong> {user.role || (user.roles && user.roles.length > 0 ? user.roles.join(', ') : 'None')}</p>
                <p><strong>Status:</strong> {user.status}</p>
                <p><strong>Last Login:</strong> {user.lastLogin}</p>
              </CardContent>
            </Card>
          )}

          {activeTab === 'roles' && (
            <Card>
              <CardContent className="p-4 space-y-3">
                <div>
                  <p className="font-semibold mb-1">Roles</p>
                  {user.roles.length === 0 ? (
                    <p className="text-sm text-gray-500">No roles assigned.</p>
                  ) : (
                    <ul className="list-disc list-inside text-sm">
                      {user.roles.map((role) => (
                        <li key={role}>{role}</li>
                      ))}
                    </ul>
                  )}
                </div>

                <div>
                  <p className="font-semibold mb-1">Permissions</p>
                  {user.permissions.length === 0 ? (
                    <p className="text-sm text-gray-500">No permissions assigned.</p>
                  ) : (
                    <ul className="list-disc list-inside text-sm">
                      {user.permissions.map((perm) => (
                        <li key={perm}>{perm}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'activity' && (
            <Card>
              <CardContent className="p-4">
                <p>User activity logs will appear here.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
