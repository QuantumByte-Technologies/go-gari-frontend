"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import { CountrySelector } from "@/components/ui/country-selector";
import {
  Camera,
  CheckCircle,
  PencilSimple,
  User,
  ShieldCheck,
  Phone,
  Spinner,
} from "@phosphor-icons/react";
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
} from "@/redux/api/authApi";
import { toast } from "sonner";
import DocumentsSection from "./DocumentsSection";

export default function ProfileSection() {
  const { data: profile, isLoading, error } = useGetProfileQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const [updateProfile, { isLoading: isUpdating }] =
    useUpdateProfileMutation();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    dob: "",
    country: "",
  });

  // Sync form data when profile loads or editing starts
  useEffect(() => {
    if (profile) {
      setFormData({
        first_name: profile.first_name,
        last_name: profile.last_name,
        dob: profile.dob ?? "",
        country: profile.country ?? "",
      });
    }
  }, [profile]);

  const handleSave = async () => {
    try {
      await updateProfile({
        first_name: formData.first_name,
        last_name: formData.last_name,
        dob: formData.dob || null,
        country: formData.country,
      }).unwrap();
      toast.success("Profile updated successfully");
      setIsEditing(false);
    } catch {
      toast.error("Failed to update profile");
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        first_name: profile.first_name,
        last_name: profile.last_name,
        dob: profile.dob ?? "",
        country: profile.country ?? "",
      });
    }
    setIsEditing(false);
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="space-y-6" data-testid="profile-loading">
        <div className="flex items-center justify-between">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
          <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-gray-200 rounded-full animate-pulse" />
            <div className="space-y-2">
              <div className="h-6 w-40 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                <div className="h-12 bg-gray-200 rounded-xl animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !profile) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
        <p className="text-gray-500 mb-4">Failed to load profile</p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );
  }

  const fullName = `${profile.first_name} ${profile.last_name}`;
  const memberSince = new Date(profile.date_joined).toLocaleDateString(
    "en-US",
    { month: "long", year: "numeric" },
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Profile Settings</h2>

        <div className="flex items-center gap-2">
          {isEditing && (
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
          )}
          <Button
            variant={isEditing ? "default" : "outline"}
            onClick={isEditing ? handleSave : () => setIsEditing(true)}
            disabled={isUpdating}
          >
            {isUpdating ? (
              <span className="inline-flex items-center gap-2">
                <Spinner size={18} className="animate-spin" />
                Saving...
              </span>
            ) : isEditing ? (
              <span className="inline-flex items-center gap-2">
                <CheckCircle size={18} weight="bold" />
                Save Changes
              </span>
            ) : (
              <span className="inline-flex items-center gap-2">
                <PencilSimple size={18} weight="bold" />
                Edit Profile
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* Profile Photo & Status */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="w-24 h-24 bg-linear-to-br from-[#5E9D34] to-[#4a7d29] rounded-full flex items-center justify-center text-white text-3xl font-bold">
              {profile.first_name.charAt(0)}
            </div>
            {isEditing && (
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full border border-gray-200 shadow-sm flex items-center justify-center hover:bg-gray-50">
                <Camera size={16} weight="bold" className="text-gray-600" />
              </button>
            )}
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">{fullName}</h3>
            <p className="text-gray-500">{profile.email}</p>
            <p className="text-sm text-[#5E9D34] mt-1">
              Member since {memberSince}
            </p>
            {/* Verification badges */}
            <div className="flex items-center gap-3 mt-2">
              {profile.is_verified && (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                  <ShieldCheck size={14} weight="fill" />
                  Verified
                </span>
              )}
              {profile.is_phone_verified && (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                  <Phone size={14} weight="fill" />
                  Phone Verified
                </span>
              )}
              {!profile.is_verified && (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                  {profile.verification_status === "pending"
                    ? "Verification Pending"
                    : profile.verification_status === "rejected"
                      ? "Verification Rejected"
                      : "Not Verified"}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
          <User size={20} weight="duotone" className="text-[#5E9D34]" />
          Personal Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-1">
              First Name
            </Label>
            <Input
              value={formData.first_name}
              disabled={!isEditing}
              onChange={(e) =>
                setFormData((p) => ({ ...p, first_name: e.target.value }))
              }
              className="h-12 rounded-xl border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 focus-visible:ring-[#5E9D34]"
            />
          </div>

          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-1">
              Last Name
            </Label>
            <Input
              value={formData.last_name}
              disabled={!isEditing}
              onChange={(e) =>
                setFormData((p) => ({ ...p, last_name: e.target.value }))
              }
              className="h-12 rounded-xl border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 focus-visible:ring-[#5E9D34]"
            />
          </div>

          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </Label>
            <Input
              type="email"
              value={profile.email}
              disabled
              className="h-12 rounded-xl border-gray-200 disabled:bg-gray-50 disabled:text-gray-500"
            />
          </div>

          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </Label>
            <Input
              type="tel"
              value={profile.phone}
              disabled
              className="h-12 rounded-xl border-gray-200 disabled:bg-gray-50 disabled:text-gray-500"
            />
          </div>

          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-1">
              Date of Birth
            </Label>
            <DatePicker
              value={formData.dob}
              onChange={(val) => setFormData((p) => ({ ...p, dob: val }))}
              maxDate={new Date()}
              disabled={!isEditing}
              className="h-12 rounded-xl"
            />
          </div>

          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-1">
              Country
            </Label>
            <CountrySelector
              value={formData.country}
              onChange={(val) => setFormData((p) => ({ ...p, country: val }))}
              disabled={!isEditing}
            />
          </div>
        </div>
      </div>

      <DocumentsSection />
    </div>
  );
}
