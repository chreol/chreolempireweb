"use client";

import { useState } from "react";
import Modal from "@/components/admin/Modal";
import PasswordField from "@/components/admin/PasswordField";

const fieldClass = "w-full px-4 py-3 rounded-xl text-white text-sm outline-none";
const fieldStyle = { background: "var(--bg-elevated)", border: "1px solid var(--border)" };

export default function PasswordModal({ onClose }: { onClose: () => void }) {
  const [currentPassword, setCurrent] = useState("");
  const [newPassword, setNew] = useState("");
  const [confirmPassword, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setOk("");
    if (newPassword.length < 8) {
      setError("Le nouveau mot de passe doit contenir au moins 8 caractères.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("La confirmation ne correspond pas.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/admin/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(typeof data.error === "string" ? data.error : "Changement impossible.");
        return;
      }
      setOk("Mot de passe mis à jour.");
      setCurrent("");
      setNew("");
      setConfirm("");
    } catch {
      setError("Changement impossible.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal title="Changer le mot de passe" onClose={onClose}>
      <form onSubmit={submit} className="flex flex-col gap-3">
        <label className="text-xs font-bold" style={{ color: "var(--text-muted)" }}>
          ANCIEN MOT DE PASSE
          <PasswordField value={currentPassword} onChange={e => setCurrent(e.target.value)} autoComplete="current-password" required className={`${fieldClass} mt-1`} style={fieldStyle} />
        </label>
        <label className="text-xs font-bold" style={{ color: "var(--text-muted)" }}>
          NOUVEAU MOT DE PASSE
          <PasswordField value={newPassword} onChange={e => setNew(e.target.value)} autoComplete="new-password" required minLength={8} className={`${fieldClass} mt-1`} style={fieldStyle} />
        </label>
        <label className="text-xs font-bold" style={{ color: "var(--text-muted)" }}>
          CONFIRMATION
          <PasswordField value={confirmPassword} onChange={e => setConfirm(e.target.value)} autoComplete="new-password" required minLength={8} className={`${fieldClass} mt-1`} style={fieldStyle} />
        </label>
        {error && <p className="text-xs" style={{ color: "#EF4444" }}>{error}</p>}
        {ok && <p className="text-xs" style={{ color: "#10B981" }}>{ok}</p>}
        <button
          type="submit"
          disabled={loading}
          className="mt-1 py-3 rounded-full font-black text-black text-sm disabled:opacity-50 active:scale-[0.96]"
          style={{ background: "var(--gold)", transition: "scale 150ms" }}
        >
          {loading ? "Enregistrement..." : "Enregistrer"}
        </button>
      </form>
    </Modal>
  );
}
