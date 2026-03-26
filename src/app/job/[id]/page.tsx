"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { getJob, updateJob, getRole } from "@/lib/storage";
import type { Job, UserRole } from "@/lib/types";
import MapPicker from "@/components/MapPicker";
import BottomNav from "@/components/BottomNav";
import ConfirmModal from "@/components/ConfirmModal";

const statusFlow = {
  pending: { next: "in_progress" as const, label: "Start Pickup", confirmTitle: "Start pickup?", confirmMsg: "This will mark you as on the way to the pickup location." },
  in_progress: { next: "done" as const, label: "Mark as Collected", confirmTitle: "Mark as collected?", confirmMsg: "Please confirm that you have collected all the items." },
  done: { next: null, label: null, confirmTitle: "", confirmMsg: "" },
  cancelled: { next: null, label: null, confirmTitle: "", confirmMsg: "" },
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

export default function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [job, setJob] = useState<Job | null>(null);
  const [role, setRoleState] = useState<UserRole | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  useEffect(() => {
    setRoleState(getRole());
    const found = getJob(id);
    if (!found) {
      router.push("/jobs");
      return;
    }
    setJob(found);
  }, [id, router]);

  const handleStatusChange = () => {
    if (!job) return;
    const flow = statusFlow[job.status];
    if (!flow.next) return;
    const newStatus = flow.next;
    const updates: Partial<Job> =
      newStatus === "in_progress"
        ? { status: newStatus, assignedTo: "driver-1" }
        : { status: newStatus };
    updateJob(job.id, updates);
    setJob({ ...job, ...updates });
    setShowConfirm(false);
  };

  const handleCancel = () => {
    if (!job) return;
    updateJob(job.id, { status: "cancelled" });
    setJob({ ...job, status: "cancelled" });
    setShowCancelConfirm(false);
  };

  if (!job) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-green-200" />
          <p className="text-gray-400 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  const flow = statusFlow[job.status];
  const pricePerItem = job.type === "glass" ? 1.0 : 0.5;
  const estimatedValue = (job.amount * pricePerItem).toFixed(2);
  const serviceFee = 8;
  const clientEarns = (job.amount * pricePerItem * 0.2).toFixed(2);
  const driverEarns = (job.amount * pricePerItem - parseFloat(clientEarns) - serviceFee).toFixed(2);

  return (
    <div className="min-h-dvh pb-20">
      <div className="max-w-md mx-auto px-4 pt-6">
        <button
          onClick={() => router.back()}
          className="text-gray-500 text-sm mb-4 flex items-center gap-1 active:text-gray-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white capitalize">
            {job.type} Collection
          </h1>
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColors[job.status]}`}>
            {statusLabels[job.status]}
          </span>
        </div>

        <div className="space-y-4 animate-fade-in">
          <MapPicker
            lat={job.lat}
            lng={job.lng}
            interactive={false}
          />

          <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400 text-sm">Address</span>
              <span className="text-gray-900 dark:text-gray-100 text-sm font-medium text-right max-w-[60%]">{job.address}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400 text-sm">Amount</span>
              <span className="text-gray-900 dark:text-gray-100 text-sm font-medium">{job.amount} items</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400 text-sm">Type</span>
              <span className="text-gray-900 dark:text-gray-100 text-sm font-medium capitalize">{job.type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400 text-sm">Deposit only</span>
              <span className="text-gray-900 dark:text-gray-100 text-sm font-medium">{job.depositOnly ? "Yes" : "No"}</span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Earnings Estimate</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Estimated value</span>
                <span className="font-medium">{estimatedValue} zl</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Client earns</span>
                <span className="font-medium text-green-600">{clientEarns} zl</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Service fee</span>
                <span className="font-medium">{serviceFee} zl</span>
              </div>
              <div className="flex justify-between border-t border-gray-100 dark:border-gray-800 pt-2">
                <span className="text-gray-500 dark:text-gray-400">Driver earns</span>
                <span className="font-semibold text-green-600">{driverEarns} zl</span>
              </div>
            </div>
          </div>

          {role === "driver" && flow.next && (
            <button
              onClick={() => setShowConfirm(true)}
              className="w-full bg-green-600 text-white text-lg font-semibold py-4 rounded-2xl active:bg-green-700 transition-all active:scale-[0.98]"
            >
              {flow.label}
            </button>
          )}

          {role === "client" && job.status === "pending" && (
            <button
              onClick={() => setShowCancelConfirm(true)}
              className="w-full bg-red-50 text-red-600 text-lg font-semibold py-4 rounded-2xl active:bg-red-100 transition-all active:scale-[0.98] border border-red-200"
            >
              Cancel Request
            </button>
          )}

          {job.status === "done" && (
            <div className="text-center py-6 animate-fade-in">
              <div className="text-4xl mb-2">✅</div>
              <p className="text-green-600 font-semibold text-lg">Collection completed!</p>
              <p className="text-gray-400 text-sm mt-1">Thank you for recycling</p>
            </div>
          )}

          {job.status === "cancelled" && (
            <div className="text-center py-6 animate-fade-in">
              <div className="text-4xl mb-2">❌</div>
              <p className="text-red-500 font-semibold text-lg">Request cancelled</p>
            </div>
          )}
        </div>
      </div>

      <ConfirmModal
        open={showConfirm}
        title={flow.confirmTitle ?? ""}
        message={flow.confirmMsg ?? ""}
        confirmLabel={flow.label ?? ""}
        onConfirm={handleStatusChange}
        onCancel={() => setShowConfirm(false)}
      />

      <ConfirmModal
        open={showCancelConfirm}
        title="Cancel this request?"
        message="This action cannot be undone. The job will be removed from the available list."
        confirmLabel="Cancel Request"
        cancelLabel="Keep"
        variant="danger"
        onConfirm={handleCancel}
        onCancel={() => setShowCancelConfirm(false)}
      />

      <BottomNav />
    </div>
  );
}
