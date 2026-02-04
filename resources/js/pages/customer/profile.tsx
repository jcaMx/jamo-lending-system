import { Head } from '@inertiajs/react';
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { ProfileCard } from "@/components/dashboard/ProfileCard";
import { customerProfile } from "@/data/dummyData";
import { useState } from 'react';
import { Mail, Phone, MapPin, Calendar, User, Edit2, Save, X } from 'lucide-react';

export default function CustomerProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({
    name: customerProfile.name,
    email: customerProfile.email,
    contact: customerProfile.contact,
    address: customerProfile.address,
  });

  const handleSave = () => {
    // Here you would typically save to backend
    console.log('Saving profile:', editedProfile);
    setIsEditing(false);
    // Update the customerProfile with new data (in a real app, this would come from the backend)
  };

  const handleCancel = () => {
    setEditedProfile({
      name: customerProfile.name,
      email: customerProfile.email,
      contact: customerProfile.contact,
      address: customerProfile.address,
    });
    setIsEditing(false);
  };

  return (
    <DashboardLayout>
      <Head title="My Profile" />

      <div className="space-y-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1.5">
            <p className="text-xl md:text-2xl font-semibold text-gray-900">My Profile</p>
            <p className="text-sm text-gray-600 max-w-xl">
              Manage your personal details and keep your account information up to date.
            </p>
          </div>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white text-gray-900 rounded-full border border-gray-200 hover:bg-gray-50 transition"
            >
              <Edit2 className="w-4 h-4" />
              Edit Profile
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-full hover:bg-emerald-600 transition"
              >
                <Save className="w-4 h-4" />
                Save
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 px-4 py-2 text-white rounded-full transition"
                style={{ backgroundColor: "#D97706" }}
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
            </div>
          )}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <ProfileCard customer={customerProfile} />

            {/* Profile Edit Form */}
            {isEditing && (
              <div className="bg-white rounded-2xl shadow-sm ring-1 ring-gray-200/70 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Profile Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={editedProfile.name}
                      onChange={(e) => setEditedProfile({...editedProfile, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D97706] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={editedProfile.email}
                      onChange={(e) => setEditedProfile({...editedProfile, email: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D97706] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                    <input
                      type="tel"
                      value={editedProfile.contact}
                      onChange={(e) => setEditedProfile({...editedProfile, contact: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D97706] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <textarea
                      value={editedProfile.address}
                      onChange={(e) => setEditedProfile({...editedProfile, address: e.target.value})}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D97706] focus:border-transparent"
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
                  <p className="text-sm font-medium text-foreground">{customerProfile.id}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                  <Calendar className="h-5 w-5" style={{ color: "#D97706" }} />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Member Since</p>
                  <p className="text-sm font-medium text-foreground">{new Date(customerProfile.joinDate).toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                  <Mail className="h-5 w-5" style={{ color: "#D97706" }} />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Email</p>
                  <p className="text-sm font-medium text-foreground">{customerProfile.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                  <Phone className="h-5 w-5" style={{ color: "#D97706" }} />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Contact</p>
                  <p className="text-sm font-medium text-foreground">{customerProfile.contact}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                  <MapPin className="h-5 w-5" style={{ color: "#D97706" }} />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Address</p>
                  <p className="text-sm font-medium text-foreground">{customerProfile.address}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
