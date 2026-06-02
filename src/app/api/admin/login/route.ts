export const runtime = "edge";

export async function POST(request: Request): Promise<Response> {
  const { password } = await request.json().catch(() => ({ password: "" }));
  const secret = process.env.ADMIN_PASSWORD ?? "chreolempire-admin";

  if (password !== secret) {
    return Response.json({ error: "Mot de passe incorrect" }, { status: 401 });
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Set-Cookie": `admin_token=${secret}; Path=/; HttpOnly; SameSite=Strict; Max-Age=86400`,
    },
  });
}

export async function DELETE(): Promise<Response> {
  return new Response(null, {
    status: 204,
    headers: {
      "Set-Cookie": "admin_token=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0",
    },
  });
}
