"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

const SERVICES_LIST = [
  "cartes-cadeaux", "crypto", "paypal", "coupons", "uba", "factures", "autre",
];

interface PromoCode {
  id: string;
  code: string;
  type: "percent" | "fixed";
  value: number;
  min_order: number;
  max_uses: number;
  uses: number;
  active: boolean;
  expires_at?: string;
  description?: string;
  created_at?: string;
}

interface Offer {
  id: string;
  title: string;
  description: string;
  price: number;
  promo_price?: number;
  service: string;
  currency: string;
  badge?: string;
  active: boolean;
  expires_at?: string;
  wa_prefill?: string;
  created_at?: string;
}

interface Order {
  id: string;
  summary: string;
  total: number;
  payment_method: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  status: "pending" | "done" | "cancelled";
  created_at: string;
  proof_url?: string | null;
  details?: { sourceUrl?: string; items?: { name: string; qty: number; price: number }[] };
}

const STATUS_LABEL: Record<string, { label: string; color: string; bg: string }> = {
  pending:   { label: "En attente", color: "#F59E0B", bg: "#FEF3C7" },
  done:      { label: "Traité",     color: "#10B981", bg: "#D1FAE5" },
  cancelled: { label: "Annulé",     color: "#EF4444", bg: "#FEE2E2" },
};

interface Client {
  key: string; name: string; email: string; phone: string;
  orders: number; doneOrders: number; totalSpent: number;
  points: number; tier: string; lastOrder: string | null;
}
interface ClientStats {
  totalClients: number; totalRevenue: number; avgBasket: number;
  gold: number; silver: number; bronze: number;
}
const TIER_STYLE: Record<string, { color: string; bg: string }> = {
  Or:     { color: "#B45309", bg: "#FEF3C7" },
  Argent: { color: "#6B7280", bg: "#F3F4F6" },
  Bronze: { color: "#92400E", bg: "#FFEDD5" },
};

