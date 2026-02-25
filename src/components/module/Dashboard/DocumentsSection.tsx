"use client";

import React from "react";
import { FileText, IdentificationCard, Upload } from "@phosphor-icons/react";

export default function DocumentsSection() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
        <IdentificationCard
          size={20}
          weight="duotone"
          className="text-[#5E9D34]"
        />
        Documents
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Driving License Front */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Driving License (Front)
          </label>
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-[#5E9D34] transition-colors cursor-pointer">
            <Upload
              size={32}
              weight="duotone"
              className="text-gray-400 mx-auto mb-2"
            />
            <p className="text-sm text-gray-600">Click to upload</p>
            <p className="text-xs text-gray-400 mt-1">JPG, PNG up to 5MB</p>
          </div>
        </div>

        {/* Driving License Back */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Driving License (Back)
          </label>
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-[#5E9D34] transition-colors cursor-pointer">
            <Upload
              size={32}
              weight="duotone"
              className="text-gray-400 mx-auto mb-2"
            />
            <p className="text-sm text-gray-600">Click to upload</p>
            <p className="text-xs text-gray-400 mt-1">JPG, PNG up to 5MB</p>
          </div>
        </div>

        {/* Passport */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Passport (Bio Page)
          </label>
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-[#5E9D34] transition-colors cursor-pointer">
            <FileText
              size={32}
              weight="duotone"
              className="text-gray-400 mx-auto mb-2"
            />
            <p className="text-sm text-gray-600">Click to upload</p>
            <p className="text-xs text-gray-400 mt-1">JPG, PNG up to 5MB</p>
          </div>
        </div>

        {/* NID */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            National ID (NID)
          </label>
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-[#5E9D34] transition-colors cursor-pointer">
            <IdentificationCard
              size={32}
              weight="duotone"
              className="text-gray-400 mx-auto mb-2"
            />
            <p className="text-sm text-gray-600">Click to upload</p>
            <p className="text-xs text-gray-400 mt-1">JPG, PNG up to 5MB</p>
          </div>
        </div>
      </div>
    </div>
  );
}
