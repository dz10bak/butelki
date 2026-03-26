"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getRole } from "@/lib/storage";
import { useTheme } from "@/components/ThemeProvider";
import { useLocale } from "@/components/LocaleProvider";
import type { UserRole } from "@/lib/types";
import type { TranslationKey } from "@/lib/i18n";

const HomeIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0a1 1 0 01-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 01-1 1" />
  </svg>
);

const PlusIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const ListIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
  </svg>
);

const MapIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const ChartIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const SunIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const MoonIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
  </svg>
);

export default function BottomNav() {
  const pathname = usePathname();
  const [role, setRoleState] = useState<UserRole | null>(null);
  const { theme, toggle } = useTheme();
  const { t } = useLocale();

  useEffect(() => {
    setRoleState(getRole());
  }, []);

  if (!role || pathname === "/") return null;

  const tabs: { href: string; labelKey: TranslationKey; icon: React.ReactNode }[] =
    role === "client"
      ? [
          { href: "/", labelKey: "nav.home", icon: <HomeIcon /> },
          { href: "/create", labelKey: "nav.create", icon: <PlusIcon /> },
          { href: "/jobs", labelKey: "nav.jobs", icon: <ListIcon /> },
          { href: "/stats", labelKey: "nav.stats", icon: <ChartIcon /> },
        ]
      : [
          { href: "/", labelKey: "nav.home", icon: <HomeIcon /> },
          { href: "/jobs", labelKey: "nav.jobsDriver", icon: <ListIcon /> },
          { href: "/map", labelKey: "nav.map", icon: <MapIcon /> },
          { href: "/stats", labelKey: "nav.stats", icon: <ChartIcon /> },
        ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 z-50 transition-colors">
      <div className="max-w-md mx-auto lg:max-w-lg xl:max-w-xl flex justify-around items-center h-16">
        {tabs.map((tab) => {
          const active = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center gap-0.5 px-2 py-2 text-[10px] font-medium transition-colors ${
                active ? "text-green-600" : "text-gray-500 dark:text-gray-400"
              }`}
            >
              {tab.icon}
              {t(tab.labelKey)}
            </Link>
          );
        })}
        <button
          onClick={toggle}
          className="flex flex-col items-center gap-0.5 px-2 py-2 text-[10px] font-medium text-gray-500 dark:text-gray-400 transition-colors"
        >
          {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          {theme === "dark" ? t("nav.light") : t("nav.dark")}
        </button>
      </div>
    </nav>
  );
}
