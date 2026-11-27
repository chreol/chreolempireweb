"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";

type Props = {
  name: string;
  email: string;
  createdAt: string | null;
};

function formatInscription(value: string | null): string {
  if (!value) return "Non disponible";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Non disponible";
  return date.toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });
}

export default function CompteDashboard({ name, email, createdAt }: Props) {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-balance text-3xl font-black text-white">Mon espace client</h1>
      <p className="mt-2 text-pretty text-sm text-white/60">
        Retrouvez votre profil, vos commandes et la déconnexion.
      </p>

      <section className="mt-8 rounded-3xl border border-[var(--gold)]/30 bg-[#111111] p-5 sm:p-6">
        <p className="text-xs font-black uppercase tracking-widest text-[var(--gold)]">Profil</p>
        <dl className="mt-4 space-y-3 text-sm">
          <div>
            <dt className="text-white/50">Nom</dt>
            <dd className="mt-0.5 font-bold text-white">{name}</dd>
          </div>
          <div>
            <dt className="text-white/50">Email</dt>
            <dd className="mt-0.5 font-bold text-white">{email}</dd>
          </div>
          <div>
            <dt className="text-white/50">Date d&apos;inscription</dt>
            <dd className="mt-0.5 font-bold tabular-nums text-white">{formatInscription(createdAt)}</dd>
          </div>
        </dl>
      </section>

      <section className="mt-4 rounded-3xl border border-white/10 bg-[#111111] p-5 sm:p-6">
        <p className="text-xs font-black uppercase tracking-widest text-[var(--gold)]">Commandes</p>
        <p className="mt-3 text-pretty text-sm text-white/70">
          Consultez le détail de vos achats et le suivi de livraison.
        </p>
        <Link
          href="/historique"
          className="mt-4 inline-flex min-h-11 items-center justify-center rounded-2xl bg-[var(--gold)] px-5 text-sm font-black text-black transition-[opacity,transform] duration-150 ease-out hover:opacity-90 active:scale-[0.96]"
        >
          Voir mon historique
        </Link>
      </section>

      <section className="mt-4 rounded-3xl border border-white/10 bg-[#111111] p-5 sm:p-6">
        <p className="text-xs font-black uppercase tracking-widest text-[var(--gold)]">Paramètres</p>
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/" })}
          className="mt-4 inline-flex min-h-11 items-center justify-center rounded-2xl border border-red-500/40 px-5 text-sm font-black text-red-400 transition-[opacity,transform] duration-150 ease-out hover:opacity-90 active:scale-[0.96]"
        >
          Se déconnecter
        </button>
      </section>
    </div>
  );
}
