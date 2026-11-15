"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import Link from "next/link";
import { formatCategoryName, getStatusColor } from "@/lib/utils";
import { IssueCategory, ComplaintStatus } from "@/types";

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

interface LeafletMapInnerProps {
  complaints: MapComplaint[];
  center?: [number, number];
  zoom?: number;
  onSelectComplaint?: (complaint: MapComplaint) => void;
}

// Custom category-colored SVG pin generator for Leaflet
function createCategoryIcon(category: string, status: string) {
  let pinColor = "#0D9488"; // default teal

  if (category === "ROADS_AND_POTHOLES") pinColor = "#EA580C"; // orange
  else if (category === "GARBAGE_AND_WASTE") pinColor = "#16A34A"; // green
  else if (category === "WATER_SUPPLY_AND_LEAKAGE") pinColor = "#0284C7"; // sky blue
  else if (category === "STREETLIGHTS_AND_ELECTRICITY") pinColor = "#CA8A04"; // yellow/amber
  else if (category === "DRAINAGE_AND_SANITATION") pinColor = "#9333EA"; // purple
  else if (category === "PUBLIC_INFRASTRUCTURE") pinColor = "#DC2626"; // red

  const svgIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32" fill="${pinColor}" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
      <circle cx="12" cy="10" r="3" fill="#ffffff"></circle>
    </svg>
  `;

  return L.divIcon({
    html: svgIcon,
    className: "civic-map-marker",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
}

export default function LeafletMapInner({
  complaints,
  center = [12.9716, 77.5946],
  zoom = 12,
  onSelectComplaint,
}: LeafletMapInnerProps) {
  const validComplaints = complaints.filter(
    (c) => typeof c.latitude === "number" && typeof c.longitude === "number"
  );

  const initialCenter =
    validComplaints.length > 0
      ? ([validComplaints[0].latitude, validComplaints[0].longitude] as [
          number,
          number
        ])
      : center;

  return (
    <div className="relative h-full w-full">
      <MapContainer
        center={initialCenter}
        zoom={zoom}
        scrollWheelZoom={true}
        className="h-full w-full rounded-xl z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {validComplaints.map((c) => (
          <Marker
            key={c.id}
            position={[c.latitude, c.longitude]}
            icon={createCategoryIcon(c.category, c.status)}
            eventHandlers={{
              click: () => onSelectComplaint && onSelectComplaint(c),
            }}
          >
            <Popup className="civic-map-popup">
              <div className="p-1 space-y-1.5 max-w-[240px]">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                    {c.referenceId}
                  </span>
                  <span
                    className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${getStatusColor(
                      c.status
                    )}`}
                  >
                    {c.status.replace("_", " ")}
                  </span>
                </div>
                <h4 className="font-semibold text-xs text-slate-900 leading-snug line-clamp-2">
                  {c.title}
                </h4>
                <p className="text-[11px] text-slate-600 line-clamp-1">
                  📍 {c.address}
                </p>
                <div className="pt-1 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] text-teal-700 font-medium">
                    {formatCategoryName(c.category)}
                  </span>
                  <Link
                    href={`/issues/${c.id}`}
                    className="text-[11px] font-semibold text-blue-600 hover:underline"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
