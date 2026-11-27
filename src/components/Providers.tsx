"use client";

import { ReactNode } from "react";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { SessionProvider } from "next-auth/react";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider>
        <LanguageProvider>
          {children}
          <PWAInstallPrompt />
        </LanguageProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
