import { createFileRoute } from "@tanstack/react-router";
import { auth, ensureAuthSchema } from "@/lib/auth/server";

async function handle(request: Request) {
  try {
    try {
      await ensureAuthSchema();
    } catch {
      // A bad database address must not stop the redirect to Google.
    }
    const response = await auth.handler(request);
    if (response.status < 500) return response;
    const text = await response.text();
    if (text.trim()) {
      return new Response(text, { status: response.status, headers: response.headers });
    }
    return Response.json({ message: "Sign-in failed. Please try again." }, { status: response.status });
  } catch (error) {
    const raw = error instanceof Error ? error.message : "Sign-in failed. Please try again.";
    const message = /ENOTFOUND|ECONNREFUSED|EAI_AGAIN/.test(raw)
      ? "Sign-in could not be saved because the site database is not connected."
      : raw.replace(/postgres(?:ql)?:\/\/\S+/gi, "database");
    return Response.json({ message }, { status: 500 });
  }
}

export const Route = createFileRoute("/api/auth/$")({
  server: {
    handlers: {
      GET: ({ request }) => handle(request),
      POST: ({ request }) => handle(request),
    },
  },
});
