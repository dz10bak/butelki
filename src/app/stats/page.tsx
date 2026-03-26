"use client";

import { useState, useEffect } from "react";
import { getJobs, getRole } from "@/lib/storage";
import type { Job, UserRole } from "@/lib/types";
import { useLocale } from "@/components/LocaleProvider";
import { useToast } from "@/components/ToastProvider";
import StarRating from "@/components/StarRating";
import BottomNav from "@/components/BottomNav";

const typeEmoji: Record<string, string> = {
  cans: "🥫",
  plastic: "🧴",
  glass: "🍾",
};

function getEarnings(job: Job, role: UserRole): number {
  const types = Array.isArray(job.type) ? job.type : [job.type];
  const pricePerItem = types.includes("glass") ? 1.0 : 0.5;
  const total = job.amount * pricePerItem;
  const clientCut = total * 0.2;
  const serviceFee = 8;
  return role === "driver" ? total - clientCut - serviceFee : clientCut;
}

export default function StatsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [role, setRoleState] = useState<UserRole | null>(null);
  const { t } = useLocale();
  const { toast } = useToast();

  useEffect(() => {
    const r = getRole();
    setRoleState(r);
    const all = getJobs();
    setJobs(all.filter((j) => j.status === "done"));
  }, []);

  const totalEarnings = jobs.reduce((sum, j) => sum + getEarnings(j, role ?? "client"), 0);
  const avgPerJob = jobs.length > 0 ? totalEarnings / jobs.length : 0;

  return (
    <div className="min-h-dvh pb-20">
      <div className="max-w-md mx-auto px-4 pt-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{t("stats.title")}</h1>

        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 text-center">
            <p className="text-2xl font-bold text-green-600">{totalEarnings.toFixed(0)}</p>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">zl {t("stats.totalEarnings").toLowerCase()}</p>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 text-center">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{jobs.length}</p>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">{t("stats.completedJobs").toLowerCase()}</p>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 text-center">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{avgPerJob.toFixed(0)}</p>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">zl {t("stats.avgPerJob").toLowerCase()}</p>
          </div>
        </div>

        {/* Withdraw button */}
        {totalEarnings > 0 && (
          <button
            onClick={() => toast(t("stats.withdrawMsg"), "info")}
            className="w-full bg-green-600 text-white text-lg font-semibold py-4 rounded-2xl active:bg-green-700 active:scale-[0.98] transition-all mb-6"
          >
            {t("stats.withdraw")} — {totalEarnings.toFixed(2)} zl
          </button>
        )}

        {/* History */}
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">{t("stats.history")}</h2>
        {jobs.length === 0 ? (
          <p className="text-center text-gray-400 py-8">{t("stats.noHistory")}</p>
        ) : (
          <div className="space-y-3">
            {jobs.map((job) => {
              const types = Array.isArray(job.type) ? job.type : [job.type];
              const earned = getEarnings(job, role ?? "client");
              return (
                <div
                  key={job.id}
                  className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span>{types.map((jt) => typeEmoji[jt]).join("")}</span>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{job.amount} {t("job.items")}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[180px]">{job.address}</p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-green-600">+{earned.toFixed(2)} zl</span>
                  </div>
                  {(role === "driver" ? job.driverRating : job.clientRating) && (
                    <div className="flex items-center gap-1 mt-1">
                      <StarRating value={(role === "driver" ? job.driverRating : job.clientRating) ?? 0} readonly size="sm" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
}
