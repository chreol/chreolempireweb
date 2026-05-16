"use client";

import { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";

type ToastType = "success" | "error" | "info";

interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue>({ showToast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

const COLORS: Record<ToastType, { bg: string; border: string; icon: string }> = {
  success: { bg: "#0D1A0F", border: "#25D36655", icon: "✓" },
  error:   { bg: "#1A0A0A", border: "#EF444455", icon: "✕" },
  info:    { bg: "#1A1500", border: "#C9A84C55", icon: "ℹ" },
};

function ToastItem({ item, onRemove }: { item: ToastItem; onRemove: (id: string) => void }) {
  const c = COLORS[item.type];
  const ref = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    ref.current = setTimeout(() => onRemove(item.id), 4000);
    return () => { if (ref.current) clearTimeout(ref.current); };
  }, [item.id, onRemove]);

  return (
    <div
      className="flex items-start gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-white shadow-xl animate-in slide-in-from-bottom-4"
      style={{
        background: c.bg,
        border: `1px solid ${c.border}`,
        minWidth: 260,
        maxWidth: 360,
      }}
    >
      <span
        className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-black shrink-0 mt-0.5"
        style={{
          background: item.type === "success" ? "#25D366" : item.type === "error" ? "#EF4444" : "#C9A84C",
          color: "#0A0A0A",
        }}
      >
        {c.icon}
      </span>
      <span className="flex-1 leading-snug">{item.message}</span>
      <button
        onClick={() => onRemove(item.id)}
        className="text-xs opacity-40 hover:opacity-80 transition-opacity shrink-0 mt-0.5"
      >
        ✕
      </button>
    </div>
  );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: ToastType = "info") => {
    const id = Math.random().toString(36).slice(2);
    setToasts(prev => [...prev.slice(-4), { id, message, type }]);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-6 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
        {toasts.map(t => (
          <div key={t.id} className="pointer-events-auto">
            <ToastItem item={t} onRemove={removeToast} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
