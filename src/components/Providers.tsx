"use client";

import { ReactNode } from "react";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <LanguageProvider>
        {children}
        <PWAInstallPrompt />
      </LanguageProvider>
    </ThemeProvider>
  );
}
