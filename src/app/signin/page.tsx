"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function SignInPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleCredentials(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const result = await signIn("credentials", { email, password, redirect: false });
    setBusy(false);
    if (result?.error || !result?.ok) {
      setError("Email ou mot de passe incorrect.");
      return;
    }
    router.push("/");
    router.refresh();
  }

  function continueAsGuest() {
    router.push("/");
  }

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 py-16">
      <div className="rounded-2xl p-6" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
        <h1 className="text-2xl font-black text-white mb-2">{t("auth.signin.title") || "Connexion"}</h1>
        <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
          {t("auth.signin.subtitle") || "Accédez à votre compte Chreol Empire."}
        </p>

        <div className="flex flex-col gap-3">
          <button
            type="button"
            disabled={busy}
            onClick={() => signIn("google", { redirect: true })}
            className="w-full py-3 rounded-xl text-sm font-black text-white disabled:opacity-50 active:scale-[0.97]"
            style={{ background: "#DB4437" }}
          >
            Continuer avec Google
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => signIn("apple", { redirect: true })}
            className="w-full py-3 rounded-xl text-sm font-black text-white disabled:opacity-50 active:scale-[0.97]"
            style={{ background: "#000000", border: "1px solid var(--border)" }}
          >
            Continuer avec Apple
          </button>
        </div>

        <form onSubmit={handleCredentials} className="mt-6">
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
            className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none mb-4"
            style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}
          />
          {error && <p className="text-xs mb-3" style={{ color: "#EF4444" }}>{error}</p>}
          <button
            type="submit"
            disabled={busy}
            className="w-full py-3 rounded-xl text-sm font-black text-black disabled:opacity-50 active:scale-[0.97]"
            style={{ background: "var(--gold)" }}
          >
            {busy ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => router.push("/signup")}
          className="mt-4 w-full py-3 rounded-xl text-sm font-black text-[var(--gold)] active:scale-[0.97]"
          style={{ background: "var(--bg-card)", border: "1px solid var(--gold)" }}
        >
          Créer mon compte
        </button>

        <button
          type="button"
          onClick={continueAsGuest}
          className="mt-4 w-full py-3 rounded-xl text-sm font-black text-white active:scale-[0.97]"
          style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
        >
          Continuer en tant qu'invité
        </button>
      </div>
    </div>
  );
}
