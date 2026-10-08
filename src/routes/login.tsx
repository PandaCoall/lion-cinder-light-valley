import { Link, createFileRoute } from "@tanstack/react-router";
import { GROK_PROVIDERS, authEnabled, signIn } from "@/lib/auth/client";

type Search = { next?: string };

export const Route = createFileRoute("/login")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    next: typeof search.next === "string" ? search.next : undefined,
  }),
  head: () => ({ meta: [{ title: "Sign in · LightNov" }] }),
  component: Login,
});

function Login() {
  const { next } = Route.useSearch();
  const back = next && next.startsWith("/") ? next : "/profile";
  return (
    <main className="folio grid min-h-dvh place-items-center bg-desk px-6 text-ink">
      <div className="w-full max-w-sm">
        <p className="kicker" style={{ textTransform: "none" }}>LightNov</p>
        <h1 className="mt-2 font-serif text-4xl">Sign in</h1>
        <p className="mt-3 font-sans text-sm text-muted">Guests can open three books. An account keeps the rest.</p>
        <div className="mt-6 flex flex-col gap-2">
          {authEnabled ? (
            GROK_PROVIDERS.map((provider) => (
              <button
                key={provider.providerId}
                type="button"
                onClick={() => signIn(provider.providerId, { callbackURL: back })}
                className="h-12 rounded-full border border-line bg-paper font-sans text-sm"
              >
                Continue with {provider.label}
              </button>
            ))
          ) : (
            <p className="font-sans text-sm text-muted">Sign-in is turned off.</p>
          )}
        </div>
        <Link to="/" className="mt-6 inline-flex h-11 items-center font-sans text-sm text-muted">Back home</Link>
      </div>
    </main>
  );
}
