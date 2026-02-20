"use client";

import React from "react";
import { MagnifyingGlass } from "@phosphor-icons/react";
import DriveTypeToggle from "./DriveTypeToggle";
// import DriveTypeToggle from "./DriveTypeToggle";

type Props = {
  locationDefault: string;
  dateText: string;
  selfDrive: boolean;
  chauffeur: boolean;
  onToggleSelfDrive: () => void;
  onToggleChauffeur: () => void;
};

export default function SearchHeader({
  locationDefault,
  selfDrive,
  chauffeur,
  onToggleSelfDrive,
  onToggleChauffeur,
}: Props) {
  return (
    <div className="bg-white border-b border-gray-200 pt-24 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex-1 w-full lg:max-w-md">
            <div className="relative">
              <MagnifyingGlass
                size={22}
                weight="duotone"
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                defaultValue={locationDefault}
                placeholder="Dhaka"
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#5E9D34] focus:border-transparent outline-none"
              />
            </div>
          </div>

          <DriveTypeToggle
            selfDrive={selfDrive}
            chauffeur={chauffeur}
            onToggleSelfDrive={onToggleSelfDrive}
            onToggleChauffeur={onToggleChauffeur}
          />
        </div>
      </div>
    </div>
  );
}
