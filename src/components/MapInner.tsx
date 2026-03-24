"use client";

import { useCallback, useMemo } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet default icon issue in Next.js/webpack
const icon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface MapInnerProps {
  lat: number;
  lng: number;
  onLocationChange?: (lat: number, lng: number, address: string) => void;
  interactive?: boolean;
}

function reverseGeocode(lat: number, lng: number): Promise<string> {
  return fetch(
    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
    { headers: { "Accept-Language": "en" } }
  )
    .then((r) => r.json())
    .then((data) => data.display_name || `${lat.toFixed(5)}, ${lng.toFixed(5)}`)
    .catch(() => `${lat.toFixed(5)}, ${lng.toFixed(5)}`);
}

function ClickHandler({ onLocationChange }: { onLocationChange: (lat: number, lng: number, address: string) => void }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      reverseGeocode(lat, lng).then((address) => {
        onLocationChange(lat, lng, address);
      });
    },
  });
  return null;
}

export default function MapInner({ lat, lng, onLocationChange, interactive = true }: MapInnerProps) {
  const position = useMemo(() => [lat, lng] as [number, number], [lat, lng]);

  const handleDragEnd = useCallback(
    (e: L.DragEndEvent) => {
      const marker = e.target as L.Marker;
      const pos = marker.getLatLng();
      reverseGeocode(pos.lat, pos.lng).then((address) => {
        onLocationChange?.(pos.lat, pos.lng, address);
      });
    },
    [onLocationChange]
  );

  return (
    <MapContainer
      center={position}
      zoom={15}
      className="w-full h-64 rounded-xl z-0"
      scrollWheelZoom={interactive}
      dragging={interactive}
      zoomControl={interactive}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker
        position={position}
        icon={icon}
        draggable={interactive && !!onLocationChange}
        eventHandlers={onLocationChange ? { dragend: handleDragEnd } : {}}
      />
      {interactive && onLocationChange && <ClickHandler onLocationChange={onLocationChange} />}
    </MapContainer>
  );
}
