"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { getJob, updateJob, getRole } from "@/lib/storage";
import type { Job, UserRole } from "@/lib/types";
import MapPicker from "@/components/MapPicker";
import BottomNav from "@/components/BottomNav";

const statusFlow = {
  pending: { next: "in_progress" as const, label: "Start Pickup" },
  in_progress: { next: "done" as const, label: "Mark as Collected" },
  done: { next: null, label: null },
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

  useEffect(() => {
    setRoleState(getRole());
    const found = getJob(id);
    if (!found) {
      router.push("/jobs");
      return;
    }
    setJob(found);
  }, [id, router]);

  const handleStatusChange = (newStatus: "in_progress" | "done") => {
    if (!job) return;
    const updates: Partial<Job> =
      newStatus === "in_progress"
        ? { status: newStatus, assignedTo: "driver-1" }
        : { status: newStatus };
    updateJob(job.id, updates);
    setJob({ ...job, ...updates });
  };

  if (!job) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  const flow = statusFlow[job.status];
  const estimatedValue = (job.amount * 0.5).toFixed(2);
  const serviceFee = 8;
  const clientEarns = "10-15";
  const driverEarns = (job.amount * 0.5 - serviceFee).toFixed(2);

  return (
    <div className="min-h-dvh pb-20">
      <div className="max-w-md mx-auto px-4 pt-6">
        <button
          onClick={() => router.back()}
          className="text-gray-500 text-sm mb-4 flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        <h1 className="text-2xl font-bold text-gray-900 mb-4 capitalize">
          {job.type} Collection
        </h1>

        <div className="space-y-4">
          <MapPicker
            lat={job.lat}
            lng={job.lng}
            interactive={false}
          />

          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-500 text-sm">Address</span>
              <span className="text-gray-900 text-sm font-medium text-right max-w-[60%]">{job.address}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 text-sm">Amount</span>
              <span className="text-gray-900 text-sm font-medium">{job.amount} items</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 text-sm">Type</span>
              <span className="text-gray-900 text-sm font-medium capitalize">{job.type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 text-sm">Deposit only</span>
              <span className="text-gray-900 text-sm font-medium">{job.depositOnly ? "Yes" : "No"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 text-sm">Status</span>
              <span className="text-sm font-medium capitalize">
                {job.status.replace("_", " ")}
              </span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <h2 className="text-sm font-semibold text-gray-900 mb-3">Earnings Estimate</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Estimated value</span>
                <span className="font-medium">{estimatedValue} zl</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Client earns</span>
                <span className="font-medium text-green-600">~{clientEarns} zl</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Service fee</span>
                <span className="font-medium">{serviceFee} zl</span>
              </div>
              <div className="flex justify-between border-t border-gray-100 pt-2">
                <span className="text-gray-500">Driver earns</span>
                <span className="font-semibold text-green-600">{driverEarns} zl</span>
              </div>
            </div>
          </div>

          {role === "driver" && flow.next && (
            <button
              onClick={() => handleStatusChange(flow.next!)}
              className="w-full bg-green-600 text-white text-lg font-semibold py-4 rounded-2xl active:bg-green-700 transition-colors"
            >
              {flow.label}
            </button>
          )}

          {job.status === "done" && (
            <div className="text-center py-4">
              <p className="text-green-600 font-semibold text-lg">Collection completed!</p>
            </div>
          )}
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
