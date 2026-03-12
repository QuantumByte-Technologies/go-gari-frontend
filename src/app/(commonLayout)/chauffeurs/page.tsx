import ChauffeurList from "@/components/module/Chauffeurs/ChauffeurList";
import React from "react";

export const metadata = {
  title: "Chauffeurs | GO GAARI",
  description: "Browse our verified professional chauffeurs across Bangladesh.",
};

export default function ChauffeursPage() {
  return (
    <div className="pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Our Chauffeurs
        </h1>
        <p className="text-gray-600 mb-8">
          Browse our verified professional chauffeurs for a comfortable and safe
          ride experience.
        </p>
        <ChauffeurList />
      </div>
    </div>
  );
}
