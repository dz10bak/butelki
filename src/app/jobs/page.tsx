"use client";

import { useState, useEffect, useMemo } from "react";
import { getJobs, updateJob, getRole } from "@/lib/storage";
import type { Job, JobType, JobStatus, UserRole } from "@/lib/types";
import { useLocale } from "@/components/LocaleProvider";
import { useToast } from "@/components/ToastProvider";
import JobCard from "@/components/JobCard";
import BottomNav from "@/components/BottomNav";
import ConfirmModal from "@/components/ConfirmModal";
import { SkeletonList } from "@/components/Skeleton";
import type { TranslationKey } from "@/lib/i18n";

type SortOption = "newest" | "oldest" | "value_desc" | "value_asc";

const typeFilters: { value: JobType | "all"; labelKey: TranslationKey }[] = [
  { value: "all", labelKey: "jobs.all" },
  { value: "cans", labelKey: "create.cans" },
  { value: "plastic", labelKey: "create.plastic" },
  { value: "glass", labelKey: "create.glass" },
];

const typeEmojis: Record<string, string> = { cans: "🥫", plastic: "🧴", glass: "🍾" };

const statusFilters: { value: JobStatus | "all"; labelKey: TranslationKey }[] = [
  { value: "all", labelKey: "jobs.all" },
  { value: "pending", labelKey: "jobs.pending" },
  { value: "in_progress", labelKey: "jobs.inProgress" },
  { value: "done", labelKey: "jobs.completed" },
  { value: "cancelled", labelKey: "jobs.cancelled" },
];

const sortKeys: { value: SortOption; labelKey: TranslationKey }[] = [
  { value: "newest", labelKey: "jobs.newest" },
  { value: "oldest", labelKey: "jobs.oldest" },
  { value: "value_desc", labelKey: "jobs.highestValue" },
  { value: "value_asc", labelKey: "jobs.lowestValue" },
];

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [role, setRoleState] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState<JobType | "all">("all");
  const [statusFilter, setStatusFilter] = useState<JobStatus | "all">("all");
  const [sort, setSort] = useState<SortOption>("newest");
  const [search, setSearch] = useState("");
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const { t } = useLocale();
  const { toast } = useToast();

  useEffect(() => {
    setRoleState(getRole());
    setJobs(getJobs());
    setLoading(false);
  }, []);

  const isDriver = role === "driver";

  const result = useMemo(() => {
    let list = isDriver
      ? jobs.filter((j) => j.status === "pending" || j.assignedTo === "driver-1")
      : jobs;

    if (typeFilter !== "all") {
      list = list.filter((j) => {
        const jobTypes = Array.isArray(j.type) ? j.type : [j.type];
        return jobTypes.includes(typeFilter);
      });
    }
    if (statusFilter !== "all") list = list.filter((j) => j.status === statusFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((j) => j.address.toLowerCase().includes(q));
    }

    list = [...list].sort((a, b) => {
      switch (sort) {
        case "newest": return b.createdAt - a.createdAt;
        case "oldest": return a.createdAt - b.createdAt;
        case "value_desc": return b.amount - a.amount;
        case "value_asc": return a.amount - b.amount;
      }
    });

    return list;
  }, [jobs, isDriver, typeFilter, statusFilter, sort, search]);

  const handleAccept = (id: string) => {
    setConfirmId(id);
  };

  const confirmAccept = () => {
    if (!confirmId) return;
    updateJob(confirmId, { status: "in_progress", assignedTo: "driver-1" });
    setJobs(getJobs());
    setConfirmId(null);
    toast(t("jobs.accept") + " ✓");
  };

  return (
    <div className="min-h-dvh pb-20">
      <div className="px-4 pt-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          {isDriver ? t("jobs.available") : t("jobs.myRequests")}
        </h1>

        {/* Search */}
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("jobs.search")}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all mb-3"
        />

        {/* Type filter chips */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-2 scrollbar-hide">
          {typeFilters.map((f) => (
            <button
              key={f.value}
              onClick={() => setTypeFilter(f.value)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                typeFilter === f.value
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 active:bg-gray-200 dark:active:bg-gray-700"
              }`}
            >
              {f.value !== "all" ? typeEmojis[f.value] + " " : ""}{t(f.labelKey)}
            </button>
          ))}
        </div>

        {/* Status filter chips */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-3 scrollbar-hide">
          {statusFilters.map((f) => (
            <button
              key={f.value}
              onClick={() => setStatusFilter(f.value)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                statusFilter === f.value
                  ? "bg-gray-900 dark:bg-white text-white dark:text-gray-900"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 active:bg-gray-200 dark:active:bg-gray-700"
              }`}
            >
              {t(f.labelKey)}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs text-gray-400">{result.length} job{result.length !== 1 ? "s" : ""}</p>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="text-xs text-gray-500 dark:text-gray-400 bg-transparent border-0 focus:ring-0 pr-6 cursor-pointer"
          >
            {sortKeys.map((o) => (
              <option key={o.value} value={o.value}>{t(o.labelKey)}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <SkeletonList count={3} />
        ) : result.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-4xl mb-3">📭</div>
            <p className="text-gray-400 text-lg">{t("jobs.noJobs")}</p>
            <p className="text-gray-400 text-sm mt-1">
              {typeFilter !== "all" || statusFilter !== "all" || search
                ? t("jobs.changeFilters")
                : !isDriver
                  ? t("jobs.createFirst")
                  : t("jobs.checkBack")}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {result.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                showAccept={isDriver}
                onAccept={handleAccept}
              />
            ))}
          </div>
        )}
      </div>

      <ConfirmModal
        open={confirmId !== null}
        title={t("confirm.accept")}
        message={t("confirm.acceptMsg")}
        confirmLabel={t("confirm.acceptBtn")}
        cancelLabel={t("confirm.cancel")}
        onConfirm={confirmAccept}
        onCancel={() => setConfirmId(null)}
      />

      <BottomNav />
    </div>
  );
}
