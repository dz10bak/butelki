"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { setRole } from "@/lib/storage";
import { useLocale } from "@/components/LocaleProvider";
import Onboarding from "@/components/Onboarding";

export default function Home() {
  const router = useRouter();
  const { t, locale, setLocale } = useLocale();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!localStorage.getItem("bottlecollect_onboarded")) {
      setShowOnboarding(true);
    }
  }, []);

  const selectRole = (role: "client" | "driver") => {
    setRole(role);
    router.push(role === "client" ? "/create" : "/jobs");
  };

  if (!mounted) return null;

  return (
    <>
      {showOnboarding && <Onboarding onDone={() => setShowOnboarding(false)} />}

      <div className="min-h-dvh flex flex-col items-center justify-center px-6">
        {/* Language toggle */}
        <div className="absolute top-4 right-4">
          <button
            onClick={() => setLocale(locale === "en" ? "pl" : "en")}
            className="text-xs font-medium px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 active:bg-gray-200 dark:active:bg-gray-700 transition-colors"
          >
            {locale === "en" ? "🇵🇱 PL" : "🇬🇧 EN"}
          </button>
        </div>

        <div className="text-center mb-12 animate-fade-in">
          <div className="text-5xl mb-4">♻️</div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{t("home.title")}</h1>
          <p className="text-gray-500 dark:text-gray-400">{t("home.subtitle")}</p>
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
              {t("home.give")}
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
              {t("home.collect")}
            </span>
          </button>
        </div>

        <p className="text-xs text-gray-400 mt-8 animate-fade-in">{t("home.community")}</p>
      </div>
    </>
  );
}
