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
      <div className="text-center mb-12 animate-fade-in">
        <div className="text-5xl mb-4">♻️</div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">BottleCollect</h1>
        <p className="text-gray-500 dark:text-gray-400">Recycle bottles & cans, earn money</p>
      </div>

      <div className="w-full max-w-sm space-y-4 animate-slide-up">
        <button
          onClick={() => selectRole("client")}
          className="w-full bg-green-600 text-white text-lg font-semibold py-4 rounded-2xl active:bg-green-700 active:scale-[0.98] transition-all shadow-sm"
        >
          <span className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
            </svg>
            I want to give bottles
          </span>
        </button>
        <button
          onClick={() => selectRole("driver")}
          className="w-full bg-gray-900 dark:bg-gray-700 text-white text-lg font-semibold py-4 rounded-2xl active:bg-gray-800 dark:active:bg-gray-600 active:scale-[0.98] transition-all shadow-sm"
        >
          <span className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            I want to collect bottles
          </span>
        </button>
      </div>

      <p className="text-xs text-gray-400 mt-8 animate-fade-in">Join the recycling community</p>
    </div>
  );
}
