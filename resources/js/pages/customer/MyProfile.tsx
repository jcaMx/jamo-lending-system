import { Head, Link, usePage } from '@inertiajs/react';
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { ProfileCard } from "@/components/dashboard/ProfileCard";
import NoLoansPlaceholder from "@/components/dashboard/NoLoansPlaceholder";
import { useEffect, useMemo, useState } from 'react';
import { Mail, Phone, MapPin, Calendar, User, Edit2, Save, X } from 'lucide-react';
import { router } from '@inertiajs/react';
import { route } from 'ziggy-js';



type BorrowerProfile = {
  id?: string | number;
  name?: string;
  first_name?: string;
  last_name?: string;
  age?: number | null;
  occupation?: string | null;
  gender?: string | null;
  address?: string | null;
  city?: string | null;
  zipcode?: string | null;
  email?: string | null;
  mobile?: string | null;
  membership_date?: string | null;
};

// type PageProps = {
//   borrower?: BorrowerProfile | null;
// };



export default function CustomerProfile() {
  // const { borrower } = usePage<PageProps>().props;
  const { borrower, hasBorrower = true } = usePage().props as {
    borrower?: BorrowerProfile | null;
    hasBorrower?: boolean;
  };
  const [isEditing, setIsEditing] = useState(false);

  if (!hasBorrower) {
    return (
      <DashboardLayout>
        <Head title="Repayments" />
        <div className="m-4">
          <NoLoansPlaceholder message="You don't have a borrower profile yet. Please apply for a loan to create one." />
        </div>
      </DashboardLayout>
    );
  }

  const displayProfile = useMemo(() => {
    const fullName = borrower?.name?.trim()
      || [borrower?.first_name, borrower?.last_name].filter(Boolean).join(" ")
      || "Customer";

    return {
      id: String(borrower?.id ?? ""),
      name: fullName,
      email: borrower?.email ?? "-",
      contact: borrower?.mobile ?? "-",
      address: borrower?.address
        ? [borrower?.address, borrower?.city, borrower?.zipcode].filter(Boolean).join(", ")
        : "-",
      joinDate: borrower?.membership_date ?? "",
      age: borrower?.age ?? null,
      occupation: borrower?.occupation ?? "-",
      gender: borrower?.gender ?? "-",
      city: borrower?.city ?? "-",
      zipcode: borrower?.zipcode ?? "-",
    };
  }, [borrower]);

  const [editedProfile, setEditedProfile] = useState({
    name: displayProfile.name,
    email: displayProfile.email === "-" ? "" : displayProfile.email,
    contact: displayProfile.contact === "-" ? "" : displayProfile.contact,
    address: displayProfile.address === "-" ? "" : displayProfile.address,
    city: displayProfile.city === "-" ? "" : displayProfile.city,
    zipcode: displayProfile.zipcode === "-" ? "" : displayProfile.zipcode,
  });


  useEffect(() => {
    setEditedProfile({
      name: displayProfile.name,
      email: displayProfile.email === "-" ? "" : displayProfile.email,
      contact: displayProfile.contact === "-" ? "" : displayProfile.contact,
      address: displayProfile.address === "-" ? "" : displayProfile.address,
      city: displayProfile.city === "-" ? "" : displayProfile.city,
      zipcode: displayProfile.zipcode === "-" ? "" : displayProfile.zipcode,
    });
  }, [displayProfile]);

  const handleSave = () => {
    router.put(route('customer.profile.update'), {
      first_name: editedProfile.name.split(' ')[0],
      last_name: editedProfile.name.split(' ').slice(1).join(' '),
      email: editedProfile.email,
      mobile: editedProfile.contact,
      address: editedProfile.address,
      city: editedProfile.city,
      zipcode: editedProfile.zipcode,
    });
  };


  const handleCancel = () => {
    setEditedProfile({
      name: displayProfile.name,
      email: displayProfile.email === "-" ? "" : displayProfile.email,
      contact: displayProfile.contact === "-" ? "" : displayProfile.contact,
      address: displayProfile.address === "-" ? "" : displayProfile.address,
            city: displayProfile.city === "-" ? "" : displayProfile.city,
      zipcode: displayProfile.zipcode === "-" ? "" : displayProfile.zipcode,
    });
    setIsEditing(false);
  };

  return (
    <DashboardLayout>
      <Head title="My Profile" />

      <div className="space-y-8">

        {/* ===== Header Section ===== */}
        <div className="bg-gradient-to-r from-orange-50 to-white rounded-3xl p-6 md:p-8 shadow-sm ring-1 ring-gray-200/60">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-[#D97706]/10 flex items-center justify-center text-[#D97706] text-xl font-semibold">
                {displayProfile.name?.charAt(0)}
              </div>

              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  {displayProfile.name}
                </h1>
                <p className="text-sm text-gray-600">
                  Member since {displayProfile.joinDate || "—"}
                </p>
              </div>
            </div>

            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#D97706] text-white rounded-xl hover:bg-orange-600 transition shadow-sm"
              >
                <Edit2 className="w-4 h-4" />
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition shadow-sm"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 transition"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ===== Main Grid ===== */}
        <div className="grid gap-8 lg:grid-cols-3">

          {/* ===== Left Column ===== */}
          <div className="space-y-8 lg:col-span-2">

            {/* Profile Info Card */}
            <div className="bg-white rounded-3xl shadow-sm ring-1 ring-gray-200/70 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Personal Information
              </h3>

              <div className="grid md:grid-cols-2 gap-6 text-sm">

                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-[#D97706] mt-1" />
                  <div>
                    <p className="text-gray-500">Email</p>
                    <p className="font-medium text-gray-900">{displayProfile.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-[#D97706] mt-1" />
                  <div>
                    <p className="text-gray-500">Contact</p>
                    <p className="font-medium text-gray-900">{displayProfile.contact}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 md:col-span-2">
                  <MapPin className="w-4 h-4 text-[#D97706] mt-1" />
                  <div>
                    <p className="text-gray-500">Address</p>
                    <p className="font-medium text-gray-900">{displayProfile.address}</p>
                  </div>
                </div>

              </div>
            </div>

            {/* ===== Edit Form ===== */}
            {isEditing && borrower && (
              <div className="bg-white rounded-3xl shadow-sm ring-1 ring-gray-200/70 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Edit Profile
                </h3>

                <div className="grid md:grid-cols-2 gap-6">

                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Full Name</label>
                    <input
                      type="text"
                      value={editedProfile.name}
                      onChange={(e) =>
                        setEditedProfile({ ...editedProfile, name: e.target.value })
                      }
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#D97706] focus:border-transparent"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      value={editedProfile.email}
                      onChange={(e) =>
                        setEditedProfile({ ...editedProfile, email: e.target.value })
                      }
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#D97706]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Contact</label>
                    <input
                      type="tel"
                      value={editedProfile.contact}
                      onChange={(e) =>
                        setEditedProfile({ ...editedProfile, contact: e.target.value })
                      }
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#D97706]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">City</label>
                    <input
                      type="text"
                      value={editedProfile.city}
                      onChange={(e) =>
                        setEditedProfile({ ...editedProfile, city: e.target.value })
                      }
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#D97706]"
                    />
                  </div>

                  <div className="md:col-span-2 space-y-1">
                    <label className="text-sm font-medium text-gray-700">Address</label>
                    <textarea
                      rows={3}
                      value={editedProfile.address}
                      onChange={(e) =>
                        setEditedProfile({ ...editedProfile, address: e.target.value })
                      }
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#D97706]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Zip Code</label>
                    <input
                      type="text"
                      value={editedProfile.zipcode}
                      onChange={(e) =>
                        setEditedProfile({ ...editedProfile, zipcode: e.target.value })
                      }
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#D97706]"
                    />
                  </div>

                </div>
              </div>
            )}
          </div>

          {/* ===== Right Column ===== */}
          <div className="space-y-8">

            <div className="bg-white rounded-3xl shadow-sm ring-1 ring-gray-200/70 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Security Settings
              </h3>

              <div className="space-y-4">
                <Link
                  href={route('user-password.edit')}
                  className="block w-full text-center px-4 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 transition"
                >
                  Change Password
                </Link>

                <Link
                  href={route('two-factor.show')}
                  className="block w-full text-center px-4 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 transition"
                >
                  Two-Factor Authentication
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>
    </DashboardLayout>
  );

}
