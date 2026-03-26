"use client";

import Link from "next/link";
import type { Job } from "@/lib/types";

const typeEmoji: Record<string, string> = {
  cans: "🥫",
  plastic: "🧴",
  glass: "🍾",
};

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  in_progress: "bg-blue-100 text-blue-800",
  done: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const statusLabels: Record<string, string> = {
  pending: "Pending",
  in_progress: "In Progress",
  done: "Completed",
  cancelled: "Cancelled",
};

function timeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function JobCard({
  job,
  showAccept,
  onAccept,
}: {
  job: Job;
  showAccept?: boolean;
  onAccept?: (id: string) => void;
}) {
  const pricePerItem = job.type === "glass" ? 1.0 : 0.5;
  const earnings = (job.amount * pricePerItem).toFixed(2);

  return (
    <Link href={`/job/${job.id}`} className="block animate-fade-in">
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 active:scale-[0.98] transition-all duration-200 hover:shadow-md">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-3">
            <span className="text-2xl w-10 h-10 bg-gray-50 dark:bg-gray-800 rounded-xl flex items-center justify-center">{typeEmoji[job.type]}</span>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white capitalize">{job.type}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{job.amount} items</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColors[job.status]}`}>
              {statusLabels[job.status]}
            </span>
            <span className="text-[10px] text-gray-400">{timeAgo(job.createdAt)}</span>
          </div>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 truncate">{job.address}</p>

        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-green-600">~{earnings} zl est.</p>
          {showAccept && job.status === "pending" && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onAccept?.(job.id);
              }}
              className="bg-green-600 text-white text-sm font-medium px-4 py-2 rounded-xl active:bg-green-700 transition-colors"
            >
              Accept Job
            </button>
          )}
        </div>
      </div>
    </Link>
  );
}
