"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface AdminUser {
  id: string;
  email: string;
  name: string;
  created_at: string;
  confirmed_at: string;
}

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (!res.ok) { setError(data?.error || "Erreur chargement utilisateurs"); setUsers([]); return; }
      setUsers(Array.isArray(data?.users) ? (data.users as AdminUser[]) : []);
    } catch {
      setError("Erreur chargement utilisateurs");
      setUsers([]);
    }
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  async function deleteUser(id: string, email: string) {
    if (!confirm(`Supprimer l'utilisateur ${email} ?`)) return;
    const res = await fetch("/api/admin/users/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      setUsers(prev => prev.filter(u => u.id !== id));
    } else {
      const data = await res.json().catch(() => ({}));
      alert(data?.error || "Erreur suppression");
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-white">👥 Utilisateurs</h1>
        <button onClick={fetchUsers} className="text-xs px-4 py-2 rounded-full font-bold"
          style={{ background: "var(--bg-elevated)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>
          🔄 Rafraîchir
        </button>
      </div>

      {error && <p className="text-xs" style={{ color: "#EF4444" }}>{error}</p>}

      {loading ? (
        <div className="text-center py-16" style={{ color: "var(--text-muted)" }}>Chargement...</div>
      ) : users.length === 0 ? (
        <div className="text-center py-16 rounded-2xl" style={{ background: "var(--bg-card)", color: "var(--text-muted)" }}>
          Aucun utilisateur trouvé
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {users.map(u => (
            <div key={u.id} className="rounded-2xl p-4 flex items-center gap-3"
              style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center font-black text-sm shrink-0"
                style={{ background: "var(--gold)", color: "var(--bg-primary)" }}>
                {(u.name || u.email).charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-black text-white text-sm truncate">{u.name || "—"}</p>
                <p className="text-xs truncate" style={{ color: "var(--text-muted)" }}>{u.email}</p>
                <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>Inscrit le {u.created_at ? new Date(u.created_at).toLocaleDateString("fr-FR") : "—"}</p>
              </div>
              <button
                type="button"
                onClick={() => deleteUser(u.id, u.email)}
                className="shrink-0 text-xs px-3 py-2 rounded-full font-bold active:scale-[0.96]"
                style={{ background: "#DC262622", color: "#EF4444", border: "1px solid #EF444455" }}
              >
                🗑️ Supprimer
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
