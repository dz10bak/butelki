"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getLocale, setLocale as saveLocale } from "@/lib/storage";
import { t, type TranslationKey } from "@/lib/i18n";
import type { Locale } from "@/lib/types";

const LocaleContext = createContext<{
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: TranslationKey) => string;
}>({ locale: "en", setLocale: () => {}, t: (key) => key });

export function useLocale() {
  return useContext(LocaleContext);
}

export default function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    setLocaleState(getLocale());
  }, []);

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    saveLocale(l);
  };

  const translate = (key: TranslationKey) => t(locale, key);

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t: translate }}>
      {children}
    </LocaleContext.Provider>
  );
}
