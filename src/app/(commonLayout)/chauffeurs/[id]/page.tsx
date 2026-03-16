"use client";

import React from "react";
import { useParams } from "next/navigation";
import ChauffeurDetailView from "@/components/module/Chauffeurs/ChauffeurDetailView";

export default function ChauffeurDetailPage() {
  const params = useParams();
  const chauffeurId = Number(params.id);

  return (
    <div className="pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ChauffeurDetailView chauffeurId={chauffeurId} />
      </div>
    </div>
  );
}
