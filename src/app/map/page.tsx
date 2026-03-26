"use client";

import { useState, useEffect } from "react";
import { getJobs, getRole } from "@/lib/storage";
import type { Job, UserRole } from "@/lib/types";
import { useLocale } from "@/components/LocaleProvider";
import MultiMarkerMap from "@/components/MultiMarkerMap";
import type { MapMarker } from "@/components/MultiMarkerMap";
import BottomNav from "@/components/BottomNav";
import Link from "next/link";

const typeEmoji: Record<string, string> = {
  cans: "🥫",
  plastic: "🧴",
  glass: "🍾",
};

export default function MapPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [role, setRoleState] = useState<UserRole | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { t } = useLocale();

  useEffect(() => {
    setRoleState(getRole());
    const all = getJobs();
    setJobs(all.filter((j) => (j.status === "pending" || j.status === "in_progress") && !j.archived));
  }, []);

  const markers: MapMarker[] = jobs.map((job) => {
    const jobTypes = Array.isArray(job.type) ? job.type : [job.type];
    return {
      id: job.id,
      lat: job.lat,
      lng: job.lng,
      label: `${jobTypes.map((jt) => typeEmoji[jt]).join("")} ${job.amount} ${t("job.items")}`,
      sublabel: job.address,
    };
  });

  const selectedJob = jobs.find((j) => j.id === selectedId);

  return (
    <div className="min-h-dvh pb-20">
      <div className="px-4 pt-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{t("map.title")}</h1>

        <MultiMarkerMap
          markers={markers}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />

        {/* Job list under map */}
        <div className="mt-4 space-y-2">
          {jobs.length === 0 ? (
            <p className="text-center text-gray-400 py-8">{t("map.noJobs")}</p>
          ) : (
            jobs.map((job) => {
              const jobTypes = Array.isArray(job.type) ? job.type : [job.type];
              const isSelected = selectedId === job.id;
              return (
                <Link key={job.id} href={`/job/${job.id}`}>
                  <div
                    className={`bg-white dark:bg-gray-900 rounded-xl p-3 shadow-sm border transition-all ${
                      isSelected
                        ? "border-green-500 ring-2 ring-green-500/20"
                        : "border-gray-100 dark:border-gray-800"
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedId(job.id);
                    }}
                    onDoubleClick={() => window.location.href = `/job/${job.id}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span>{jobTypes.map((jt) => typeEmoji[jt]).join("")}</span>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{job.amount} {t("job.items")}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[180px]">{job.address}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-green-600">
                          ~{(job.amount * (jobTypes.includes("glass") ? 1.0 : 0.5)).toFixed(0)} zl
                        </span>
                        {isSelected && (
                          <Link href={`/job/${job.id}`} className="text-xs text-green-600 font-medium underline">
                            Open
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
