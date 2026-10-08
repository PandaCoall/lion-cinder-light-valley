import { Link, createFileRoute } from "@tanstack/react-router";
import { AppNav } from "@/components/nav";
import { findStory } from "@/data/catalog";
import { chapters } from "@/data/volume";
import { useOpenBook } from "@/lib/open-book";
import { useReader } from "@/lib/reader-store";

export const Route = createFileRoute("/book/$bookId")({
  head: ({ params }) => ({ meta: [{ title: `${findStory(params.bookId)?.title ?? "Book"} · LightNov` }] }),
  component: BookPreview,
});

function BookPreview() {
  const { bookId } = Route.useParams();
  const story = findStory(bookId);
  const theme = useReader((state) => state.theme);
  const face = useReader((state) => state.face);
  const savedIds = useReader((state) => state.savedIds);
  const saveBook = useReader((state) => state.saveBook);
  const unsaveBook = useReader((state) => state.unsaveBook);
  const { read, allowed, opened, limit, signedIn } = useOpenBook();
  const saved = story ? savedIds.includes(story.id) : false;

  return (
    <div className="folio flex min-h-dvh flex-col bg-desk text-ink" data-theme={theme} data-face={face}>
      <header className="flex items-center justify-between px-5 pt-5">
        <Link to="/discover" className="inline-flex h-11 items-center rounded-full border border-line bg-paper px-4 font-sans text-sm">Back</Link>
        <p className="kicker">Preview</p>
      </header>
      <main className="mx-auto w-full max-w-xl flex-1 px-5 py-6">
        {story ? (
          <>
            <img src={story.cover} alt="" className="mx-auto h-72 w-48 rounded-2xl object-cover" />
            <p className="mt-5 font-sans text-sm text-muted">{story.genre} · {story.rating}</p>
            <h1 className="mt-1 font-serif text-4xl">{story.title}</h1>
            <p className="mt-3 font-serif text-xl">{story.hook}</p>
            <p className="mt-4 flex flex-wrap gap-2">
              {story.tropes.map((trope) => (
                <span key={trope} className="rounded-full border border-line px-3 py-1 font-sans text-xs">{trope}</span>
              ))}
            </p>
            <p className="mt-5 font-serif text-lg leading-relaxed">{story.excerpt}</p>
            {story.id === "salt" ? (
              <ol className="mt-6 divide-y divide-line border-y border-line">
                {chapters.map((chapter) => (
                  <li key={chapter.id}>
                    <button type="button" className="flex min-h-14 w-full items-center justify-between text-left" onClick={() => read("salt", chapter.id)}>
                      <span>
                        <span className="kicker">{chapter.kicker}</span>
                        <span className="mt-1 block font-serif text-lg">{chapter.title}</span>
                      </span>
                      <span className="font-sans text-sm text-muted">Read</span>
                    </button>
                  </li>
                ))}
              </ol>
            ) : null}
            <div className="mt-6 flex flex-wrap gap-2">
              <button type="button" className="h-12 rounded-full bg-ink px-5 font-sans text-sm text-paper" onClick={() => read(story.id)}>
                {allowed(story.id) ? "Read" : "Sign in to read more"}
              </button>
              <button
                type="button"
                className="h-12 rounded-full border border-line bg-paper px-5 font-sans text-sm"
                onClick={() => (saved ? unsaveBook(story.id) : saveBook(story.id))}
              >
                {saved ? "Saved" : "Save"}
              </button>
            </div>
            {!signedIn ? (
              <p className="mt-4 font-sans text-sm text-muted">
                Guest reading: {Math.min(opened, limit)} of {limit} books opened.
              </p>
            ) : null}
          </>
        ) : (
          <p className="font-serif text-3xl">That book is not on the shelf.</p>
        )}
      </main>
      <AppNav />
    </div>
  );
}
