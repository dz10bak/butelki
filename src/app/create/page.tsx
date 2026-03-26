"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { addJob } from "@/lib/storage";
import type { JobType } from "@/lib/types";
import { useLocale } from "@/components/LocaleProvider";
import { useToast } from "@/components/ToastProvider";
import FormInput from "@/components/FormInput";
import MapPicker from "@/components/MapPicker";
import BottomNav from "@/components/BottomNav";

const jobTypes: { value: JobType; labelKey: "create.cans" | "create.plastic" | "create.glass"; emoji: string }[] = [
  { value: "cans", labelKey: "create.cans", emoji: "🥫" },
  { value: "plastic", labelKey: "create.plastic", emoji: "🧴" },
  { value: "glass", labelKey: "create.glass", emoji: "🍾" },
];

export default function CreatePage() {
  const router = useRouter();
  const { t } = useLocale();
  const { toast } = useToast();
  const [address, setAddress] = useState("");
  const [lat, setLat] = useState(52.2297);
  const [lng, setLng] = useState(21.0122);
  const [amount, setAmount] = useState("");
  const [types, setTypes] = useState<JobType[]>(["cans"]);
  const [depositOnly, setDepositOnly] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      (pos) => {
        setLat(pos.coords.latitude);
        setLng(pos.coords.longitude);
      },
      () => {}
    );
  }, []);

  const handleLocationChange = useCallback((newLat: number, newLng: number, newAddress: string) => {
    setLat(newLat);
    setLng(newLng);
    setAddress(newAddress);
  }, []);

  const toggleType = (type: JobType) => {
    setTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleSubmit = () => {
    const num = parseInt(amount);
    if (!address) {
      setError(t("create.errorLocation"));
      return;
    }
    if (!num || num < 50) {
      setError(t("create.errorAmount"));
      return;
    }
    if (types.length === 0) {
      setError(t("create.errorType"));
      return;
    }
    setError("");

    addJob({
      id: crypto.randomUUID(),
      address,
      lat,
      lng,
      amount: num,
      type: types.length === 1 ? types[0] : types,
      depositOnly,
      status: "pending",
      assignedTo: null,
      createdAt: Date.now(),
    });

    toast(t("create.success"));
    router.push("/jobs");
  };

  return (
    <div className="min-h-dvh pb-20">
      <div className="px-4 pt-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{t("create.title")}</h1>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t("create.location")}</label>
            <MapPicker lat={lat} lng={lng} onLocationChange={handleLocationChange} />
            {address && (
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 truncate">{address}</p>
            )}
          </div>

          <FormInput
            label={t("create.address")}
            value={address}
            onChange={setAddress}
            placeholder={t("create.addressPlaceholder")}
          />

          <FormInput
            label={t("create.amount")}
            type="number"
            value={amount}
            onChange={setAmount}
            placeholder={t("create.amountPlaceholder")}
            min={50}
            error={error && (!amount || parseInt(amount) < 50) ? error : undefined}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t("create.type")}</label>
            <p className="text-xs text-gray-400 mb-2">{t("create.typeHint")}</p>
            <div className="flex gap-2">
              {jobTypes.map((jt) => (
                <button
                  key={jt.value}
                  onClick={() => toggleType(jt.value)}
                  className={`flex-1 py-3 rounded-xl text-sm font-medium transition-colors ${
                    types.includes(jt.value)
                      ? "bg-green-600 text-white"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                  }`}
                >
                  {jt.emoji} {t(jt.labelKey)}
                </button>
              ))}
            </div>
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={depositOnly}
              onChange={(e) => setDepositOnly(e.target.checked)}
              className="w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-green-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">{t("create.depositOnly")}</span>
          </label>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            onClick={handleSubmit}
            className="w-full bg-green-600 text-white text-lg font-semibold py-4 rounded-2xl active:bg-green-700 active:scale-[0.98] transition-all"
          >
            {t("create.submit")}
          </button>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
