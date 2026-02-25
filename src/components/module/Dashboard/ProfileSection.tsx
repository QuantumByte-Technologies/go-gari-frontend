"use client";

import React, { useState } from "react";
// import type { UserProfile } from "../types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera, CheckCircle, PencilSimple, User } from "@phosphor-icons/react";
import { UserProfile } from "@/types/dashboard/types";
import DocumentsSection from "./DocumentsSection";
// import DocumentsSection from "./DocumentsSection";

type Props = {
  user: UserProfile;
};

export default function ProfileSection({ user }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<UserProfile>(user);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Profile Settings</h2>

        <Button
          variant={isEditing ? "default" : "outline"}
          onClick={() => setIsEditing((v) => !v)}
        >
          {isEditing ? (
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

      {/* Profile Photo */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="w-24 h-24 bg-linear-to-br from-[#5E9D34] to-[#4a7d29] rounded-full flex items-center justify-center text-white text-3xl font-bold">
              {profileData.nameEn.charAt(0)}
            </div>
            {isEditing && (
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full border border-gray-200 shadow-sm flex items-center justify-center hover:bg-gray-50">
                <Camera size={16} weight="bold" className="text-gray-600" />
              </button>
            )}
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              {profileData.nameEn}
            </h3>
            <p className="text-gray-500">{profileData.name}</p>
            <p className="text-sm text-[#5E9D34] mt-1">
              Member since {profileData.memberSince}
            </p>
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
              Full Name
            </Label>
            <Input
              value={profileData.nameEn}
              disabled={!isEditing}
              onChange={(e) =>
                setProfileData((p) => ({ ...p, nameEn: e.target.value }))
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
              value={profileData.email}
              disabled={!isEditing}
              onChange={(e) =>
                setProfileData((p) => ({ ...p, email: e.target.value }))
              }
              className="h-12 rounded-xl border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 focus-visible:ring-[#5E9D34]"
            />
          </div>

          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </Label>
            <Input
              type="tel"
              value={profileData.phone}
              disabled={!isEditing}
              onChange={(e) =>
                setProfileData((p) => ({ ...p, phone: e.target.value }))
              }
              className="h-12 rounded-xl border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 focus-visible:ring-[#5E9D34]"
            />
          </div>

          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-1">
              Date of Birth
            </Label>
            <Input
              type="date"
              value={profileData.dob}
              disabled={!isEditing}
              onChange={(e) =>
                setProfileData((p) => ({ ...p, dob: e.target.value }))
              }
              className="h-12 rounded-xl border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 focus-visible:ring-[#5E9D34]"
            />
          </div>

          <div className="md:col-span-2">
            <Label className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </Label>
            <Input
              value={profileData.address}
              disabled={!isEditing}
              onChange={(e) =>
                setProfileData((p) => ({ ...p, address: e.target.value }))
              }
              className="h-12 rounded-xl border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 focus-visible:ring-[#5E9D34]"
            />
          </div>

          <div className="md:col-span-2">
            <Label className="block text-sm font-medium text-gray-700 mb-1">
              Emergency Contact
            </Label>
            <Input
              type="tel"
              value={profileData.emergencyContact}
              disabled={!isEditing}
              onChange={(e) =>
                setProfileData((p) => ({
                  ...p,
                  emergencyContact: e.target.value,
                }))
              }
              className="h-12 rounded-xl border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 focus-visible:ring-[#5E9D34]"
            />
          </div>
        </div>
      </div>

      <DocumentsSection />
    </div>
  );
}
