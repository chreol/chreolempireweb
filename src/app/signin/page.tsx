"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { IMAGES } from "@/lib/services";

const enter = { type: "spring" as const, duration: 0.45, bounce: 0 };
const iconSwap = { type: "spring" as const, duration: 0.3, bounce: 0 };

function GoogleMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.91c1.7-1.57 2.69-3.88 2.69-6.62z" />
      <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.91-2.26c-.81.54-1.84.86-3.05.86-2.35 0-4.34-1.59-5.05-3.72H.96v2.33A9 9 0 0 0 9 18z" />
      <path fill="#FBBC05" d="M3.95 10.7A5.4 5.4 0 0 1 3.66 9c0-.59.1-1.16.29-1.7V4.97H.96A9 9 0 0 0 0 9c0 1.45.35 2.82.96 4.03l2.99-2.33z" />
      <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .96 4.97l2.99 2.33C4.66 5.17 6.65 3.58 9 3.58z" />
    </svg>
  );
}

export default function SignInPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
    <div className="relative min-h-[calc(100vh-8rem)] overflow-hidden">
      <Image
        src={IMAGES.boutique}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-[center_30%]"
      />
      <div className="absolute inset-0 bg-black/80" />

      <div className="relative flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={enter}
          className="mx-4 w-full max-w-md rounded-3xl border border-[var(--gold)]/30 bg-[#111111]/90 p-5 shadow-2xl sm:p-8"
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...enter, delay: 0.08 }}
            className="mb-6 text-center"
          >
            <Image
              src={IMAGES.logo}
              alt="CHREOL EMPIRE"
              width={76}
              height={76}
              className="mx-auto outline outline-1 -outline-offset-1 outline-white/10"
            />
            <h1 className="mt-4 text-2xl font-black text-white text-balance">
              {t("auth.signin.title")}
            </h1>
            <p className="mt-2 text-sm text-pretty text-white/70">
              {t("auth.signin.subtitle")}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...enter, delay: 0.16 }}
            className="flex flex-col gap-3"
          >
            <button
              type="button"
              disabled={busy}
              onClick={() => signIn("google", { redirect: true })}
              className="flex w-full items-center justify-center gap-3 rounded-2xl bg-white py-3 text-sm font-bold text-black transition-transform duration-150 ease-out hover:opacity-90 active:scale-[0.96] disabled:opacity-50"
            >
              <GoogleMark />
              Continuer avec Google
            </button>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...enter, delay: 0.24 }}
            onSubmit={handleCredentials}
            className="mt-6"
          >
            <label htmlFor="signin-email" className="mb-1.5 block text-xs font-bold text-white/60">Email</label>
            <div className="relative mb-3">
              <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-white/45" aria-hidden="true" />
              <input
                id="signin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="vous@email.com"
                className="w-full rounded-xl border border-gray-700 bg-[#222222] py-3 pl-11 pr-4 text-sm text-white outline-none transition-[border-color] duration-150 placeholder:text-white/35 focus:border-[var(--gold)]"
              />
            </div>

            <label htmlFor="signin-password" className="mb-1.5 block text-xs font-bold text-white/60">Mot de passe</label>
            <div className="relative mb-4">
              <Lock className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-white/45" aria-hidden="true" />
              <input
                id="signin-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full rounded-xl border border-gray-700 bg-[#222222] py-3 pl-11 pr-11 text-sm text-white outline-none transition-[border-color] duration-150 placeholder:text-white/35 focus:border-[var(--gold)]"
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 transition-colors duration-150 hover:text-white"
              >
                <span className="relative block size-4">
                  <motion.span
                    className="absolute inset-0"
                    animate={{
                      opacity: showPassword ? 0 : 1,
                      scale: showPassword ? 0.25 : 1,
                      filter: showPassword ? "blur(4px)" : "blur(0px)",
                    }}
                    transition={iconSwap}
                  >
                    <Eye className="size-4" />
                  </motion.span>
                  <motion.span
                    className="absolute inset-0"
                    animate={{
                      opacity: showPassword ? 1 : 0,
                      scale: showPassword ? 1 : 0.25,
                      filter: showPassword ? "blur(0px)" : "blur(4px)",
                    }}
                    transition={iconSwap}
                  >
                    <EyeOff className="size-4" />
                  </motion.span>
                </span>
              </button>
            </div>

            {error && <p className="mb-3 text-xs text-red-400">{error}</p>}

            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-2xl bg-[var(--gold)] py-3 text-sm font-black text-black transition-[opacity,transform] duration-150 ease-out hover:opacity-90 active:scale-[0.96] disabled:opacity-50"
            >
              {busy ? "Connexion..." : "Se connecter"}
            </button>
          </motion.form>

          <p className="mt-5 text-center text-sm text-white/70">
            Pas encore de compte ?{" "}
            <button
              type="button"
              onClick={() => router.push("/signup")}
              className="font-bold text-[var(--gold)] transition-opacity duration-150 hover:opacity-80"
            >
              Créer mon compte
            </button>
          </p>
        </motion.div>

        <button
          type="button"
          onClick={continueAsGuest}
          className="mt-6 text-xs text-white/40 transition-colors duration-150 hover:text-white/70"
        >
          Continuer en tant qu&apos;invité
        </button>
      </div>
    </div>
  );
}
