"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function SignUpPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    setBusy(false);
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data?.error || "Impossible de créer le compte.");
      return;
    }
    setDone(true);
  }

  function goSignIn() {
    router.push("/signin");
  }

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 py-16">
      <div className="rounded-2xl p-6" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
        <h1 className="text-2xl font-black text-white mb-2">{t("auth.signup.title") || "Créer mon compte"}</h1>
        <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
          {t("auth.signup.subtitle") || "Rejoignez Chreol Empire pour suivre vos commandes."}
        </p>

        {done ? (
          <div>
            <p className="text-sm mb-6" style={{ color: "#4ADE80" }}>Compte créé avec succès.</p>
            <button
              type="button"
              onClick={goSignIn}
              className="w-full py-3 rounded-xl text-sm font-black text-black active:scale-[0.97]"
              style={{ background: "var(--gold)" }}
            >
              Se connecter
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <label className="block text-xs font-bold mb-1.5" style={{ color: "var(--text-secondary)" }}>Nom</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none mb-3"
              style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
            />
            <label className="block text-xs font-bold mb-1.5" style={{ color: "var(--text-secondary)" }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none mb-3"
              style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
            />
            <label className="block text-xs font-bold mb-1.5" style={{ color: "var(--text-secondary)" }}>Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none mb-3"
              style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
            />
            {error && <p className="text-xs mb-3" style={{ color: "#EF4444" }}>{error}</p>}
            <button
              type="submit"
              disabled={busy}
              className="w-full py-3 rounded-xl text-sm font-black text-black disabled:opacity-50 active:scale-[0.97]"
              style={{ background: "var(--gold)" }}
            >
              {busy ? "Création..." : "Créer le compte"}
            </button>
          </form>
        )}

        {!done && (
          <button
            type="button"
            onClick={() => router.push("/signin")}
            className="mt-4 w-full py-3 rounded-xl text-sm font-black text-white active:scale-[0.97]"
            style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
          >
            Déjà un compte ? Se connecter
          </button>
        )}
      </div>
    </div>
  );
}