function formatDate(d: string) {
  return new Date(d).toLocaleString("fr-FR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
}

export default function AdminPage() {
  const router = useRouter();
  const [orders, setOrders]         = useState<Order[]>([]);
  const [statusFilter, setFilter]   = useState("all");
  const [loading, setLoading]       = useState(true);
  const [actionId, setActionId]     = useState<string | null>(null);
  const [analytics, setAnalytics]   = useState<{ configured: boolean; pages?: unknown; events?: unknown } | null>(null);
  const [tab, setTab]               = useState<"orders" | "clients" | "offers" | "promo" | "campaign" | "report" | "analytics">("orders");
  // Promo codes
  const [promos, setPromos]           = useState<PromoCode[]>([]);
  const [promoForm, setPromoForm]     = useState<Partial<PromoCode>>({ type: "percent", value: 10, min_order: 0, max_uses: 0 });
  const [promoMsg, setPromoMsg]       = useState("");
  // Clients / loyalty
  const [clients, setClients]         = useState<Client[]>([]);
  const [clientStats, setClientStats] = useState<ClientStats | null>(null);
  // Report
  const [reportMonth, setReportMonth] = useState("");
  // WhatsApp broadcast
  const [waMessage, setWaMessage]     = useState("");
  const [waPhones, setWaPhones]       = useState<{ phone: string; name: string }[]>([]);
  // Campaign
  const [campSubject, setCampSubject] = useState("");
  const [campBody, setCampBody]       = useState("");
  const [campFilter, setCampFilter]   = useState("");
  const [campResult, setCampResult]   = useState<{ sent?: number; error?: string } | null>(null);
  const [campLoading, setCampLoading] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [offers, setOffers]             = useState<Offer[]>([]);
  const [offerLoading, setOfferLoading] = useState(false);
  const [offerForm, setOfferForm]       = useState<Partial<Offer>>({ currency: "FCFA", active: true, service: "cartes-cadeaux" });
  const [offerMsg, setOfferMsg]         = useState("");

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/orders?status=${statusFilter}&limit=100`);
    if (res.status === 401) { router.push("/admin/login"); return; }
    const data = await res.json();
    setOrders(Array.isArray(data) ? data : []);
    setLoading(false);
  }, [statusFilter, router]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  useEffect(() => {
    if (tab === "analytics" && !analytics) {
      fetch("/api/admin/analytics").then(r => r.json()).then(setAnalytics);
    }
    if (tab === "offers" && offers.length === 0) {
      fetch("/api/admin/offers").then(r => r.json()).then(d => setOffers(Array.isArray(d) ? d : []));
    }
    if (tab === "promo") {
      fetch("/api/admin/promo").then(r => r.json()).then(d => setPromos(Array.isArray(d) ? d : []));
    }
    if (tab === "clients" && clients.length === 0) {
      fetch("/api/admin/clients").then(r => r.json()).then(d => {
        setClients(Array.isArray(d.clients) ? d.clients : []);
        setClientStats(d.stats ?? null);
      });
    }
  }, [tab, analytics, offers.length, clients.length]);

  function downloadReport(format: "csv") {
    const params = new URLSearchParams({ format });
    if (reportMonth) params.set("month", reportMonth);
    window.open(`/api/admin/report?${params}`, "_blank");
  }

  async function loadWaPhones() {
    const res = await fetch("/api/admin/clients");
    const d = await res.json();
    const list = (Array.isArray(d.clients) ? d.clients : [])
      .filter((c: Client) => c.phone && c.phone.replace(/\D/g, "").length >= 9)
      .map((c: Client) => ({ phone: c.phone.replace(/\D/g, ""), name: c.name }));
    setWaPhones(list);
  }

  async function createPromo(e: React.FormEvent) {
    e.preventDefault();
    setPromoMsg("");
    const res = await fetch("/api/admin/promo", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(promoForm),
    });
    if (res.ok) {
      setPromoMsg("✅ Code créé !");
      setPromoForm({ type: "percent", value: 10, min_order: 0, max_uses: 0 });
      fetch("/api/admin/promo").then(r => r.json()).then(d => setPromos(Array.isArray(d) ? d : []));
    } else { setPromoMsg("❌ Erreur création"); }
  }

  async function deletePromo(id: string) {
    if (!confirm("Supprimer ce code ?")) return;
    await fetch("/api/admin/promo", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    setPromos(p => p.filter(c => c.id !== id));
  }

  async function sendCampaign(e: React.FormEvent) {
    e.preventDefault();
    setCampLoading(true); setCampResult(null);
    const res = await fetch("/api/admin/campaign", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subject: campSubject, htmlContent: campBody, filterService: campFilter || undefined }),
    });
    const data = await res.json();
    setCampResult(data); setCampLoading(false);
  }

  async function createOffer(e: React.FormEvent) {
    e.preventDefault();
    setOfferLoading(true); setOfferMsg("");
    const res = await fetch("/api/admin/offers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(offerForm),
    });
    setOfferLoading(false);
    if (res.ok) {
      setOfferMsg("✅ Offre créée avec succès !");
      setOfferForm({ currency: "FCFA", active: true, service: "cartes-cadeaux" });
      fetch("/api/admin/offers").then(r => r.json()).then(d => setOffers(Array.isArray(d) ? d : []));
    } else {
      setOfferMsg("❌ Erreur lors de la création");
    }
  }

  async function toggleOffer(id: string, active: boolean) {
    await fetch("/api/admin/offers", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, active }),
    });
    setOffers(prev => prev.map(o => o.id === id ? { ...o, active } : o));
  }

  async function deleteOffer(id: string) {
    if (!confirm("Supprimer cette offre ?")) return;
    await fetch("/api/admin/offers", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setOffers(prev => prev.filter(o => o.id !== id));
  }

  async function updateStatus(id: string, status: "done" | "cancelled") {
    setActionId(id);
    await fetch("/api/admin/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    setActionId(null);
    fetchOrders();
  }

  async function logout() {
    await fetch("/api/admin/login", { method: "DELETE" });
    router.push("/admin/login");
  }

  const counts = {
    all:       orders.length,
    pending:   orders.filter(o => o.status === "pending").length,
    done:      orders.filter(o => o.status === "done").length,
    cancelled: orders.filter(o => o.status === "cancelled").length,
  };

  const totalRevenue = orders.filter(o => o.status === "done").reduce((s, o) => s + (o.total ?? 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-6 sm:mb-8">
        <div className="min-w-0">
          <p className="text-xl sm:text-2xl font-black text-white truncate">
            <span style={{ color: "var(--gold)" }}>Chreol</span>Empire Admin
          </p>
          <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>Tableau de bord</p>
        </div>
        <button onClick={logout} className="shrink-0 text-xs px-3 sm:px-4 py-2 rounded-full transition-opacity hover:opacity-70 whitespace-nowrap"
          style={{ background: "var(--bg-card)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>
          Déconnexion
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {[
          { label: "Total commandes", value: counts.all,      color: "var(--gold)",  icon: "🛍️" },
          { label: "En attente",       value: counts.pending,  color: "#F59E0B",      icon: "⏳" },
          { label: "Traitées",         value: counts.done,     color: "#10B981",      icon: "✅" },
          { label: "CA traité",        value: `${totalRevenue.toLocaleString("fr-FR")} F`, color: "#10B981", icon: "💰" },
        ].map(s => (
          <div key={s.label} className="rounded-2xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
            <p className="text-2xl mb-1">{s.icon}</p>
            <p className="text-xl font-black" style={{ color: s.color }}>{s.value}</p>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
        {([
          { key: "orders",   label: "📋 Commandes" },
          { key: "clients",  label: "🏆 Clients & Fidélité" },
          { key: "offers",   label: "🎁 Offres" },
          { key: "promo",    label: "🏷️ Codes promo" },
          { key: "campaign", label: "📧 Campagne" },
          { key: "report",   label: "📄 Rapport" },
          { key: "analytics",label: "📊 Stats" },
        ] as const).map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className="shrink-0 px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all whitespace-nowrap"
            style={{
              background: tab === t.key ? "var(--gold)" : "var(--bg-card)",
              color: tab === t.key ? "#0A0A0A" : "var(--text-secondary)",
              border: "1px solid var(--border)",
            }}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === "orders" && (
        <>
          {/* Filter */}
          <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
            {(["all", "pending", "done", "cancelled"] as const).map(s => (
              <button key={s} onClick={() => setFilter(s)}
                className="shrink-0 px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap"
                style={{
                  background: statusFilter === s ? "var(--gold)" : "var(--bg-elevated)",
                  color: statusFilter === s ? "#0A0A0A" : "var(--text-secondary)",
                  border: "1px solid var(--border)",
                }}>
                {s === "all" ? `Toutes (${counts.all})` : `${STATUS_LABEL[s]?.label} (${counts[s]})`}
              </button>
            ))}
            <button onClick={fetchOrders} className="shrink-0 ml-auto px-4 py-1.5 rounded-full text-xs font-bold transition-opacity hover:opacity-70 whitespace-nowrap"
              style={{ background: "var(--bg-elevated)", color: "var(--text-muted)", border: "1px solid var(--border)" }}>
              🔄
            </button>
          </div>

          {/* Orders list */}
          {loading ? (
            <div className="text-center py-16" style={{ color: "var(--text-muted)" }}>Chargement...</div>
          ) : orders.length === 0 ? (
            <div className="text-center py-16 rounded-2xl" style={{ background: "var(--bg-card)", color: "var(--text-muted)" }}>
              Aucune commande trouvée
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {orders.map(order => {
                const st = STATUS_LABEL[order.status] ?? STATUS_LABEL.pending;
                const expanded = expandedId === order.id;
                return (
                  <div key={order.id} className="rounded-2xl overflow-hidden"
                    style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
                    {/* Row */}
                    <div className="flex items-center gap-3 p-4 cursor-pointer" onClick={() => setExpandedId(expanded ? null : order.id)}>
                      {/* Status */}
                      <span className="text-xs font-black px-2 py-1 rounded-full shrink-0"
                        style={{ background: st.bg, color: st.color }}>
                        {st.label}
                      </span>
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-black text-white text-sm">#{order.id.slice(-8).toUpperCase()}</p>
                          <p className="text-xs font-bold" style={{ color: "var(--gold)" }}>
                            {order.total?.toLocaleString("fr-FR")} FCFA
                          </p>
                          <p className="text-xs" style={{ color: "var(--text-muted)" }}>{order.payment_method}</p>
                        </div>
                        <p className="text-xs truncate mt-0.5" style={{ color: "var(--text-secondary)" }}>
                          {order.client_name} · {order.client_email || order.client_phone}
                        </p>
                        <p className="text-xs truncate" style={{ color: "var(--text-muted)" }}>{order.summary}</p>
                      </div>
                      {/* Date */}
                      <p className="text-xs shrink-0 hidden sm:block" style={{ color: "var(--text-muted)" }}>
                        {order.created_at ? formatDate(order.created_at) : "—"}
                      </p>
                      {/* Chevron */}
                      <span style={{ color: "var(--text-muted)" }}>{expanded ? "▲" : "▼"}</span>
                    </div>

                    {/* Expanded */}
                    {expanded && (
                      <div className="px-4 pb-4 pt-0 border-t flex flex-col gap-3" style={{ borderColor: "var(--border)" }}>
                        {/* Items */}
                        {order.details?.items && order.details.items.length > 0 && (
                          <div>
                            <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>Articles</p>
                            {order.details.items.map((item, i) => (
                              <div key={i} className="flex justify-between text-sm py-1"
                                style={{ borderBottom: "1px solid var(--border)", color: "var(--text-secondary)" }}>
                                <span>{item.name} ×{item.qty}</span>
                                <span className="font-bold" style={{ color: "var(--gold)" }}>
                                  {(item.price * item.qty).toLocaleString("fr-FR")} F
                                </span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Source */}
                        {order.details?.sourceUrl && (
                          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                            Source : <a href={order.details.sourceUrl} target="_blank" rel="noopener noreferrer"
                              className="underline" style={{ color: "var(--gold)" }}>{order.details.sourceUrl}</a>
                          </p>
                        )}

                        {/* Actions */}
                        {order.status === "pending" && (
                          <div className="flex gap-2 pt-1">
                            <button onClick={() => updateStatus(order.id, "done")}
                              disabled={actionId === order.id}
                              className="flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-black text-white transition-opacity hover:opacity-85 disabled:opacity-50 whitespace-nowrap"
                              style={{ background: "#059669" }}>
                              {actionId === order.id ? "..." : "✅ Traité"}
                            </button>
                            <button onClick={() => updateStatus(order.id, "cancelled")}
                              disabled={actionId === order.id}
                              className="flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-black text-white transition-opacity hover:opacity-85 disabled:opacity-50 whitespace-nowrap"
                              style={{ background: "#DC2626" }}>
                              {actionId === order.id ? "..." : "❌ Annuler"}
                            </button>
                            {order.client_phone && (
                              <a href={`https://wa.me/${order.client_phone.replace(/\D/g, "")}`}
                                target="_blank" rel="noopener noreferrer"
                                className="shrink-0 px-4 py-2.5 rounded-xl text-sm font-black text-white flex items-center justify-center"
                                style={{ background: "#25D366" }}>
                                💬
                              </a>
                            )}
                          </div>
                        )}
                        {order.status !== "pending" && (
                          <p className="text-xs text-center py-1" style={{ color: "var(--text-muted)" }}>
                            Commande {order.status === "done" ? "traitée ✅" : "annulée ❌"}
                          </p>
                        )}

                        {/* ── Preuve de paiement ── */}
                        {order.proof_url ? (
                          <div className="mt-2 rounded-xl overflow-hidden" style={{ border: "1px solid #10B98144" }}>
                            <div className="flex items-center justify-between px-3 py-2" style={{ background: "#10B98114" }}>
                              <p className="text-xs font-black" style={{ color: "#10B981" }}>📎 Preuve de paiement</p>
                              <a href={order.proof_url} target="_blank" rel="noopener noreferrer"
                                className="text-[10px] font-bold underline" style={{ color: "#10B981" }}>
                                Ouvrir →
                              </a>
                            </div>
                            <a href={order.proof_url} target="_blank" rel="noopener noreferrer" className="block">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={order.proof_url}
                                alt="Preuve paiement"
                                className="w-full max-h-40 object-contain"
                                style={{ background: "var(--bg-elevated)" }}
                              />
                            </a>
                          </div>
                        ) : order.status === "pending" && (
                          <div className="mt-2 px-3 py-2 rounded-xl text-xs flex items-center justify-between"
                            style={{ background: "#F59E0B11", border: "1px solid #F59E0B33" }}>
                            <span style={{ color: "#F59E0B" }}>⏳ En attente de preuve de paiement</span>
                            <a
                              href={`/confirmer-paiement?order=${order.id}`}
                              target="_blank" rel="noopener noreferrer"
                              className="text-[10px] font-bold underline" style={{ color: "#F59E0B" }}>
                              Lien client →
                            </a>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {tab === "clients" && (
        <div className="flex flex-col gap-5">
          {/* Loyalty stats */}
          {clientStats && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { label: "Clients uniques",  value: clientStats.totalClients,                              icon: "👥", color: "var(--gold)" },
                { label: "Panier moyen",     value: `${clientStats.avgBasket.toLocaleString("fr-FR")} F`,  icon: "🛒", color: "#10B981" },
                { label: "CA total clients",  value: `${clientStats.totalRevenue.toLocaleString("fr-FR")} F`, icon: "💰", color: "#10B981" },
                { label: "🥇 Or (200k+)",    value: clientStats.gold,    icon: "",  color: "#B45309" },
                { label: "🥈 Argent (50k+)", value: clientStats.silver,  icon: "",  color: "#6B7280" },
                { label: "🥉 Bronze",        value: clientStats.bronze,  icon: "",  color: "#92400E" },
              ].map(s => (
                <div key={s.label} className="rounded-2xl p-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
                  {s.icon && <p className="text-xl mb-1">{s.icon}</p>}
                  <p className="text-lg font-black" style={{ color: s.color }}>{s.value}</p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{s.label}</p>
                </div>
              ))}
            </div>
          )}

          <div className="rounded-2xl p-4" style={{ background: "#FFFBEB22", border: "1px solid #FDE68A44" }}>
            <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
              <strong style={{ color: "var(--gold)" }}>Règle de fidélité :</strong> 1 point par 500 FCFA dépensé (commandes traitées). Tiers : Bronze → Argent (50 000 F) → Or (200 000 F). Récompensez vos clients Or avec des codes promo exclusifs !
            </p>
          </div>

          {/* Client list */}
          <div>
            <p className="font-bold text-white mb-3">Top clients ({clients.length})</p>
            {clients.length === 0 ? (
              <p className="text-sm text-center py-8 rounded-2xl" style={{ background: "var(--bg-card)", color: "var(--text-muted)" }}>
                Aucun client avec commande traitée pour l&apos;instant
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                {clients.map((c, i) => {
                  const ts = TIER_STYLE[c.tier] ?? TIER_STYLE.Bronze;
                  return (
                    <div key={c.key} className="flex items-center gap-3 p-4 rounded-2xl" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
                      <span className="shrink-0 w-7 text-center font-black text-sm" style={{ color: "var(--text-muted)" }}>{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-black text-white text-sm truncate">{c.name}</p>
                          <span className="text-xs font-black px-2 py-0.5 rounded-full" style={{ background: ts.bg, color: ts.color }}>{c.tier}</span>
                        </div>
                        <p className="text-xs truncate" style={{ color: "var(--text-muted)" }}>{c.email || c.phone}</p>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="text-sm font-black" style={{ color: "var(--gold)" }}>{c.totalSpent.toLocaleString("fr-FR")} F</p>
                        <p className="text-xs" style={{ color: "var(--text-muted)" }}>{c.points} pts · {c.doneOrders} cmd</p>
                      </div>
                      {c.phone && (
                        <a href={`https://wa.me/${c.phone.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer"
                          className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-white" style={{ background: "#25D366" }}>💬</a>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {tab === "report" && (
        <div className="flex flex-col gap-5">
          <div className="rounded-2xl p-5" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
            <p className="font-black text-white mb-1">📄 Export des commandes</p>
            <p className="text-xs mb-4" style={{ color: "var(--text-muted)" }}>
              Téléchargez vos commandes au format CSV (ouvrable dans Excel / Google Sheets). Laissez le mois vide pour tout exporter.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:items-end">
              <div className="flex-1">
                <label className="block text-xs font-bold mb-1" style={{ color: "var(--text-muted)" }}>MOIS (optionnel)</label>
                <input type="month" value={reportMonth} onChange={e => setReportMonth(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl text-white text-sm outline-none"
                  style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }} />
              </div>
              <button onClick={() => downloadReport("csv")}
                className="px-6 py-2.5 rounded-full font-black text-black text-sm hover:opacity-85 whitespace-nowrap"
                style={{ background: "var(--gold)" }}>
                ⬇️ Télécharger CSV
              </button>
            </div>
          </div>

          <div className="rounded-2xl p-5" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
            <p className="font-black text-white mb-1">🖨️ Rapport imprimable (PDF)</p>
            <p className="text-xs mb-4" style={{ color: "var(--text-muted)" }}>
              Ouvre une version imprimable de cette page. Utilisez « Imprimer → Enregistrer en PDF » de votre navigateur.
            </p>
            <button onClick={() => window.print()}
              className="px-6 py-2.5 rounded-full font-black text-sm hover:opacity-85"
              style={{ background: "var(--bg-elevated)", color: "var(--text-primary)", border: "1px solid var(--border)" }}>
              🖨️ Imprimer / Enregistrer en PDF
            </button>
          </div>
        </div>
      )}

      {tab === "promo" && (
        <div className="flex flex-col gap-6">
          <div className="rounded-2xl p-5" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
            <p className="font-black text-white mb-4">➕ Créer un code promo</p>
            <form onSubmit={createPromo} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold mb-1" style={{ color: "var(--text-muted)" }}>CODE *</label>
                <input required value={promoForm.code ?? ""} onChange={e => setPromoForm(p => ({ ...p, code: e.target.value.toUpperCase() }))}
                  placeholder="ex: PROMO20" className="w-full px-4 py-2.5 rounded-xl text-white text-sm outline-none font-mono"
                  style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }} />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1" style={{ color: "var(--text-muted)" }}>TYPE</label>
                <select value={promoForm.type ?? "percent"} onChange={e => setPromoForm(p => ({ ...p, type: e.target.value as "percent"|"fixed" }))}
                  className="w-full px-4 py-2.5 rounded-xl text-white text-sm outline-none"
                  style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
                  <option value="percent">% Pourcentage</option>
                  <option value="fixed">FCFA fixe</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold mb-1" style={{ color: "var(--text-muted)" }}>
                  VALEUR ({promoForm.type === "percent" ? "%" : "FCFA"}) *
                </label>
                <input required type="number" min="1" value={promoForm.value ?? ""} onChange={e => setPromoForm(p => ({ ...p, value: +e.target.value }))}
                  placeholder={promoForm.type === "percent" ? "ex: 10" : "ex: 1000"}
                  className="w-full px-4 py-2.5 rounded-xl text-white text-sm outline-none"
                  style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }} />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1" style={{ color: "var(--text-muted)" }}>COMMANDE MINIMUM (FCFA)</label>
                <input type="number" min="0" value={promoForm.min_order ?? 0} onChange={e => setPromoForm(p => ({ ...p, min_order: +e.target.value }))}
                  placeholder="0 = pas de minimum"
                  className="w-full px-4 py-2.5 rounded-xl text-white text-sm outline-none"
                  style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }} />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1" style={{ color: "var(--text-muted)" }}>UTILISATIONS MAX (0 = illimité)</label>
                <input type="number" min="0" value={promoForm.max_uses ?? 0} onChange={e => setPromoForm(p => ({ ...p, max_uses: +e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl text-white text-sm outline-none"
                  style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }} />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1" style={{ color: "var(--text-muted)" }}>EXPIRATION (optionnel)</label>
                <input type="datetime-local" value={promoForm.expires_at ?? ""} onChange={e => setPromoForm(p => ({ ...p, expires_at: e.target.value || undefined }))}
                  className="w-full px-4 py-2.5 rounded-xl text-white text-sm outline-none"
                  style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }} />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold mb-1" style={{ color: "var(--text-muted)" }}>DESCRIPTION</label>
                <input value={promoForm.description ?? ""} onChange={e => setPromoForm(p => ({ ...p, description: e.target.value || undefined }))}
                  placeholder="ex: -10% pour les nouveaux clients"
                  className="w-full px-4 py-2.5 rounded-xl text-white text-sm outline-none"
                  style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }} />
              </div>
              <div className="sm:col-span-2 flex items-center gap-3">
                <button type="submit" className="px-8 py-3 rounded-full font-black text-black text-sm hover:opacity-85" style={{ background: "var(--gold)" }}>
                  ➕ Créer le code
                </button>
                {promoMsg && <p className="text-sm font-bold" style={{ color: promoMsg.startsWith("✅") ? "#10B981" : "#EF4444" }}>{promoMsg}</p>}
              </div>
            </form>
          </div>
          <div>
            <p className="font-bold text-white mb-3">Codes actifs ({promos.length})</p>
            {promos.length === 0 ? (
              <p className="text-sm text-center py-8 rounded-2xl" style={{ background: "var(--bg-card)", color: "var(--text-muted)" }}>Aucun code créé</p>
            ) : (
              <div className="flex flex-col gap-2">
                {promos.map(p => (
                  <div key={p.id} className="flex items-center gap-3 p-4 rounded-2xl" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-black font-mono text-white text-sm">{p.code}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ background: "var(--gold)", color: "#0A0A0A" }}>
                          {p.type === "percent" ? `-${p.value}%` : `-${p.value.toLocaleString("fr-FR")} F`}
                        </span>
                        {p.max_uses > 0 && <span className="text-xs" style={{ color: "var(--text-muted)" }}>{p.uses}/{p.max_uses} utilisations</span>}
                        {p.min_order > 0 && <span className="text-xs" style={{ color: "var(--text-muted)" }}>min {p.min_order.toLocaleString("fr-FR")} F</span>}
                      </div>
                      {p.description && <p className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>{p.description}</p>}
                    </div>
                    <button onClick={() => deletePromo(p.id)} className="px-3 py-1.5 rounded-xl text-xs font-bold hover:opacity-75" style={{ background: "#EF444420", color: "#EF4444" }}>🗑️</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {tab === "campaign" && (
        <div className="flex flex-col gap-5">
          <div className="rounded-2xl p-5" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
            <p className="font-black text-white mb-1">📧 Campagne email</p>
            <p className="text-xs mb-4" style={{ color: "var(--text-muted)" }}>
              Envoie un email promotionnel à tous les clients passés (emails collectés lors des commandes).
            </p>
            <form onSubmit={sendCampaign} className="flex flex-col gap-3">
              <div>
                <label className="block text-xs font-bold mb-1" style={{ color: "var(--text-muted)" }}>SUJET *</label>
                <input required value={campSubject} onChange={e => setCampSubject(e.target.value)}
                  placeholder="ex: 🎉 Promo -15% ce weekend chez Chreol Empire !"
                  className="w-full px-4 py-2.5 rounded-xl text-white text-sm outline-none"
                  style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }} />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1" style={{ color: "var(--text-muted)" }}>FILTRER PAR SERVICE (optionnel)</label>
                <select value={campFilter} onChange={e => setCampFilter(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl text-white text-sm outline-none"
                  style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
                  <option value="">Tous les clients</option>
                  {SERVICES_LIST.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold mb-1" style={{ color: "var(--text-muted)" }}>CONTENU HTML *</label>
                <textarea required value={campBody} onChange={e => setCampBody(e.target.value)}
                  placeholder="<p>Bonjour {{name}},</p><p>Profitez de <strong>-15%</strong> sur toutes les cartes cadeaux ce weekend...</p>"
                  rows={8}
                  className="w-full px-4 py-2.5 rounded-xl text-white text-sm outline-none font-mono resize-y"
                  style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }} />
              </div>
              <div className="flex items-center gap-3">
                <button type="submit" disabled={campLoading}
                  className="px-8 py-3 rounded-full font-black text-black text-sm hover:opacity-85 disabled:opacity-50"
                  style={{ background: "var(--gold)" }}>
                  {campLoading ? "Envoi en cours..." : "📤 Envoyer la campagne"}
                </button>
                {campResult && (
                  <p className="text-sm font-bold" style={{ color: campResult.error ? "#EF4444" : "#10B981" }}>
                    {campResult.error ? `❌ ${campResult.error}` : `✅ ${campResult.sent} email(s) envoyés`}
                  </p>
                )}
              </div>
            </form>
          </div>
          {/* WhatsApp broadcast */}
          <div className="rounded-2xl p-5" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
            <p className="font-black text-white mb-1">📱 Broadcast WhatsApp</p>
            <p className="text-xs mb-4" style={{ color: "var(--text-muted)" }}>
              Rédigez votre message promo, chargez vos clients, puis cliquez sur chaque lien pour envoyer (ouvre WhatsApp avec le message pré-rempli). Fonctionne sans API payante.
            </p>
            <textarea value={waMessage} onChange={e => setWaMessage(e.target.value)}
              placeholder="ex: 🔥 Promo Chreol Empire ! -15% sur toutes les cartes cadeaux ce weekend. Commandez vite : chreolempire.com"
              rows={3}
              className="w-full px-4 py-2.5 mb-3 rounded-xl text-white text-sm outline-none resize-none"
              style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }} />
            <button onClick={loadWaPhones} disabled={!waMessage.trim()}
              className="px-6 py-2.5 rounded-full font-black text-black text-sm hover:opacity-85 disabled:opacity-50"
              style={{ background: "var(--gold)" }}>
              👥 Charger les clients ({waPhones.length || "?"})
            </button>

            {waPhones.length > 0 && (
              <div className="mt-4 flex flex-col gap-2 max-h-80 overflow-y-auto">
                {waPhones.map(c => (
                  <a key={c.phone}
                    href={`https://wa.me/${c.phone}?text=${encodeURIComponent(waMessage)}`}
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-between gap-3 p-3 rounded-xl transition-opacity hover:opacity-80"
                    style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
                    <span className="text-sm truncate" style={{ color: "var(--text-secondary)" }}>{c.name} · +{c.phone}</span>
                    <span className="shrink-0 text-xs font-black px-3 py-1.5 rounded-lg text-white" style={{ background: "#25D366" }}>Envoyer 💬</span>
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Bot FAQ note */}
          <div className="rounded-2xl p-4" style={{ background: "#FFFBEB22", border: "1px solid #FDE68A44" }}>
            <p className="text-sm font-bold mb-1" style={{ color: "var(--gold)" }}>💬 Bot FAQ WhatsApp automatique</p>
            <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
              Pour des réponses 100% automatiques (bot), il faut un compte <strong>WhatsApp Business API</strong> (Meta) ou un service comme Twilio/360dialog. Une fois le compte créé, je peux brancher un webhook qui répond automatiquement aux questions fréquentes. Dis-moi quand tu veux activer ça.
            </p>
          </div>
        </div>
      )}

      {tab === "offers" && (
        <div className="flex flex-col gap-6">
          {/* Formulaire création */}
          <div className="rounded-2xl p-5" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
            <p className="font-black text-white mb-4">➕ Nouvelle offre / produit</p>
            <form onSubmit={createOffer} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Titre */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold mb-1" style={{ color: "var(--text-muted)" }}>TITRE *</label>
                <input required value={offerForm.title ?? ""} onChange={e => setOfferForm(p => ({ ...p, title: e.target.value }))}
                  placeholder="ex: PSN 20€ Promo Spéciale"
                  className="w-full px-4 py-2.5 rounded-xl text-white text-sm outline-none"
                  style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }} />
              </div>
              {/* Description */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold mb-1" style={{ color: "var(--text-muted)" }}>DESCRIPTION</label>
                <textarea value={offerForm.description ?? ""} onChange={e => setOfferForm(p => ({ ...p, description: e.target.value }))}
                  placeholder="ex: Carte PSN 20€ région Europe. Code livré en 15 min sur WhatsApp."
                  rows={2}
                  className="w-full px-4 py-2.5 rounded-xl text-white text-sm outline-none resize-none"
                  style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }} />
              </div>
              {/* Prix normal */}
              <div>
                <label className="block text-xs font-bold mb-1" style={{ color: "var(--text-muted)" }}>PRIX NORMAL (FCFA) *</label>
                <input required type="number" min="0" value={offerForm.price ?? ""} onChange={e => setOfferForm(p => ({ ...p, price: +e.target.value }))}
                  placeholder="ex: 14500"
                  className="w-full px-4 py-2.5 rounded-xl text-white text-sm outline-none"
                  style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }} />
              </div>
              {/* Prix promo */}
              <div>
                <label className="block text-xs font-bold mb-1" style={{ color: "var(--text-muted)" }}>PRIX PROMO (optionnel)</label>
                <input type="number" min="0" value={offerForm.promo_price ?? ""} onChange={e => setOfferForm(p => ({ ...p, promo_price: e.target.value ? +e.target.value : undefined }))}
                  placeholder="ex: 12000"
                  className="w-full px-4 py-2.5 rounded-xl text-white text-sm outline-none"
                  style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }} />
              </div>
              {/* Service */}
              <div>
                <label className="block text-xs font-bold mb-1" style={{ color: "var(--text-muted)" }}>SERVICE</label>
                <select value={offerForm.service ?? "cartes-cadeaux"} onChange={e => setOfferForm(p => ({ ...p, service: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl text-white text-sm outline-none"
                  style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
                  {SERVICES_LIST.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              {/* Badge */}
              <div>
                <label className="block text-xs font-bold mb-1" style={{ color: "var(--text-muted)" }}>BADGE (optionnel)</label>
                <input value={offerForm.badge ?? ""} onChange={e => setOfferForm(p => ({ ...p, badge: e.target.value || undefined }))}
                  placeholder="ex: 🔥 Limité, ⚡ Flash, 🎁 Nouveau"
                  className="w-full px-4 py-2.5 rounded-xl text-white text-sm outline-none"
                  style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }} />
              </div>
              {/* Expiration */}
              <div>
                <label className="block text-xs font-bold mb-1" style={{ color: "var(--text-muted)" }}>DATE D'EXPIRATION (optionnel)</label>
                <input type="datetime-local" value={offerForm.expires_at ?? ""} onChange={e => setOfferForm(p => ({ ...p, expires_at: e.target.value || undefined }))}
                  className="w-full px-4 py-2.5 rounded-xl text-white text-sm outline-none"
                  style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }} />
              </div>
              {/* WhatsApp prefill */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold mb-1" style={{ color: "var(--text-muted)" }}>MESSAGE WHATSAPP PRÉ-REMPLI (optionnel)</label>
                <input value={offerForm.wa_prefill ?? ""} onChange={e => setOfferForm(p => ({ ...p, wa_prefill: e.target.value || undefined }))}
                  placeholder="ex: Bonjour, je veux commander la PSN 20€ promo à 12 000 FCFA"
                  className="w-full px-4 py-2.5 rounded-xl text-white text-sm outline-none"
                  style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)" }} />
              </div>
              {/* Active toggle */}
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={offerForm.active ?? true} onChange={e => setOfferForm(p => ({ ...p, active: e.target.checked }))}
                  className="w-4 h-4 accent-amber-400" />
                <label className="text-sm" style={{ color: "var(--text-secondary)" }}>Offre active (visible sur le site)</label>
              </div>
              {/* Submit */}
              <div className="sm:col-span-2 flex items-center gap-3">
                <button type="submit" disabled={offerLoading}
                  className="px-8 py-3 rounded-full font-black text-black text-sm transition-opacity hover:opacity-85 disabled:opacity-50"
                  style={{ background: "var(--gold)" }}>
                  {offerLoading ? "Création..." : "➕ Créer l'offre"}
                </button>
                {offerMsg && <p className="text-sm font-bold" style={{ color: offerMsg.startsWith("✅") ? "#10B981" : "#EF4444" }}>{offerMsg}</p>}
              </div>
            </form>
          </div>

          {/* Liste offres existantes */}
          <div>
            <p className="font-bold text-white mb-3">Offres existantes ({offers.length})</p>
            {offers.length === 0 ? (
              <p className="text-sm text-center py-8 rounded-2xl" style={{ background: "var(--bg-card)", color: "var(--text-muted)" }}>
                Aucune offre créée pour l'instant
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                {offers.map(o => (
                  <div key={o.id} className="flex items-center gap-3 p-4 rounded-2xl"
                    style={{ background: "var(--bg-card)", border: `1px solid ${o.active ? "var(--border)" : "#EF444422"}`, opacity: o.active ? 1 : 0.6 }}>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        {o.badge && <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ background: "var(--gold)", color: "#0A0A0A" }}>{o.badge}</span>}
                        <p className="font-black text-white text-sm truncate">{o.title}</p>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        {o.promo_price ? (
                          <>
                            <span className="text-sm font-black" style={{ color: "var(--gold)" }}>{o.promo_price.toLocaleString("fr-FR")} F</span>
                            <span className="text-xs line-through" style={{ color: "var(--text-muted)" }}>{o.price.toLocaleString("fr-FR")} F</span>
                          </>
                        ) : (
                          <span className="text-sm font-black" style={{ color: "var(--gold)" }}>{o.price.toLocaleString("fr-FR")} F</span>
                        )}
                        <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "var(--bg-elevated)", color: "var(--text-muted)" }}>{o.service}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button onClick={() => toggleOffer(o.id, !o.active)}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold transition-opacity hover:opacity-75"
                        style={{ background: o.active ? "#EF444420" : "#10B98120", color: o.active ? "#EF4444" : "#10B981" }}>
                        {o.active ? "Désactiver" : "Activer"}
                      </button>
                      <button onClick={() => deleteOffer(o.id)}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold transition-opacity hover:opacity-75"
                        style={{ background: "#EF444420", color: "#EF4444" }}>
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Idées supplémentaires */}
          <div className="rounded-2xl p-5" style={{ background: "#FFFBEB22", border: "1px solid #FDE68A44" }}>
            <p className="font-black mb-3" style={{ color: "var(--gold)" }}>💡 Idées pour enrichir l'admin</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs" style={{ color: "var(--text-secondary)" }}>
              {[
                "📧 Campagne email promotionnelle aux clients passés",
                "📱 Notification WhatsApp broadcast pour les promos",
                "🏆 Système de fidélité — points par commande",
                "📊 Rapport PDF mensuel des commandes",
                "🔔 Alerte stock bas sur les services",
                "🌍 Gestion des taux de change en temps réel",
                "💬 Réponses automatiques WhatsApp (bot FAQ)",
                "🎁 Codes promo avec réduction (% ou FCFA fixe)",
              ].map(idea => (
                <div key={idea} className="flex items-start gap-2 p-2 rounded-xl" style={{ background: "var(--bg-elevated)" }}>
                  <span>{idea}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === "analytics" && (
        <div className="flex flex-col gap-4">
          {/* Vercel Analytics */}
          <div className="rounded-2xl p-5" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
            <p className="font-black text-white mb-1">📊 Vercel Analytics</p>
            {!analytics ? (
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>Chargement...</p>
            ) : !analytics.configured ? (
              <div>
                <p className="text-sm mb-3" style={{ color: "var(--text-secondary)" }}>
                  Ajoute <code className="px-1 rounded text-xs" style={{ background: "var(--bg-elevated)", color: "var(--gold)" }}>VERCEL_API_TOKEN</code> dans les variables Vercel pour voir les stats ici.
                </p>
                <a href="https://vercel.com/chreol-empire/chreolempire-web/analytics"
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold text-white transition-opacity hover:opacity-85"
                  style={{ background: "#000" }}>
                  ▲ Ouvrir Vercel Analytics
                </a>
              </div>
            ) : (
              <div>
                <p className="text-sm mb-3" style={{ color: "#10B981" }}>✅ Connecté — 30 derniers jours</p>
                <a href="https://vercel.com/chreol-empire/chreolempire-web/analytics"
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold text-white transition-opacity hover:opacity-85"
                  style={{ background: "#000" }}>
                  ▲ Ouvrir le tableau de bord complet
                </a>
              </div>
            )}
          </div>

          {/* External tools */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <a href="https://search.google.com/search-console"
              target="_blank" rel="noopener noreferrer"
              className="rounded-2xl p-5 transition-all hover:-translate-y-0.5"
              style={{ background: "var(--bg-card)", border: "1px solid #EA433530" }}>
              <p className="text-xl mb-2">🔍</p>
              <p className="font-black text-white text-sm">Google Search Console</p>
              <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                Mots-clés, impressions, clics, position moyenne
              </p>
            </a>

            <a href={`https://vercel.com/chreol-empire/chreolempire-web/analytics`}
              target="_blank" rel="noopener noreferrer"
              className="rounded-2xl p-5 transition-all hover:-translate-y-0.5"
              style={{ background: "var(--bg-card)", border: "1px solid #00000030" }}>
              <p className="text-xl mb-2">▲</p>
              <p className="font-black text-white text-sm">Vercel Analytics (complet)</p>
              <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                Pageviews, visiteurs uniques, événements, conversions
              </p>
            </a>

            <a href="https://analytics.google.com"
              target="_blank" rel="noopener noreferrer"
              className="rounded-2xl p-5 transition-all hover:-translate-y-0.5"
              style={{ background: "var(--bg-card)", border: "1px solid #34A85330" }}>
              <p className="text-xl mb-2">📈</p>
              <p className="font-black text-white text-sm">Google Analytics</p>
              <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                Comportement utilisateurs, entonnoirs, sessions
              </p>
            </a>

            <a href="https://merchants.google.com"
              target="_blank" rel="noopener noreferrer"
              className="rounded-2xl p-5 transition-all hover:-translate-y-0.5"
              style={{ background: "var(--bg-card)", border: "1px solid #4285F430" }}>
              <p className="text-xl mb-2">🛍️</p>
              <p className="font-black text-white text-sm">Google Merchant Center</p>
              <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                Performance des produits dans Google Shopping
              </p>
            </a>
          </div>

          {/* Note keywords */}
          <div className="rounded-2xl p-4" style={{ background: "#FFFBEB22", border: "1px solid #FDE68A44" }}>
            <p className="text-sm font-bold mb-1" style={{ color: "var(--gold)" }}>💡 Mots-clés recherchés</p>
            <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
              Les mots-clés tapés dans Google avant d'arriver sur le site sont dans <strong>Google Search Console → Résultats de recherche → Requêtes</strong>.
              Les termes de recherche dans la barre du site nécessitent un tracking manuel (non encore implémenté).
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
