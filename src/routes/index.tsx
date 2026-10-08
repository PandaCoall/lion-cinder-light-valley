import { Link, createFileRoute } from "@tanstack/react-router";
import { AppNav } from "@/components/nav";
import { stories } from "@/data/catalog";
import { book } from "@/data/volume";
import { useReader } from "@/lib/reader-store";
import { useOpenBook } from "@/lib/open-book";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const theme = useReader((state) => state.theme);
  const face = useReader((state) => state.face);
  const anchor = useReader((state) => state.anchor);
  const chapterTitle = useReader((state) => state.chapterTitle);
  const progress = useReader((state) => state.progress);
  const savedIds = useReader((state) => state.savedIds);
  const { read } = useOpenBook();
  const reading = anchor > 0;
  const saved = stories.filter((story) => savedIds.includes(story.id));

  return (
    <div className="folio flex min-h-dvh flex-col bg-desk text-ink" data-theme={theme} data-face={face}>
      <header className="mx-auto w-full max-w-3xl px-5 pt-6 sm:px-8">
        <p className="kicker" style={{ textTransform: "none" }}>LightNov</p>
        <h1 className="mt-2 font-serif text-4xl">What will you read?</h1>
      </header>
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-5 py-6 sm:px-8">
        <Link to="/discover" className="rounded-3xl bg-ink p-6 text-paper">
          <p className="font-sans text-sm text-paper/70">Start here</p>
          <p className="mt-2 font-serif text-3xl">Discover</p>
          <p className="mt-2 font-sans text-sm text-paper/80">Swipe through a cover, a summary, and a listen button.</p>
        </Link>

        <section className="rounded-3xl bg-paper p-5">
          <p className="kicker">{reading ? "Continue" : "On the desk"}</p>
          <div className="mt-4 flex gap-4">
            <img src="/plates/cover.jpg" alt="" className="h-36 w-24 rounded-xl object-cover" />
            <div className="min-w-0">
              <h2 className="font-serif text-2xl">{book.title}</h2>
              <p className="mt-1 font-sans text-sm text-muted">{reading ? chapterTitle : book.subtitle}</p>
              {reading ? (
                <p className="mt-2 font-sans text-xs text-muted">{Math.round(progress * 100)}% through</p>
              ) : null}
              <button type="button" className="mt-4 h-11 rounded-full bg-ink px-4 font-sans text-sm text-paper" onClick={() => read("salt")}>
                {reading ? "Continue reading" : "Open the book"}
              </button>
            </div>
          </div>
        </section>

        <form action="/discover" className="flex gap-2">
          <input name="q" aria-label="Search books" placeholder="Search titles, tropes, genres" className="h-12 min-w-0 flex-1 rounded-full border border-line bg-paper px-4 font-sans text-sm" />
          <button type="submit" className="h-12 rounded-full bg-ink px-4 font-sans text-sm text-paper">Search</button>
        </form>

        {saved.length ? (
          <section>
            <h2 className="font-serif text-2xl">Saved</h2>
            <ul className="mt-3 flex gap-3 overflow-x-auto">
              {saved.map((story) => (
                <li key={story.id} className="w-28 shrink-0">
                  <Link to="/book/$bookId" params={{ bookId: story.id }}>
                    <img src={story.cover} alt="" className="h-40 w-28 rounded-xl object-cover" />
                    <p className="mt-2 font-serif text-sm">{story.title}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </main>
      <AppNav />
    </div>
  );
}
