"use client";

import { createContext, useContext, useState, useCallback, useEffect } from "react";

export interface HistoryEntry {
  id: string;
  date: string;
  service: string;
  details: string;
  amount: number;
  currency: string;
  status: "pending" | "completed" | "cancelled";
  waText?: string;
}

interface HistoryContextValue {
  entries: HistoryEntry[];
  addEntry: (entry: Omit<HistoryEntry, "id" | "date">) => void;
  clearHistory: () => void;
}

const HistoryContext = createContext<HistoryContextValue>({
  entries: [],
  addEntry: () => {},
  clearHistory: () => {},
});

const STORAGE_KEY = "chreol_history";

function save(data: HistoryEntry[]) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch {}
}

export function HistoryProvider({ children }: { children: React.ReactNode }) {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setEntries(JSON.parse(raw));
    } catch {}
  }, []);

  const addEntry = useCallback((entry: Omit<HistoryEntry, "id" | "date">) => {
    const newEntry: HistoryEntry = {
      ...entry,
      id: crypto.randomUUID().slice(0, 8).toUpperCase(),
      date: new Date().toISOString(),
    };
    setEntries(prev => {
      const next = [newEntry, ...prev].slice(0, 50);
      save(next);
      return next;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setEntries([]);
    save([]);
  }, []);

  return (
    <HistoryContext.Provider value={{ entries, addEntry, clearHistory }}>
      {children}
    </HistoryContext.Provider>
  );
}

export function useHistory() {
  return useContext(HistoryContext);
}
