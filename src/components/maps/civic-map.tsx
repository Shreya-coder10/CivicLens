"use client";

import dynamic from "next/dynamic";
import { Loader2, MapPin } from "lucide-react";

interface MapComplaint {
  id: string;
  referenceId: string;
  title: string;
  category: string;
  status: string;
  address: string;
  latitude: number;
  longitude: number;
}

interface CivicMapProps {
  complaints: MapComplaint[];
  center?: [number, number];
  zoom?: number;
  onSelectComplaint?: (complaint: MapComplaint) => void;
}

const DynamicLeafletMap = dynamic(
  () => import("@/components/maps/leaflet-map-inner"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full flex-col items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-500">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600 mb-2" />
        <p className="text-sm font-medium">Initializing Interactive Civic Map...</p>
        <span className="text-xs text-slate-400">Loading geospatial tiles &amp; coordinates</span>
      </div>
    ),
  }
);

export function CivicMap(props: CivicMapProps) {
  return <DynamicLeafletMap {...props} />;
}
