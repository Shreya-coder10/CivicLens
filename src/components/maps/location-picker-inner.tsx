"use client";

import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";

interface LocationPickerInnerProps {
  value?: { lat: number; lng: number } | null;
  onChange: (coords: { lat: number; lng: number }) => void;
  defaultCenter?: [number, number];
}

const pinIcon = L.divIcon({
  html: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="36" height="36" fill="#0D9488" stroke="#ffffff" stroke-width="2">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
      <circle cx="12" cy="10" r="3" fill="#ffffff"></circle>
    </svg>
  `,
  className: "civic-picker-pin",
  iconSize: [36, 36],
  iconAnchor: [18, 36],
});

function MapClickHandler({
  onPick,
}: {
  onPick: (coords: { lat: number; lng: number }) => void;
}) {
  useMapEvents({
    click(e) {
      onPick({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

export default function LocationPickerInner({
  value,
  onChange,
  defaultCenter = [12.9716, 77.5946],
}: LocationPickerInnerProps) {
  const [position, setPosition] = useState<[number, number] | null>(
    value ? [value.lat, value.lng] : null
  );

  const handlePick = (coords: { lat: number; lng: number }) => {
    setPosition([coords.lat, coords.lng]);
    onChange(coords);
  };

  const centerPosition = position || defaultCenter;

  return (
    <div className="relative h-64 w-full rounded-lg border border-slate-200 overflow-hidden">
      <MapContainer
        center={centerPosition}
        zoom={13}
        scrollWheelZoom={false}
        className="h-full w-full z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapClickHandler onPick={handlePick} />
        {position && <Marker position={position} icon={pinIcon} />}
      </MapContainer>
      <div className="absolute bottom-2 left-2 z-[400] rounded bg-white/90 px-2 py-1 text-[11px] font-medium text-slate-700 shadow backdrop-blur">
        {position
          ? `Selected: ${position[0].toFixed(4)}, ${position[1].toFixed(4)}`
          : "Click anywhere on the map to pinpoint issue"}
      </div>
    </div>
  );
}
