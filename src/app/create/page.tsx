"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { addJob } from "@/lib/storage";
import type { JobType } from "@/lib/types";
import FormInput from "@/components/FormInput";
import MapPicker from "@/components/MapPicker";
import BottomNav from "@/components/BottomNav";

const jobTypes: { value: JobType; label: string }[] = [
  { value: "cans", label: "Cans" },
  { value: "plastic", label: "Plastic" },
  { value: "glass", label: "Glass" },
];

export default function CreatePage() {
  const router = useRouter();
  const [address, setAddress] = useState("");
  const [lat, setLat] = useState(52.2297);
  const [lng, setLng] = useState(21.0122);
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<JobType>("cans");
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

  const handleSubmit = () => {
    const num = parseInt(amount);
    if (!address) {
      setError("Please select a location on the map");
      return;
    }
    if (!num || num < 50) {
      setError("Minimum 50 items required");
      return;
    }
    setError("");

    addJob({
      id: crypto.randomUUID(),
      address,
      lat,
      lng,
      amount: num,
      type,
      depositOnly,
      status: "pending",
      assignedTo: null,
      createdAt: Date.now(),
    });

    router.push("/jobs");
  };

  return (
    <div className="min-h-dvh pb-20">
      <div className="max-w-md mx-auto px-4 pt-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Create Request</h1>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <MapPicker lat={lat} lng={lng} onLocationChange={handleLocationChange} />
            {address && (
              <p className="mt-2 text-sm text-gray-600 truncate">{address}</p>
            )}
          </div>

          <FormInput
            label="Address"
            value={address}
            onChange={setAddress}
            placeholder="Enter address or tap the map"
          />

          <FormInput
            label="Amount (min. 50)"
            type="number"
            value={amount}
            onChange={setAmount}
            placeholder="Number of items"
            min={50}
            error={error && (!amount || parseInt(amount) < 50) ? error : undefined}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
            <div className="flex gap-2">
              {jobTypes.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setType(t.value)}
                  className={`flex-1 py-3 rounded-xl text-sm font-medium transition-colors ${
                    type === t.value
                      ? "bg-green-600 text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {t.label}
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
            <span className="text-sm text-gray-700">Only items with deposit</span>
          </label>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            onClick={handleSubmit}
            className="w-full bg-green-600 text-white text-lg font-semibold py-4 rounded-2xl active:bg-green-700 transition-colors"
          >
            Submit Request
          </button>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
