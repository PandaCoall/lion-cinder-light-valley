import { Link, createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { authClient, authEnabled, signInWithGoogle } from "@/lib/auth/client";

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
  const router = useRouter();
  const back = next && next.startsWith("/") ? next : "/profile";
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const finish = () => {
    void router.navigate({ to: back });
  };

  const submitEmail = async () => {
    setError("");
    setBusy(true);
    try {
      const result =
        mode === "up"
          ? await authClient.signUp.email({
              email: email.trim(),
              password,
              name: email.trim().split("@")[0] || "Reader",
              callbackURL: back,
            })
          : await authClient.signIn.email({
              email: email.trim(),
              password,
              callbackURL: back,
            });
      if (result.error) {
        setError(result.error.message ?? "That email could not be used.");
        return;
      }
      finish();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "That email could not be used.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="folio grid min-h-dvh place-items-center bg-desk px-6 text-ink">
      <div className="w-full max-w-sm">
        <p className="kicker" style={{ textTransform: "none" }}>LightNov</p>
        <h1 className="mt-2 font-serif text-4xl">{mode === "up" ? "Create account" : "Sign in"}</h1>
        <p className="mt-3 font-sans text-sm text-muted">Use Google, or your own email. Guests can open three books. An account keeps the rest.</p>
        {authEnabled ? (
          <>
            <button
              type="button"
              className="mt-6 h-12 w-full rounded-full bg-[#FFE62D] font-sans text-sm text-[#1a100c]"
              onClick={() => {
                setError("");
                void signInWithGoogle(back).catch((caught: unknown) => {
                  setError(caught instanceof Error ? caught.message : "Google sign-in failed");
                });
              }}
            >
              Continue with Google
            </button>
            <p className="mt-4 text-center font-sans text-xs text-muted">or your email</p>
            <form
              className="mt-3 flex flex-col gap-2"
              onSubmit={(event) => {
                event.preventDefault();
                void submitEmail();
              }}
            >
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Email"
                aria-label="Email"
                className="h-12 rounded-full border border-line bg-paper px-4 font-sans text-sm"
              />
              <input
                type="password"
                required
                minLength={8}
                autoComplete={mode === "up" ? "new-password" : "current-password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Password, at least 8 characters"
                aria-label="Password"
                className="h-12 rounded-full border border-line bg-paper px-4 font-sans text-sm"
              />
              {error ? <p className="px-2 font-sans text-sm text-[#FD4499]">{error}</p> : null}
              <button type="submit" disabled={busy} className="h-12 rounded-full bg-[#12B8FF] font-sans text-sm text-[#1a100c] disabled:opacity-60">
                {busy ? "Please wait" : mode === "up" ? "Create account" : "Sign in with email"}
              </button>
            </form>
            <button
              type="button"
              className="mt-4 block font-sans text-sm text-muted"
              onClick={() => {
                setMode(mode === "up" ? "in" : "up");
                setError("");
              }}
            >
              {mode === "up" ? "Already have an account? Sign in" : "New here? Create an account"}
            </button>
          </>
        ) : (
          <p className="mt-6 font-sans text-sm text-muted">Sign-in is turned off.</p>
        )}
        <Link to="/" className="mt-6 block font-sans text-sm text-muted">Back home</Link>
      </div>
    </main>
  );
}