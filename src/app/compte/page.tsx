import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { auth } from "@/lib/auth";
import CompteDashboard from "./CompteDashboard";

async function inscriptionDate(userId: string | undefined): Promise<string | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key || !userId) return null;
  try {
    const supabase = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data, error } = await supabase.auth.admin.getUserById(userId);
    if (error || !data.user?.created_at) return null;
    return data.user.created_at;
  } catch (error) {
    console.error("[compte] date d'inscription indisponible", error);
    return null;
  }
}

export default async function ComptePage() {
  const session = await auth();
  if (!session?.user) redirect("/signin");

  const user = session.user as { id?: string; name?: string | null; email?: string | null };
  const name = user.name?.trim() || user.email?.split("@")[0] || "Client";
  const email = user.email?.trim() || "Non renseigné";
  const createdAt = await inscriptionDate(user.id);

  return <CompteDashboard name={name} email={email} createdAt={createdAt} />;
}
