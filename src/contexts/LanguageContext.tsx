"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { T, Lang } from "@/lib/i18n/translations";

interface LanguageContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "fr",
  setLang: () => {},
  t: (key) => T[key]?.fr ?? key,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("fr");

  useEffect(() => {
    // French is the primary language for the Cameroonian market.
    // Always default to "fr" — only honor an explicit stored "fr", never "en".
    const stored = localStorage.getItem("lang") as Lang | null;
    const resolved: Lang = stored === "fr" ? "fr" : "fr";
    setLangState(resolved);
    document.documentElement.lang = resolved;
    if (stored !== "fr") localStorage.setItem("lang", "fr");
  }, []);

  function setLang(l: Lang) {
    setLangState(l);
    localStorage.setItem("lang", l);
    document.documentElement.lang = l;
  }

  function t(key: string): string {
    return T[key]?.[lang] ?? T[key]?.fr ?? key;
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
