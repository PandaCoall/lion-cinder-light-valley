import { createFileRoute } from "@tanstack/react-router";
import { auth } from "@/lib/auth/server";

async function handle(request: Request) {
  try {
    const response = await auth.handler(request);
    if (response.status < 500) return response;
    const text = await response.text();
    if (text.trim()) {
      return new Response(text, { status: response.status, headers: response.headers });
    }
    return Response.json({ message: "Sign-in failed. Please try again." }, { status: response.status });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Sign-in failed. Please try again.";
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
