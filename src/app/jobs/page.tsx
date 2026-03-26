"use client";

import { useState, useEffect, useMemo } from "react";
import { getJobs, updateJob, getRole } from "@/lib/storage";
import type { Job, JobType, JobStatus, UserRole } from "@/lib/types";
import JobCard from "@/components/JobCard";
import BottomNav from "@/components/BottomNav";
import ConfirmModal from "@/components/ConfirmModal";

type SortOption = "newest" | "oldest" | "value_desc" | "value_asc";

const typeFilters: { value: JobType | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "cans", label: "🥫 Cans" },
  { value: "plastic", label: "🧴 Plastic" },
  { value: "glass", label: "🍾 Glass" },
];

const statusFilters: { value: JobStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "in_progress", label: "In Progress" },
  { value: "done", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "value_desc", label: "Highest value" },
  { value: "value_asc", label: "Lowest value" },
];

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [role, setRoleState] = useState<UserRole | null>(null);
  const [typeFilter, setTypeFilter] = useState<JobType | "all">("all");
  const [statusFilter, setStatusFilter] = useState<JobStatus | "all">("all");
  const [sort, setSort] = useState<SortOption>("newest");
  const [confirmId, setConfirmId] = useState<string | null>(null);

  useEffect(() => {
    setRoleState(getRole());
    setJobs(getJobs());
  }, []);

  const isDriver = role === "driver";

  const result = useMemo(() => {
    let list = isDriver
      ? jobs.filter((j) => j.status === "pending" || j.assignedTo === "driver-1")
      : jobs;

    if (typeFilter !== "all") list = list.filter((j) => j.type === typeFilter);
    if (statusFilter !== "all") list = list.filter((j) => j.status === statusFilter);

    list = [...list].sort((a, b) => {
      switch (sort) {
        case "newest": return b.createdAt - a.createdAt;
        case "oldest": return a.createdAt - b.createdAt;
        case "value_desc": return b.amount - a.amount;
        case "value_asc": return a.amount - b.amount;
      }
    });

    return list;
  }, [jobs, isDriver, typeFilter, statusFilter, sort]);

  const handleAccept = (id: string) => {
    setConfirmId(id);
  };

  const confirmAccept = () => {
    if (!confirmId) return;
    updateJob(confirmId, { status: "in_progress", assignedTo: "driver-1" });
    setJobs(getJobs());
    setConfirmId(null);
  };

  return (
    <div className="min-h-dvh pb-20">
      <div className="max-w-md mx-auto px-4 pt-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          {isDriver ? "Available Jobs" : "My Requests"}
        </h1>

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
              {f.label}
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
              {f.label}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs text-gray-400">{result.length} job{result.length !== 1 ? "s" : ""}</p>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="text-xs text-gray-500 bg-transparent border-0 focus:ring-0 pr-6 cursor-pointer"
          >
            {sortOptions.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        {result.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-4xl mb-3">
              {typeFilter === "all" ? "📭" : typeFilters.find((f) => f.value === typeFilter)?.label.split(" ")[0]}
            </div>
            <p className="text-gray-400 text-lg">No jobs found</p>
            <p className="text-gray-400 text-sm mt-1">
              {typeFilter !== "all" || statusFilter !== "all"
                ? "Try changing your filters"
                : !isDriver
                  ? "Create your first request"
                  : "Check back soon"}
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
        title="Accept this job?"
        message="You will be assigned to this collection. Make sure you can reach the pickup location."
        confirmLabel="Accept"
        cancelLabel="Cancel"
        onConfirm={confirmAccept}
        onCancel={() => setConfirmId(null)}
      />

      <BottomNav />
    </div>
  );
}
