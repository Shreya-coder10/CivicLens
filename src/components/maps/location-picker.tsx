"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

interface LocationPickerProps {
  value?: { lat: number; lng: number } | null;
  onChange: (coords: { lat: number; lng: number }) => void;
  defaultCenter?: [number, number];
}

const DynamicLocationPicker = dynamic(
  () => import("@/components/maps/location-picker-inner"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-64 w-full flex-col items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-400">
        <Loader2 className="h-6 w-6 animate-spin text-teal-600 mb-2" />
        <span className="text-xs">Loading Location Selector...</span>
      </div>
    ),
  }
);

export function LocationPicker(props: LocationPickerProps) {
  return <DynamicLocationPicker {...props} />;
}
