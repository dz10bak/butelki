"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import type { MapMarker } from "./MultiMarkerMapInner";

const MultiMarkerMapInner = dynamic(() => import("./MultiMarkerMapInner"), { ssr: false });

export type { MapMarker };

export default function MultiMarkerMap({
  markers,
  selectedId,
  onSelect,
}: {
  markers: MapMarker[];
  selectedId?: string | null;
  onSelect?: (id: string) => void;
}) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  if (!ready) {
    return <div className="w-full h-72 rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse" />;
  }

  return <MultiMarkerMapInner markers={markers} selectedId={selectedId} onSelect={onSelect} />;
}
