"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setLoading(false);
    if (res.ok) router.push("/admin");
    else setError("Mot de passe incorrect");
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--bg-primary)" }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <p className="text-3xl font-black mb-1">
            <span style={{ color: "var(--gold)" }}>Chreol</span><span className="text-white">Empire</span>
          </p>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>Espace Administration</p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div className="rounded-2xl p-6" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
            <label className="block text-xs font-bold mb-2" style={{ color: "var(--text-muted)" }}>
              MOT DE PASSE
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none"
              style={{ background: "var(--bg-elevated)", border: `1px solid ${error ? "#EF4444" : "var(--border)"}` }}
              autoFocus
            />
            {error && <p className="text-xs mt-2" style={{ color: "#EF4444" }}>{error}</p>}
          </div>

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full py-3 rounded-full font-black text-black text-sm transition-opacity hover:opacity-85 disabled:opacity-50"
            style={{ background: "var(--gold)" }}
          >
            {loading ? "Connexion..." : "Accéder au tableau de bord"}
          </button>
        </form>
      </div>
    </div>
  );
}
