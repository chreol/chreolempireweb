"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useToast } from "@/components/Toast";

const STORAGE_KEY = "ce-welcome";

export default function WelcomeToast() {
  const { data: session, status } = useSession();
  const { showToast } = useToast();
  const shown = useRef(false);

  useEffect(() => {
    if (status !== "authenticated" || shown.current) return;
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(STORAGE_KEY) === "1") return;
    shown.current = true;
    sessionStorage.setItem(STORAGE_KEY, "1");
    const raw = session?.user?.name || session?.user?.email?.split("@")[0] || "";
    const name = raw.trim();
    showToast(
      name ? `Bienvenue sur CHREOL EMPIRE, ${name} !` : "Bienvenue sur CHREOL EMPIRE !",
      "success",
    );
  }, [session, showToast, status]);

  return null;
}
