import { getServerSession } from "next-auth";
import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import Apple from "next-auth/providers/apple";
import { SupabaseAdapter } from "@auth/supabase-adapter";
import { createClient as createSupabaseAdminClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://placeholder.supabase.co";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "placeholder";
const secureCookie = process.env.NEXTAUTH_URL?.startsWith("https://") ?? false;
const cookiePrefix = secureCookie ? "__Secure-" : "";

console.log("[Auth] NextAuth Secret loaded:", Boolean(process.env.NEXTAUTH_SECRET));
console.log("[Auth] NEXTAUTH_SECRET length >= 32:", (process.env.NEXTAUTH_SECRET ?? "").length >= 32);
console.log("[Auth][Google] GOOGLE_CLIENT_ID:", (process.env.GOOGLE_CLIENT_ID ?? "").slice(0, 12));
console.log("[Auth][Google] GOOGLE_CLIENT_SECRET loaded:", Boolean(process.env.GOOGLE_CLIENT_SECRET));
console.log("[Auth][Google] NEXTAUTH_URL:", process.env.NEXTAUTH_URL);

function createAdminSupabaseClient() {
  return createSupabaseAdminClient(supabaseUrl, supabaseServiceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export const authOptions: NextAuthOptions = {
  // Secret explicite (l'App Router peut parfois ne pas injecter NEXTAUTH_SECRET correctement)
  secret: process.env.NEXTAUTH_SECRET,
  useSecureCookies: secureCookie,
  cookies: {
    sessionToken: {
      name: `${cookiePrefix}next-auth.session-token`,
      options: { httpOnly: true, sameSite: "lax", path: "/", secure: secureCookie },
    },
    callbackUrl: {
      name: `${cookiePrefix}next-auth.callback-url`,
      options: { httpOnly: true, sameSite: "lax", path: "/", secure: secureCookie },
    },
    csrfToken: {
      name: `${secureCookie ? "__Host-" : ""}next-auth.csrf-token`,
      options: { httpOnly: true, sameSite: "lax", path: "/", secure: secureCookie },
    },
    pkceCodeVerifier: {
      name: `${cookiePrefix}next-auth.pkce.code_verifier`,
      options: { httpOnly: true, sameSite: "lax", path: "/", secure: secureCookie, maxAge: 60 * 15 },
    },
    state: {
      name: `${cookiePrefix}next-auth.state`,
      options: { httpOnly: true, sameSite: "lax", path: "/", secure: secureCookie, maxAge: 60 * 15 },
    },
    nonce: {
      name: `${cookiePrefix}next-auth.nonce`,
      options: { httpOnly: true, sameSite: "lax", path: "/", secure: secureCookie },
    },
  },
  adapter: SupabaseAdapter({
    url: supabaseUrl,
    secret: process.env.SUPABASE_SECRET ?? "placeholder",
  }),
  providers: [
    Credentials({
      id: "credentials",
      name: "Email",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email;
        const password = credentials?.password;
        if (!email || !password) return null;
        const supabase = createAdminSupabaseClient();
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error || !data?.user) return null;
        const user = data.user;
        const meta = (user.user_metadata ?? {}) as Record<string, unknown>;
        const name =
          (typeof meta.full_name === "string" ? meta.full_name : typeof meta.name === "string" ? meta.name : null) ??
          user.email ??
          email;
        return { id: user.id, email: user.email ?? email, name };
      },
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
    Apple({
      clientId: process.env.APPLE_CLIENT_ID ?? "",
      clientSecret: process.env.APPLE_CLIENT_SECRET ?? "",
    }),
  ],
  // Page de connexion NextAuth (doit correspondre à la route /signin existante)
  pages: { signIn: "/signin" },
  session: { strategy: "jwt" },
  logger: {
    error(code, metadata) {
      const record = metadata && typeof metadata === "object" ? metadata as Record<string, unknown> : {};
      const nested = record.error;
      console.error("[Auth][Google]", {
        code,
        error: nested instanceof Error ? nested.message : typeof nested === "string" ? nested : undefined,
        error_description: typeof record.error_description === "string" ? record.error_description : undefined,
        error_uri: typeof record.error_uri === "string" ? record.error_uri : undefined,
        message: metadata instanceof Error ? metadata.message : undefined,
      });
    },
  },
  callbacks: {
    async signIn({ user, account, email }) {
      const details = account as { error?: string; error_description?: string; error_uri?: string } | null | undefined;
      if (details?.error || details?.error_description || details?.error_uri) {
        console.error("[Auth][Google] signIn", {
          error: details.error,
          error_description: details.error_description,
          error_uri: details.error_uri,
        });
        return false;
      }
      console.log(`[Auth] Tentative de connexion réussie pour : ${email ?? user?.email ?? "inconnu"}`);
      return true;
    },
    async jwt({ token, user }) {
      const userId = user ? (user as { id?: string }).id : undefined;
      if (userId) token.id = userId;
      return token;
    },
    async session({ session, token }) {
      const userId = (token.id as string) ?? (token.sub as string) ?? undefined;
      if (session.user && userId) {
        (session.user as { id?: string }).id = userId;
      }
      return session;
    },
  },
};

/** Session serveur NextAuth v4. Le helper `auth()` de la v5 n'existe pas dans ce paquet. */
export function auth() {
  return getServerSession(authOptions);
}
