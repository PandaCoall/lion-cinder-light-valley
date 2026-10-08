import { Link, createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppNav } from "@/components/nav";
import { UserButton } from "@/lib/auth/gates";
import { authEnabled } from "@/lib/auth/client";
import { cacheVolume } from "@/lib/book-tools";
import { useOpenBook } from "@/lib/open-book";
import { useReader } from "@/lib/reader-store";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Profile · LightNov" }] }),
  component: Profile,
});

function Profile() {
  const theme = useReader((state) => state.theme);
  const face = useReader((state) => state.face);
  const offline = useReader((state) => state.offline);
  const setOffline = useReader((state) => state.setOffline);
  const { signedIn, opened, limit } = useOpenBook();
  const [install, setInstall] = useState(false);
  const [notice, setNotice] = useState("");

  return (
    <div className="folio flex min-h-dvh flex-col bg-desk text-ink" data-theme={theme} data-face={face}>
      <header className="mx-auto w-full max-w-3xl px-5 pt-6">
        <p className="kicker">Profile</p>
        <h1 className="mt-1 font-serif text-4xl">Your account</h1>
      </header>
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-4 px-5 py-6">
        <section className="rounded-3xl bg-paper p-5">
          {signedIn ? (
            <UserButton />
          ) : (
            <>
              <p className="font-serif text-2xl">Reading as a guest</p>
              <p className="mt-2 font-sans text-sm text-muted">{opened} of {limit} books opened. Sign in to keep going past that.</p>
              <Link to="/login" className="mt-4 inline-flex h-11 items-center rounded-full bg-ink px-4 font-sans text-sm text-paper">Sign in</Link>
            </>
          )}
          {!authEnabled ? <p className="mt-2 font-sans text-sm text-muted">Sign-in is off in this build.</p> : null}
        </section>
        <section className="rounded-3xl bg-paper p-5">
          <h2 className="font-serif text-2xl">On this device</h2>
          <button
            type="button"
            className="mt-4 h-11 rounded-full border border-line px-4 font-sans text-sm"
            onClick={() => {
              void cacheVolume().then((ok) => {
                setOffline(ok);
                setNotice(ok ? "Illustrations saved for offline reading." : "Offline save is not available here.");
              });
            }}
          >
            {offline ? "Illustrations saved offline" : "Save illustrations offline"}
          </button>
          <button type="button" className="mt-3 block h-11 rounded-full border border-line px-4 font-sans text-sm" onClick={() => setInstall(true)}>
            Install LightNov
          </button>
          {notice ? <p className="mt-3 font-sans text-sm text-muted">{notice}</p> : null}
        </section>
      </main>
      {install ? (
        <div className="fixed inset-0 z-40 flex items-end justify-center bg-ink/40 p-4" onClick={() => setInstall(false)}>
          <div className="w-full max-w-md rounded-3xl bg-paper p-6" onClick={(event) => event.stopPropagation()}>
            <img src="/__grok/icon-180.png" alt="" className="size-16 rounded-2xl" />
            <h2 className="mt-4 font-serif text-3xl">Add LightNov</h2>
            <p className="mt-3 font-sans text-sm leading-relaxed text-muted">On iPhone: Share, then Add to Home Screen. On Android: the browser menu, then Install app.</p>
            <button type="button" className="mt-5 h-12 rounded-full bg-ink px-5 font-sans text-sm text-paper" onClick={() => setInstall(false)}>Close</button>
          </div>
        </div>
      ) : null}
      <AppNav />
    </div>
  );
}
