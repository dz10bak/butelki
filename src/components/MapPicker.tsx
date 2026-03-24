"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

interface MapPickerProps {
  lat: number;
  lng: number;
  onLocationChange?: (lat: number, lng: number, address: string) => void;
  interactive?: boolean;
}

const MapInner = dynamic(() => import("./MapInner"), { ssr: false });

export default function MapPicker({ lat, lng, onLocationChange, interactive = true }: MapPickerProps) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  if (!ready) {
    return <div className="w-full h-64 rounded-xl bg-gray-100 animate-pulse" />;
  }

  return <MapInner lat={lat} lng={lng} onLocationChange={onLocationChange} interactive={interactive} />;
}
