// borrowers/edit.tsx
import { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';

type Borrower = {
  ID: number;
  fName: string;
  lName: string;
  email: string;
  phoneNumber: string;
  city: string;
  address: string;
  status: string;
};

export default function EditBorrower({ borrower }: { borrower: Borrower }) {
  const [formData, setFormData] = useState({
    fName: '',
    lName: '',
    email: '',
    phoneNumber: '',
    city: '',
    address: '',
    status: '',
  });

  useEffect(() => {
    setFormData({
      fName: borrower.fName || '',
      lName: borrower.lName || '',
      email: borrower.email || '',
      phoneNumber: borrower.phoneNumber || '',
      city: borrower.city || '',
      address: borrower.address || '',
      status: borrower.status || '',
    });
  }, [borrower]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.put(`/borrowers/${borrower.ID}`, formData, {
      onSuccess: () => console.log('Borrower updated successfully!'),
    });
  };

  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Borrowers', href: '/borrowers' },
    { title: `${borrower.fName} ${borrower.lName}`, href: `/borrowers/view/${borrower.ID}` },
    { title: 'Edit', href: `/borrowers/edit/${borrower.ID}` },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Edit Borrower: ${borrower.fName} ${borrower.lName}`} />
      <div className="w-full mx-auto bg-white shadow-lg rounded-2xl p-10 mb-16 border border-gray-100">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input
                type="text"
                name="fName"
                value={formData.fName}
                onChange={handleChange}
                className="w-full p-2.5 border rounded-md focus:ring-yellow-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input
                type="text"
                name="lName"
                value={formData.lName}
                onChange={handleChange}
                className="w-full p-2.5 border rounded-md focus:ring-yellow-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2.5 border rounded-md focus:ring-yellow-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full p-2.5 border rounded-md focus:ring-yellow-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full p-2.5 border rounded-md focus:ring-yellow-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full p-2.5 border rounded-md focus:ring-yellow-300"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full p-2.5 border rounded-md focus:ring-yellow-300"
              >
                <option value="">Select Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Closed">Closed</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button asChild variant="outline">
              <Link href={`/borrowers/view/${borrower.ID}`}>Cancel</Link>
            </Button>
            <Button type="submit" className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 px-6 py-2 rounded-md">
              Update
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
