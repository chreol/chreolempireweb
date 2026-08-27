"use client";

import { useEffect, useState } from "react";

interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function PWAInstallPrompt() {
  const [event, setEvent] = useState<InstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleBeforeInstall = (installEvent: Event) => {
      installEvent.preventDefault();
      setEvent(installEvent as InstallPromptEvent);
      setVisible(true);
    };
    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
  }, []);

  async function install() {
    if (!event) return;
    await event.prompt();
    await event.userChoice;
    setEvent(null);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <aside className="fixed bottom-20 left-4 right-4 z-40 mx-auto flex max-w-md items-center gap-3 rounded-2xl p-4 shadow-2xl" style={{ background: "var(--bg-elevated)", border: "1px solid var(--gold)88" }}>
      <p className="flex-1 text-xs font-semibold" style={{ color: "var(--text-primary)" }}>📲 Installer Chreol Empire pour commander plus rapidement.</p>
      <button type="button" onClick={install} className="shrink-0 rounded-xl px-3 py-2 text-xs font-black text-black" style={{ background: "var(--gold)" }}>Installer</button>
      <button type="button" onClick={() => setVisible(false)} aria-label="Fermer" className="shrink-0 text-lg" style={{ color: "var(--text-muted)" }}>×</button>
    </aside>
  );
}
