"use client";

import { useState, useEffect } from "react";
import { getJobs, getRole } from "@/lib/storage";
import type { Job, UserRole } from "@/lib/types";
import { useLocale } from "@/components/LocaleProvider";
import MapPicker from "@/components/MapPicker";
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
  const [selected, setSelected] = useState<Job | null>(null);
  const { t } = useLocale();

  useEffect(() => {
    setRoleState(getRole());
    const all = getJobs();
    setJobs(all.filter((j) => j.status === "pending" || j.status === "in_progress"));
  }, []);

  // Center on first job or Warsaw
  const centerLat = jobs[0]?.lat ?? 52.2297;
  const centerLng = jobs[0]?.lng ?? 21.0122;

  return (
    <div className="min-h-dvh pb-20">
      <div className="max-w-md mx-auto px-4 pt-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{t("map.title")}</h1>

        <div className="relative">
          <MapPicker lat={centerLat} lng={centerLng} interactive={false} />

          {/* Job markers overlay */}
          <div className="mt-4 space-y-2">
            {jobs.length === 0 ? (
              <p className="text-center text-gray-400 py-8">{t("map.noJobs")}</p>
            ) : (
              jobs.map((job) => {
                const jobTypes = Array.isArray(job.type) ? job.type : [job.type];
                return (
                  <Link key={job.id} href={`/job/${job.id}`}>
                    <div
                      className={`bg-white dark:bg-gray-900 rounded-xl p-3 shadow-sm border transition-all ${
                        selected?.id === job.id
                          ? "border-green-500 ring-2 ring-green-500/20"
                          : "border-gray-100 dark:border-gray-800"
                      }`}
                      onClick={() => setSelected(job)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span>{jobTypes.map((jt) => typeEmoji[jt]).join("")}</span>
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{job.amount} {t("job.items")}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[180px]">{job.address}</p>
                          </div>
                        </div>
                        <span className="text-sm font-medium text-green-600">
                          ~{(job.amount * (jobTypes.includes("glass") ? 1.0 : 0.5)).toFixed(0)} zl
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
