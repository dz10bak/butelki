"use client";

import { useRouter } from "next/navigation";
import { setRole } from "@/lib/storage";

export default function Home() {
  const router = useRouter();

  const selectRole = (role: "client" | "driver") => {
    setRole(role);
    router.push(role === "client" ? "/create" : "/jobs");
  };

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-6">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">BottleCollect</h1>
        <p className="text-gray-500">Recycle bottles & cans, earn money</p>
      </div>

      <div className="w-full max-w-sm space-y-4">
        <button
          onClick={() => selectRole("client")}
          className="w-full bg-green-600 text-white text-lg font-semibold py-4 rounded-2xl active:bg-green-700 transition-colors shadow-sm"
        >
          I want to give bottles
        </button>
        <button
          onClick={() => selectRole("driver")}
          className="w-full bg-gray-900 text-white text-lg font-semibold py-4 rounded-2xl active:bg-gray-800 transition-colors shadow-sm"
        >
          I want to collect bottles
        </button>
      </div>
    </div>
  );
}
