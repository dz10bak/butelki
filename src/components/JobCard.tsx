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
};

const statusLabels: Record<string, string> = {
  pending: "Pending",
  in_progress: "In Progress",
  done: "Completed",
};

export default function JobCard({
  job,
  showAccept,
  onAccept,
}: {
  job: Job;
  showAccept?: boolean;
  onAccept?: (id: string) => void;
}) {
  const earnings = (job.amount * 0.5).toFixed(2);

  return (
    <Link href={`/job/${job.id}`} className="block">
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 active:scale-[0.98] transition-transform">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{typeEmoji[job.type]}</span>
            <div>
              <p className="font-semibold text-gray-900 capitalize">{job.type}</p>
              <p className="text-sm text-gray-500">{job.amount} items</p>
            </div>
          </div>
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColors[job.status]}`}>
            {statusLabels[job.status]}
          </span>
        </div>

        <p className="text-sm text-gray-600 mb-2 truncate">{job.address}</p>

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
