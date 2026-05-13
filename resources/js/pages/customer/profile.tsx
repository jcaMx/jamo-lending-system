import { Head, usePage } from '@inertiajs/react';
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
        <div className="bg-white rounded-3xl p-8 shadow-sm ring-1 ring-gray-200/60 border-l-4 border-[#D97706]">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
              <div className="h-20 w-20 rounded-3xl bg-[#D97706]/10 flex items-center justify-center text-[#D97706] text-3xl font-bold shadow-inner">
                {displayProfile.name?.charAt(0)}
              </div>

              <div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                  {displayProfile.name}
                </h1>
                <p className="text-sm font-medium text-gray-400 mt-1 uppercase tracking-widest">
                  Member since {displayProfile.joinDate || "—"}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  disabled={!borrower}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#D97706] text-white rounded-2xl hover:bg-orange-600 transition-all duration-300 shadow-md hover:shadow-orange-200 font-bold text-sm uppercase tracking-wider disabled:opacity-50"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit Profile
                </button>
              ) : (
                <>
                  <button
                    onClick={handleSave}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-2xl hover:bg-emerald-600 transition-all duration-300 shadow-md hover:shadow-emerald-200 font-bold text-sm uppercase tracking-wider"
                  >
                    <Save className="w-4 h-4" />
                    Save Changes
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-600 rounded-2xl hover:bg-gray-200 transition-all duration-300 font-bold text-sm uppercase tracking-wider"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            {/* Profile Info Card */}
            {borrower ? (
              <div className="bg-white rounded-3xl shadow-sm ring-1 ring-gray-200/70 p-8">
                <h3 className="text-lg font-bold text-gray-900 mb-8 tracking-tight">
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-sm">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5 text-[#D97706]" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Email Address</p>
                      <p className="font-bold text-gray-900 break-all">{displayProfile.email}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5 text-[#D97706]" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Contact Number</p>
                      <p className="font-bold text-gray-900">{displayProfile.contact}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 sm:col-span-2">
                    <div className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-[#D97706]" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Residential Address</p>
                      <p className="font-bold text-gray-900 leading-relaxed">{displayProfile.address}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <NoLoansPlaceholder message="You don't have a borrower profile yet. Please apply for a loan to create one." />
            )}

            {/* Profile Edit Form */}
            {isEditing && borrower && (
              <div className="bg-white rounded-3xl shadow-sm ring-1 ring-gray-200/70 p-8 border-t-4 border-emerald-500">
                <h3 className="text-lg font-bold text-gray-900 mb-8 tracking-tight">
                  Edit Profile Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                    <input
                      type="text"
                      value={editedProfile.name}
                      onChange={(e) => setEditedProfile({...editedProfile, name: e.target.value})}
                      className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#D97706] transition-all font-medium text-gray-900"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Email</label>
                    <input
                      type="email"
                      value={editedProfile.email}
                      onChange={(e) => setEditedProfile({...editedProfile, email: e.target.value})}
                      className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#D97706] transition-all font-medium text-gray-900"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Contact Number</label>
                    <input
                      type="tel"
                      value={editedProfile.contact}
                      onChange={(e) => setEditedProfile({...editedProfile, contact: e.target.value})}
                      className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#D97706] transition-all font-medium text-gray-900"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">City</label>
                    <input
                      type="text"
                      value={editedProfile.city}
                      onChange={(e) => setEditedProfile({...editedProfile, city: e.target.value})}
                      className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#D97706] transition-all font-medium text-gray-900"
                    />
                  </div>
                  <div className="sm:col-span-2 space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Address</label>
                    <textarea
                      value={editedProfile.address}
                      onChange={(e) => setEditedProfile({...editedProfile, address: e.target.value})}
                      rows={3}
                      className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#D97706] transition-all font-medium text-gray-900 resize-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Zip Code</label>
                    <input
                      type="text"
                      value={editedProfile.zipcode}
                      onChange={(e) => setEditedProfile({...editedProfile, zipcode: e.target.value})}
                      className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#D97706] transition-all font-medium text-gray-900"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Account Information */}
          <div className="bg-white rounded-2xl shadow-sm ring-1 ring-gray-200/70 p-6 h-fit">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                  <User className="h-5 w-5" style={{ color: "#D97706" }} />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Customer ID</p>
                  <p className="text-sm font-medium text-foreground">{displayProfile.id || "-"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                  <Calendar className="h-5 w-5" style={{ color: "#D97706" }} />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Member Since</p>
                  <p className="text-sm font-medium text-foreground">
                    {displayProfile.joinDate
                      ? new Date(displayProfile.joinDate).toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' })
                      : "-"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                  <MapPin className="h-5 w-5" style={{ color: "#D97706" }} />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Address</p>
                  <p className="text-sm font-medium text-foreground">{displayProfile.address}</p>
                </div>
              </div>
              {/* <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                  <MapPin className="h-5 w-5" style={{ color: "#D97706" }} />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">City</p>
                  <p className="text-sm font-medium text-foreground">{displayProfile.city}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                  <MapPin className="h-5 w-5" style={{ color: "#D97706" }} />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Zip Code</p>
                  <p className="text-sm font-medium text-foreground">{displayProfile.zipcode}</p>
                </div>
              </div> */}

            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
