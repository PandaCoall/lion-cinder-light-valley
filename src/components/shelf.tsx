import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { BookOpen, Bookmark, Download, ImageIcon, Share2 } from "lucide-react";
import { book, chapters } from "@/data/volume";
import { bumpBadge, cacheVolume, shareCard } from "@/lib/book-tools";
import { useReader } from "@/lib/reader-store";

export function Shelf() {
  const theme = useReader((state) => state.theme);
  const face = useReader((state) => state.face);
  const anchor = useReader((state) => state.anchor);
  const chapterTitle = useReader((state) => state.chapterTitle);
  const progress = useReader((state) => state.progress);
  const reset = useReader((state) => state.reset);
  const sealed = useReader((state) => state.sealed);
  const setSealed = useReader((state) => state.setSealed);
  const offline = useReader((state) => state.offline);
  const setOffline = useReader((state) => state.setOffline);
  const importedTitle = useReader((state) => state.importedTitle);
  const setImportedTitle = useReader((state) => state.setImportedTitle);
  const setManuscript = useReader((state) => state.setManuscript);
  const ownTitle = useReader((state) => state.ownTitle);
  const fileRef = useRef<HTMLInputElement>(null);
  const [installOpen, setInstallOpen] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const started = anchor > 0;

  useEffect(() => {
    bumpBadge(started);
  }, [started]);

  const onFile = async (file: File | undefined) => {
    if (!file) return;
    const text = await file.text();
    try {
      const parsed = JSON.parse(text) as { title?: string };
      setImportedTitle(parsed.title || file.name.replace(/\.[^.]+$/, ""));
      if (!parsed.title) setManuscript(text);
    } catch {
      setImportedTitle(file.name.replace(/\.[^.]+$/, ""));
      setManuscript(text);
    }
    setNotice("Volume landed on the shelf.");
  };

  return (
    <div className="folio min-h-dvh bg-desk text-ink" data-theme={theme} data-size="md" data-face={face}>
      <header className="mx-auto flex max-w-5xl items-end justify-between gap-3 px-5 pt-6 pb-2 sm:px-8 sm:pt-8">
        <div>
          <p className="kicker" style={{ textTransform: "none" }}>LightNov</p>
          <p className="mt-1 font-serif text-lg text-ink">A book, with plates</p>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/discover" className="inline-flex h-11 items-center rounded-full border border-line px-4 font-sans text-sm text-ink">
            Discover
          </Link>
          <Link to="/write" className="inline-flex h-11 items-center rounded-full border border-line px-4 font-sans text-sm text-ink">
            Write
          </Link>
          <button
            type="button"
            onClick={() => setInstallOpen(true)}
            className="inline-flex h-11 items-center rounded-full border border-line px-4 font-sans text-sm text-ink"
          >
            Install
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-5 pt-6 sm:px-8">
        <p className="font-serif text-5xl leading-none text-ink sm:text-7xl">Under construction</p>
        <p className="mt-3 font-sans text-lg text-muted">from 22:00 to 01:00</p>
      </div>

      <main className="mx-auto grid max-w-5xl gap-8 px-5 pt-8 pb-16 sm:px-8 lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-14 lg:pt-10">
        <div className="mx-auto w-full max-w-xs lg:mx-0 lg:max-w-none">
          <div className="book relative bg-ink">
            <img
              src="/plates/cover.jpg"
              alt="Cover of Salt & Second Chances: a lamplighter on a night pier."
              className="h-full w-full object-cover"
            />
            {sealed ? (
              <button type="button" className="wrap-face" onClick={() => setSealed(false)}>
                <span className="seal">New</span>
                <span className="font-serif text-2xl text-balance text-center">A volume just landed</span>
                <span className="font-sans text-sm">Unwrap</span>
              </button>
            ) : null}
          </div>
        </div>

        <div className="flex min-w-0 flex-col">
          <p className="kicker">{book.volume}</p>
          <h1 className="mt-2 font-serif text-4xl leading-tight text-balance text-ink sm:text-5xl">
            {book.title}
          </h1>
          <p className="mt-3 font-serif text-xl text-muted italic">{book.subtitle}</p>
          <p className="mt-5 max-w-xl font-serif text-lg leading-relaxed text-ink">{book.blurb}</p>
          <p className="mt-3 font-sans text-sm text-muted">Original sample · 2 chapters · color insert · plates</p>

          {started ? (
            <p className="mt-6 flex items-center gap-2 font-sans text-sm text-muted">
              <Bookmark className="size-4 text-vermillion" aria-hidden="true" />
              Ribbon in {chapterTitle}
              <span className="rounded-full bg-line px-2 py-0.5 text-xs text-ink">Home-screen badge</span>
            </p>
          ) : null}

          <div className="mt-4 h-1 w-full max-w-xs overflow-hidden rounded-full bg-line" aria-hidden="true">
            <div
              className="h-full bg-vermillion"
              style={{ width: `${Math.max(started ? 4 : 0, Math.round(progress * 100))}%` }}
            />
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              to="/read"
              className="inline-flex h-12 items-center justify-center rounded-full bg-ink px-6 font-sans text-sm font-medium text-paper"
            >
              {started ? "Continue reading" : "Open the book"}
            </Link>
            {started ? (
              <button
                type="button"
                onClick={reset}
                className="inline-flex h-12 items-center justify-center rounded-full px-4 font-sans text-sm text-muted"
              >
                Start over
              </button>
            ) : null}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              className="inline-flex h-11 items-center gap-2 rounded-full border border-line px-4 font-sans text-sm"
              onClick={() => {
                void cacheVolume().then((ok) => {
                  setOffline(ok);
                  setNotice(ok ? "Plates saved for offline." : "This browser blocked the offline save.");
                });
              }}
            >
              <Download className="size-4" />
              {offline ? "Saved offline" : "Keep offline"}
            </button>
            <button
              type="button"
              className="inline-flex h-11 items-center gap-2 rounded-full border border-line px-4 font-sans text-sm"
              onClick={() => fileRef.current?.click()}
            >
              Open a volume file
            </button>
            <button
              type="button"
              className="inline-flex h-11 items-center gap-2 rounded-full border border-line px-4 font-sans text-sm"
              onClick={() => {
                void shareCard(book.blurb).then((result) => {
                  setNotice(result === "shared" ? "Share sheet opened." : "Quote copied.");
                });
              }}
            >
              <Share2 className="size-4" />
              Share
            </button>
            <input
              ref={fileRef}
              type="file"
              accept=".json,.md,application/json,text/markdown,text/plain"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                void onFile(file);
                event.target.value = "";
              }}
            />
          </div>
          {notice ? <p className="mt-3 font-sans text-sm text-muted">{notice}</p> : null}

          {importedTitle ? (
            <div className="mt-6 rounded-2xl border border-line p-4">
              <p className="kicker">Landed from a file</p>
              <p className="mt-2 font-serif text-2xl">{importedTitle}</p>
              <p className="mt-1 font-sans text-sm text-muted">It is in the studio, on the page.</p>
            </div>
          ) : null}

          <ol className="mt-10 divide-y divide-line border-y border-line">
            {chapters.map((chapter) => (
              <li key={chapter.id}>
                <Link
                  to="/read"
                  search={{ chapter: chapter.id }}
                  className="flex min-h-16 items-center justify-between gap-4 py-3"
                >
                  <span>
                    <span className="kicker">{chapter.kicker}</span>
                    <span className="mt-1 block font-serif text-xl text-ink">{chapter.title}</span>
                  </span>
                  <span className="font-sans text-sm text-muted">Read</span>
                </Link>
              </li>
            ))}
          </ol>

          {ownTitle ? (
            <Link to="/read" search={{ own: true }} className="mt-8 block border-t border-line pt-6">
              <p className="kicker">Your volume</p>
              <p className="mt-2 font-serif text-2xl">{ownTitle}</p>
            </Link>
          ) : null}

          <ul className="mt-8 grid gap-4 sm:grid-cols-3">
            <Fact icon={<BookOpen className="size-4" aria-hidden="true" />} title="Pages">
              Bunko pages or a night scroll. Same volume.
            </Fact>
            <Fact icon={<ImageIcon className="size-4" aria-hidden="true" />} title="Plates">
              Color insert first, then plates where the scene needs them.
            </Fact>
            <Fact icon={<Bookmark className="size-4" aria-hidden="true" />} title="Ribbon">
              Your place stays on this device, and can badge the icon.
            </Fact>
          </ul>
        </div>
      </main>

      {installOpen ? (
        <div className="fixed inset-0 z-40 flex items-end justify-center bg-ink/40 p-4 sm:items-center" onClick={() => setInstallOpen(false)}>
          <div className="w-full max-w-md rounded-3xl bg-paper p-6 text-ink" onClick={(event) => event.stopPropagation()}>
            <p className="kicker">Add to your home screen</p>
            <h2 className="mt-2 font-serif text-3xl">LightNov, on its own</h2>
            <p className="mt-3 font-sans text-sm leading-relaxed text-muted">
              Install it and it opens without the browser bar. The icon uses this volume’s cover mood. On iPhone: Share, then Add to Home Screen. On Android: the browser menu, then Install app.
            </p>
            <button type="button" className="mt-6 inline-flex h-12 items-center rounded-full bg-ink px-5 font-sans text-sm text-paper" onClick={() => setInstallOpen(false)}>
              Close
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Fact({
  icon,
  title,
  children,
}: {
  icon: ReactNode;
  title: string;
  children: ReactNode;
}) {
  return (
    <li className="list-none">
      <p className="flex items-center gap-2 font-sans text-sm font-medium text-ink">
        <span className="text-vermillion">{icon}</span>
        {title}
      </p>
      <p className="mt-1 font-sans text-sm leading-relaxed text-muted">{children}</p>
    </li>
  );
}