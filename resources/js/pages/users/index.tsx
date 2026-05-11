import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage, router} from '@inertiajs/react';
import axios from 'axios';
import { useEffect, useMemo, useState } from 'react';
import { Eye, Edit, Trash2, UserPlus, RotateCcw } from 'lucide-react';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { toast } from 'sonner';


const breadcrumbs: BreadcrumbItem[] = [
  { title: 'System Users', href: '/users' },
];

type User = {
  id: number;
  username: string;
  fName: string;
  lName: string;
  role: string;
  status: string;      // 'active' | 'inactive'
  lastLogin: string;
  email?: string;
  deleted_at?: string | null;
};
type UsersProp = User[] | { data?: User[] };
type UserActionResponse = {
  success: boolean;
  message?: string;
};

export default function Index({ users }: { users: UsersProp }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRestoringUserId, setIsRestoringUserId] = useState<number | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const user = usePage().props.auth.user as { role?: string } | undefined;

  const list = useMemo<User[]>(() => {
    if (Array.isArray(users)) {
      return users;
    }

    if (users && Array.isArray(users.data)) {
      return users.data;
    }

    return [];
  }, [users]);

  const [userRows, setUserRows] = useState<User[]>([]);
  
  useEffect(() => {
    setUserRows(list);
  }, [list]);

  const isUserInactive = (user: User) =>
    Boolean(user.deleted_at) || user.status?.toLowerCase() === 'inactive';

  const filteredUsers = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return userRows.filter((user) => {
      const userStatus = isUserInactive(user) ? 'inactive' : 'active';
      const matchesSearch =
        normalizedSearch.length === 0 ||
        [
          user.username || '',
          user.fName || '',
          user.lName || '',
          `${user.fName || ''} ${user.lName || ''}`,
          user.role || '',
          userStatus,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
          .includes(normalizedSearch);

      const matchesStatus =
        statusFilter === 'all' ||
        userStatus === statusFilter;

      const matchesRole =
        roleFilter === 'all' ||
        (user.role && user.role.toLowerCase() === roleFilter.toLowerCase());

      return matchesSearch && matchesStatus && matchesRole;
    });
  }, [userRows, search, statusFilter, roleFilter]);

  const handleDelete = async () => {
    if (!userToDelete) return;

    setIsDeleting(true);
    try {
      const response = await axios.delete<UserActionResponse>(`/users/${userToDelete.id}`, {
        headers: {
          Accept: 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
      });

      if (!response.data?.success) {
        throw new Error(response.data?.message || 'User could not be deactivated.');
      }

      setUserRows((currentUsers) =>
        currentUsers.map((user) =>
          user.id === userToDelete.id
            ? {
                ...user,
                status: 'inactive',
                deleted_at: new Date().toISOString(),
              }
            : user,
        ),
      );
      toast.success(response.data.message || 'User deactivated successfully');
      setIsDeleteDialogOpen(false);
      setUserToDelete(null);
    } catch (error) {
      const message = axios.isAxiosError<UserActionResponse>(error)
        ? error.response?.data?.message || 'Failed to deactivate user'
        : 'Failed to deactivate user';

      toast.error(message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleRestore = async (user: User) => {
    setIsRestoringUserId(user.id);

    try {
      const response = await axios.post<UserActionResponse>(
        `/users/${user.id}/restore`,
        {},
        {
          headers: {
            Accept: 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
          },
        },
      );

      if (!response.data?.success) {
        throw new Error(response.data?.message || 'User could not be restored.');
      }

      setUserRows((currentUsers) =>
        currentUsers.map((currentUser) =>
          currentUser.id === user.id
            ? {
                ...currentUser,
                status: 'active',
                deleted_at: null,
              }
            : currentUser,
        ),
      );
      toast.success(response.data.message || 'User restored successfully');
    } catch (error) {
      const message = axios.isAxiosError<UserActionResponse>(error)
        ? error.response?.data?.message || 'Failed to restore user'
        : 'Failed to restore user';

      toast.error(message);
    } finally {
      setIsRestoringUserId(null);
    }
  };

  const confirmDelete = (user: User) => {
    setUserToDelete(user);
    setIsDeleteDialogOpen(true);
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="System Users" />

      <div className="w-full h-full mx-auto bg-white shadow-lg rounded-2xl p-8 mb-16 border border-gray-100 flex flex-col space-y-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between border-b pb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
            <p className="text-sm text-gray-500">Manage system users and their roles.</p>
          </div>
          {user?.role === 'admin' && (
            <Link href="/users/add">
              <Button className="bg-[#FABF24] hover:bg-yellow-600 flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                <span>Create New User</span>
              </Button>
            </Link>
          )}

        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-gray-50/50 p-4 rounded-xl border border-gray-100">
          <div className="relative w-full md:max-w-sm">
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search users…"
              className="w-full rounded-lg border border-gray-300 pl-4 pr-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all"
            />
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <label htmlFor="status-filter" className="text-sm font-medium text-gray-700 whitespace-nowrap">
                Status:
              </label>
              <select
                id="status-filter"
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value as typeof statusFilter)
                }
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 min-w-[110px]"
              >
                <option value="all">All</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="role-filter" className="text-sm font-medium text-gray-700 whitespace-nowrap">
                Role:
              </label>
              <select
                id="role-filter"
                value={roleFilter}
                onChange={(event) => setRoleFilter(event.target.value)}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 min-w-[110px]"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="cashier">Cashier</option>
                <option value="customer">Customer</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded-lg shadow-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left px-4 py-2 font-medium text-gray-700">User No.</th>
                <th className="text-left px-4 py-2 font-medium text-gray-700">Username</th>
                <th className="text-left px-4 py-2 font-medium text-gray-700">Full Name</th>
                <th className="text-left px-4 py-2 font-medium text-gray-700">Role</th>
                <th className="text-left px-4 py-2 font-medium text-gray-700">Status</th>
                <th className="text-left px-4 py-2 font-medium text-gray-700">Last Login</th>
                <th className="text-center px-4 py-2 font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-gray-500">
                    No users found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const isInactive = isUserInactive(user);

                  return (
                    <tr
                      key={user.id}
                      onClick={(e) => {
                        if ((e.target as HTMLElement).closest('a, button')) return;
                        router.visit(`/users/${user.id}`);
                      }}
                      className="border-b hover:bg-gray-50 cursor-pointer"
                    >
                      <td className="px-4 py-2">{user.id}</td>
                      <td className="px-4 py-2">{user.username}</td>
                      <td className="px-4 py-2">{`${user.fName} ${user.lName}`}</td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          user.role?.toLowerCase() === 'admin'
                            ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                            : user.role?.toLowerCase() === 'cashier'
                              ? 'bg-amber-100 text-amber-700 border border-amber-200'
                              : user.role?.toLowerCase() === 'customer'
                                ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                                : 'bg-gray-100 text-gray-700 border border-gray-200'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            isInactive ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {isInactive ? 'Inactive' : 'Active'}
                        </span>
                      </td>
                      <td className="px-4 py-2">{user.lastLogin}</td>
                      <td className="px-4 py-4 text-center space-x-2">
                        <div className="flex items-center justify-center gap-2">
                          <Link href={`/users/${user.id}`}>
                            <Button variant="outline" size="sm" className="h-8 w-8 p-0 text-[#A47B06] border-amber-200 hover:bg-amber-50">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Link href={`/users/${user.id}/edit`}>
                            <Button variant="outline" size="sm" className="h-8 w-8 p-0 text-amber-600 border-amber-200 hover:bg-amber-50">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          {!isInactive ? (
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0 text-red-600 border-red-200 hover:bg-red-50"
                              onClick={(e) => {
                                e.stopPropagation();
                                confirmDelete(user);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 w-8 p-0 text-green-600 border-green-200 hover:bg-green-50"
                              disabled={isRestoringUserId === user.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRestore(user);
                              }}
                              title="Restore User"
                            >
                              <RotateCcw className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>


          </table>
        </div>
      </div>
      <ConfirmDialog
        open={isDeleteDialogOpen}
        title="Deactivate User Account"
        description={`Are you sure you want to deactivate ${userToDelete?.fName} ${userToDelete?.lName}'s account? This will prevent them from logging into the system.`}
        confirmText="Deactivate"
        cancelText="Cancel"
        onConfirm={handleDelete}
        onCancel={() => setIsDeleteDialogOpen(false)}
        isLoading={isDeleting}
      />
    </AppLayout>
  );
}
