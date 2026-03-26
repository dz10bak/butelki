"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { getJob, updateJob, getRole } from "@/lib/storage";
import type { Job, UserRole } from "@/lib/types";
import { useLocale } from "@/components/LocaleProvider";
import { useToast } from "@/components/ToastProvider";
import MapPicker from "@/components/MapPicker";
import BottomNav from "@/components/BottomNav";
import ConfirmModal from "@/components/ConfirmModal";
import StarRating from "@/components/StarRating";
import { SkeletonDetail } from "@/components/Skeleton";

const statusFlow: Record<string, { next: string | null; labelKey: string | null; confirmTitleKey: string | null; confirmMsgKey: string | null }> = {
  pending: { next: "in_progress", labelKey: "job.startPickup", confirmTitleKey: "confirm.startPickup", confirmMsgKey: "confirm.startPickupMsg" },
  in_progress: { next: "done", labelKey: "job.markCollected", confirmTitleKey: "confirm.markCollected", confirmMsgKey: "confirm.markCollectedMsg" },
  done: { next: null, labelKey: null, confirmTitleKey: null, confirmMsgKey: null },
  cancelled: { next: null, labelKey: null, confirmTitleKey: null, confirmMsgKey: null },
};

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  in_progress: "bg-blue-100 text-blue-800",
  done: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const statusLabelKeys: Record<string, string> = {
  pending: "jobs.pending",
  in_progress: "jobs.inProgress",
  done: "jobs.completed",
  cancelled: "jobs.cancelled",
};

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { t } = useLocale();
  const { toast } = useToast();
  const [job, setJob] = useState<Job | null>(null);
  const [role, setRoleState] = useState<UserRole | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [rating, setRating] = useState(0);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);
  const [userLat, setUserLat] = useState<number | null>(null);
  const [userLng, setUserLng] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setRoleState(getRole());
    const found = getJob(id);
    if (!found) {
      router.push("/jobs");
      return;
    }
    setJob(found);
    setRating(found.rating ?? 0);
    setRatingSubmitted(!!found.rating);
    setLoading(false);

    navigator.geolocation?.getCurrentPosition((pos) => {
      setUserLat(pos.coords.latitude);
      setUserLng(pos.coords.longitude);
    }, () => {});
  }, [id, router]);

  const handleStatusChange = () => {
    if (!job) return;
    const flow = statusFlow[job.status];
    if (!flow.next) return;
    const newStatus = flow.next;
    const updates: Partial<Job> =
      newStatus === "in_progress"
        ? { status: newStatus as Job["status"], assignedTo: "driver-1" }
        : { status: newStatus as Job["status"] };
    updateJob(job.id, updates);
    setJob({ ...job, ...updates });
    setShowConfirm(false);
    toast(t(flow.labelKey as never) + " ✓");
  };

  const handleCancel = () => {
    if (!job) return;
    updateJob(job.id, { status: "cancelled" });
    setJob({ ...job, status: "cancelled" });
    setShowCancelConfirm(false);
    toast(t("jobs.cancelled"));
  };

  const handleRating = () => {
    if (!job || rating === 0) return;
    updateJob(job.id, { rating });
    setRatingSubmitted(true);
    toast(t("rating.thanks"));
  };

  if (loading || !job) {
    return (
      <div className="min-h-dvh pb-20">
        <div className="px-4 pt-6">
          <SkeletonDetail />
        </div>
        <BottomNav />
      </div>
    );
  }

  const flow = statusFlow[job.status];
  const jobTypes = Array.isArray(job.type) ? job.type : [job.type];
  const pricePerItem = jobTypes.includes("glass") ? 1.0 : 0.5;
  const estimatedValue = (job.amount * pricePerItem).toFixed(2);
  const serviceFee = 8;
  const clientEarns = (job.amount * pricePerItem * 0.2).toFixed(2);
  const driverEarns = (job.amount * pricePerItem - parseFloat(clientEarns) - serviceFee).toFixed(2);

  const distance = userLat != null && userLng != null ? haversineKm(userLat, userLng, job.lat, job.lng) : null;

  return (
    <div className="min-h-dvh pb-20">
      <div className="px-4 pt-6">
        <button
          onClick={() => router.back()}
          className="text-gray-500 text-sm mb-4 flex items-center gap-1 active:text-gray-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {t("job.back")}
        </button>

        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white capitalize">
            {jobTypes.join(" + ")} {t("job.collection")}
          </h1>
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColors[job.status]}`}>
            {t(statusLabelKeys[job.status] as never)}
          </span>
        </div>

        <div className="space-y-4 animate-fade-in">
          <MapPicker lat={job.lat} lng={job.lng} interactive={false} />

          <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400 text-sm">{t("job.address")}</span>
              <span className="text-gray-900 dark:text-gray-100 text-sm font-medium text-right max-w-[60%]">{job.address}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400 text-sm">{t("job.amount")}</span>
              <span className="text-gray-900 dark:text-gray-100 text-sm font-medium">{job.amount} {t("job.items")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400 text-sm">{t("job.type")}</span>
              <span className="text-gray-900 dark:text-gray-100 text-sm font-medium capitalize">{jobTypes.join(", ")}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 dark:text-gray-400 text-sm">{t("job.depositOnly")}</span>
              <span className="text-gray-900 dark:text-gray-100 text-sm font-medium">{job.depositOnly ? t("job.yes") : t("job.no")}</span>
            </div>
            {distance !== null && (
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400 text-sm">{t("job.distance")}</span>
                <span className="text-gray-900 dark:text-gray-100 text-sm font-medium">{distance < 1 ? `${(distance * 1000).toFixed(0)} m` : `${distance.toFixed(1)} km`}</span>
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">{t("job.earnings")}</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">{t("job.estimatedValue")}</span>
                <span className="font-medium">{estimatedValue} zl</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">{t("job.clientEarns")}</span>
                <span className="font-medium text-green-600">{clientEarns} zl</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">{t("job.serviceFee")}</span>
                <span className="font-medium">{serviceFee} zl</span>
              </div>
              <div className="flex justify-between border-t border-gray-100 dark:border-gray-800 pt-2">
                <span className="text-gray-500 dark:text-gray-400">{t("job.driverEarns")}</span>
                <span className="font-semibold text-green-600">{driverEarns} zl</span>
              </div>
            </div>
          </div>

          {role === "driver" && flow.next && (
            <button
              onClick={() => setShowConfirm(true)}
              className="w-full bg-green-600 text-white text-lg font-semibold py-4 rounded-2xl active:bg-green-700 transition-all active:scale-[0.98]"
            >
              {t(flow.labelKey as never)}
            </button>
          )}

          {role === "client" && job.status === "pending" && (
            <button
              onClick={() => setShowCancelConfirm(true)}
              className="w-full bg-red-50 text-red-600 text-lg font-semibold py-4 rounded-2xl active:bg-red-100 transition-all active:scale-[0.98] border border-red-200"
            >
              {t("job.cancel")}
            </button>
          )}

          {job.status === "done" && (
            <div className="text-center py-6 animate-fade-in">
              <div className="text-4xl mb-2">✅</div>
              <p className="text-green-600 font-semibold text-lg">{t("job.done")}</p>
              <p className="text-gray-400 text-sm mt-1">{t("job.doneSubtitle")}</p>

              {!ratingSubmitted ? (
                <div className="mt-6">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t("rating.title")}</p>
                  <div className="flex justify-center mb-3">
                    <StarRating value={rating} onChange={setRating} size="lg" />
                  </div>
                  {rating > 0 && (
                    <button
                      onClick={handleRating}
                      className="bg-green-600 text-white font-semibold px-6 py-2.5 rounded-xl active:bg-green-700 transition-colors text-sm"
                    >
                      {t("rating.submit")}
                    </button>
                  )}
                </div>
              ) : (
                <div className="mt-4 flex justify-center">
                  <StarRating value={rating} readonly size="md" />
                </div>
              )}
            </div>
          )}

          {job.status === "cancelled" && (
            <div className="text-center py-6 animate-fade-in">
              <div className="text-4xl mb-2">❌</div>
              <p className="text-red-500 font-semibold text-lg">{t("job.cancelledMsg")}</p>
            </div>
          )}
        </div>
      </div>

      <ConfirmModal
        open={showConfirm}
        title={flow.confirmTitleKey ? t(flow.confirmTitleKey as never) : ""}
        message={flow.confirmMsgKey ? t(flow.confirmMsgKey as never) : ""}
        confirmLabel={flow.labelKey ? t(flow.labelKey as never) : ""}
        onConfirm={handleStatusChange}
        onCancel={() => setShowConfirm(false)}
      />

      <ConfirmModal
        open={showCancelConfirm}
        title={t("confirm.cancelRequest")}
        message={t("confirm.cancelRequestMsg")}
        confirmLabel={t("confirm.cancelBtn")}
        cancelLabel={t("confirm.keep")}
        variant="danger"
        onConfirm={handleCancel}
        onCancel={() => setShowCancelConfirm(false)}
      />

      <BottomNav />
    </div>
  );
}
