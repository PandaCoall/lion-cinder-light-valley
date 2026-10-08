import { Link, createFileRoute } from "@tanstack/react-router";
import { AppNav } from "@/components/nav";
import { findStory, stories } from "@/data/catalog";
import { useOpenBook } from "@/lib/open-book";
import { useReader } from "@/lib/reader-store";

export const Route = createFileRoute("/shelf")({
  head: () => ({ meta: [{ title: "Shelf · LightNov" }] }),
  component: ShelfPage,
});

function ShelfPage() {
  const theme = useReader((state) => state.theme);
  const face = useReader((state) => state.face);
  const savedIds = useReader((state) => state.savedIds);
  const skippedIds = useReader((state) => state.skippedIds);
  const anchor = useReader((state) => state.anchor);
  const chapterTitle = useReader((state) => state.chapterTitle);
  const progress = useReader((state) => state.progress);
  const { read } = useOpenBook();
  const saved = savedIds.map((id) => findStory(id)).filter((story) => story !== undefined);
  const skipped = skippedIds.map((id) => findStory(id)).filter((story) => story !== undefined);

  return (
    <div className="folio flex min-h-dvh flex-col bg-desk text-ink" data-theme={theme} data-face={face}>
      <header className="mx-auto w-full max-w-3xl px-5 pt-6">
        <p className="kicker">Shelf</p>
        <h1 className="mt-1 font-serif text-4xl">Your books</h1>
      </header>
      <main className="mx-auto w-full max-w-3xl flex-1 px-5 py-6">
        <section>
          <h2 className="font-serif text-2xl">Reading</h2>
          {anchor > 0 ? (
            <button type="button" className="mt-3 flex w-full items-center gap-4 rounded-3xl bg-paper p-4 text-left" onClick={() => read("salt")}>
              <img src="/plates/cover.jpg" alt="" className="h-24 w-16 rounded-lg object-cover" />
              <span>
                <span className="block font-serif text-xl">Salt & Second Chances</span>
                <span className="mt-1 block font-sans text-sm text-muted">{chapterTitle}</span>
                <span className="mt-1 block font-sans text-xs text-muted">{Math.round(progress * 100)}% through</span>
              </span>
            </button>
          ) : (
            <p className="mt-2 font-sans text-sm text-muted">Nothing open yet. Discover a book, then come back here.</p>
          )}
        </section>

        <section className="mt-8">
          <h2 className="font-serif text-2xl">Saved</h2>
          {saved.length ? (
            <ul className="mt-3 flex flex-col gap-3">
              {saved.map((story) => (
                <li key={story.id}>
                  <Link to="/book/$bookId" params={{ bookId: story.id }} className="flex items-center gap-4 rounded-3xl bg-paper p-3">
                    <img src={story.cover} alt="" className="h-20 w-14 rounded-lg object-cover" />
                    <span>
                      <span className="block font-serif text-xl">{story.title}</span>
                      <span className="font-sans text-sm text-muted">{story.genre}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 font-sans text-sm text-muted">Save a book from Discover and it lands here.</p>
          )}
        </section>

        <section className="mt-8">
          <h2 className="font-serif text-2xl">Recently skipped</h2>
          {skipped.length ? (
            <ul className="mt-3 flex flex-col gap-3">
              {skipped.map((story) => (
                <li key={story.id}>
                  <Link to="/book/$bookId" params={{ bookId: story.id }} className="flex items-center gap-4 rounded-3xl border border-line p-3">
                    <img src={story.cover} alt="" className="h-16 w-12 rounded-lg object-cover" />
                    <span className="font-serif text-lg">{story.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 font-sans text-sm text-muted">Skipped books stay here, so a swipe is not a deletion.</p>
          )}
        </section>
        <p className="mt-8 font-sans text-xs text-muted">{stories.length} books in the catalog.</p>
      </main>
      <AppNav />
    </div>
  );
}
