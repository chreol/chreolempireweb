import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import Apple from "next-auth/providers/apple";
import { SupabaseAdapter } from "@auth/supabase-adapter";
import { createClient as createSupabaseAdminClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://placeholder.supabase.co";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "placeholder";

console.log("[Auth] NextAuth Secret loaded:", Boolean(process.env.NEXTAUTH_SECRET));

function createAdminSupabaseClient() {
  return createSupabaseAdminClient(supabaseUrl, supabaseServiceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export const authOptions: NextAuthOptions = {
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
  session: { strategy: "jwt" },
  callbacks: {
    async signIn({ user, email }) {
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

export const { handlers, auth, signIn, signUp } = NextAuth(authOptions);
export default auth;
