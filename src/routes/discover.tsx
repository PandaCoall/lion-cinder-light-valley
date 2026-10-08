import { Link, createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { AppNav } from "@/components/nav";
import { filterStories, genres, sampleSpeech, stories, tropes } from "@/data/catalog";
import { speakBlocks, stopSpeech } from "@/lib/book-tools";
import { useOpenBook } from "@/lib/open-book";
import { useReader } from "@/lib/reader-store";

type Search = { q?: string };

export const Route = createFileRoute("/discover")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    q: typeof search.q === "string" ? search.q : undefined,
  }),
  head: () => ({ meta: [{ title: "Discover · LightNov" }] }),
  component: Discover,
});

function Discover() {
  const theme = useReader((state) => state.theme);
  const face = useReader((state) => state.face);
  const saveBook = useReader((state) => state.saveBook);
  const unsaveBook = useReader((state) => state.unsaveBook);
  const skipBook = useReader((state) => state.skipBook);
  const unskipBook = useReader((state) => state.unskipBook);
  const { read } = useOpenBook();
  const { q } = Route.useSearch();
  const [query, setQuery] = useState(q ?? "");
  const [want, setWant] = useState<string[]>([]);
  const [avoid, setAvoid] = useState<string[]>([]);
  const [genre, setGenre] = useState("");
  const [filters, setFilters] = useState(false);
  const [index, setIndex] = useState(0);
  const [dx, setDx] = useState(0);
  const [dy, setDy] = useState(0);
  const [undo, setUndo] = useState<{ kind: "skip" | "save"; id: string } | null>(null);
  const [hearing, setHearing] = useState<"half" | "full" | null>(null);
  const drag = useRef({ x: 0, y: 0, dx: 0, dy: 0, on: false });

  const cards = useMemo(() => filterStories(query, want, avoid, genre), [query, want, avoid, genre]);
  const story = cards.length ? cards[index % cards.length] : undefined;

  useEffect(() => {
    stopSpeech();
    setHearing(null);
  }, [story?.id]);

  const show = (id: string) => {
    const at = cards.findIndex((item) => item.id === id);
    setIndex(at >= 0 ? at : 0);
  };

  const advance = () => setIndex((value) => value + 1);

  const skip = () => {
    if (!story) return;
    skipBook(story.id);
    setUndo({ kind: "skip", id: story.id });
    setDx(0);
    setDy(0);
    advance();
  };

  const save = () => {
    if (!story) return;
    saveBook(story.id);
    setUndo({ kind: "save", id: story.id });
    setDx(0);
    setDy(0);
    advance();
  };

  const listen = (mode: "half" | "full") => {
    if (!story) return;
    if (hearing === mode) {
      stopSpeech();
      setHearing(null);
      return;
    }
    setHearing(mode);
    const text = sampleSpeech(story.id, mode === "half");
    void speakBlocks([{ kind: "p", text }]).then((played) => {
      setHearing((current) => (current === mode && played ? null : current));
    });
  };

  const undoLast = () => {
    if (!undo) return;
    if (undo.kind === "skip") unskipBook(undo.id);
    else unsaveBook(undo.id);
    show(undo.id);
    setUndo(null);
  };

  return (
    <div className="folio flex h-dvh flex-col bg-desk text-ink" data-theme={theme} data-face={face}>
      <header className="flex items-center gap-2 px-4 pt-4">
        <form
          className="flex min-w-0 flex-1 gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            setIndex(0);
          }}
        >
          <input
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setIndex(0);
            }}
            aria-label="Search books"
            placeholder="Search titles, tropes, genres"
            className="h-11 min-w-0 flex-1 rounded-full border border-line bg-paper px-4 font-sans text-sm"
          />
        </form>
        <button type="button" className="h-11 rounded-full border border-line bg-paper px-4 font-sans text-sm" onClick={() => setFilters(true)}>
          Filters
        </button>
      </header>

      <div className="relative min-h-0 flex-1 px-4 py-4">
        {story ? (
          <article
            className="relative h-full touch-none overflow-hidden rounded-3xl bg-ink select-none"
            style={{
              transform: `translate(${dx}px, ${dy}px) rotate(${dx / 28}deg)`,
              transition: drag.current.on ? "none" : "transform 180ms ease",
            }}
            onPointerDown={(event) => {
              if ((event.target as HTMLElement).closest("button")) return;
              drag.current = { x: event.clientX, y: event.clientY, dx: 0, dy: 0, on: true };
              event.currentTarget.setPointerCapture(event.pointerId);
            }}
            onPointerMove={(event) => {
              if (!drag.current.on) return;
              const nextX = event.clientX - drag.current.x;
              const nextY = event.clientY - drag.current.y;
              drag.current.dx = nextX;
              drag.current.dy = nextY;
              setDx(nextX);
              setDy(nextY);
            }}
            onPointerUp={() => {
              if (!drag.current.on) return;
              const movedX = drag.current.dx;
              drag.current.on = false;
              if (movedX > 72) save();
              else if (movedX < -72) skip();
              else {
                setDx(0);
                setDy(0);
              }
            }}
            onPointerCancel={() => {
              drag.current.on = false;
              setDx(0);
              setDy(0);
            }}
          >
            <img src={story.cover} alt="" draggable={false} className="pointer-events-none h-[38%] w-full shrink-0 object-cover" />
            {dx < -36 ? <span className="absolute top-6 left-6 rounded-full bg-paper px-4 py-2 font-sans text-sm text-ink">Skip</span> : null}
            {dx > 36 ? <span className="absolute top-6 right-6 rounded-full bg-paper px-4 py-2 font-sans text-sm text-ink">Save</span> : null}
            <div className="flex min-h-0 flex-1 flex-col px-5 pt-4 pb-4">
              <p className="font-sans text-xs text-paper/70">{story.genre} · {story.rating}</p>
              <h2 className="mt-1 font-serif text-3xl leading-tight">{story.title}</h2>
              <p className="mt-2 line-clamp-4 font-serif text-lg leading-snug text-paper/90">{story.hook} {story.excerpt}</p>
              <div className="mt-auto grid grid-cols-2 gap-2 pt-3" onPointerDown={(event) => event.stopPropagation()}>
                <button type="button" className="h-11 rounded-full border border-paper/50 font-sans text-sm" onClick={() => listen("half")}>
                  {hearing === "half" ? "Stop" : "Half a chapter"}
                </button>
                <button type="button" className="h-11 rounded-full bg-paper font-sans text-sm text-ink" onClick={() => listen("full")}>
                  {hearing === "full" ? "Stop" : "First chapter"}
                </button>
              </div>
            </div>
          </article>
        ) : (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <p className="font-serif text-3xl">Nothing matches.</p>
            <button
              type="button"
              className="mt-4 h-11 rounded-full bg-ink px-4 font-sans text-sm text-paper"
              onClick={() => {
                setQuery("");
                setWant([]);
                setAvoid([]);
                setGenre("");
                setIndex(0);
              }}
            >
              Clear search
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-4 gap-2 px-4 pb-3">
        <button type="button" disabled={!undo} onClick={undoLast} className="h-12 rounded-full border border-line bg-paper font-sans text-sm disabled:opacity-40">
          Undo
        </button>
        <button type="button" disabled={!story} onClick={skip} className="h-12 rounded-full border border-line bg-paper font-sans text-sm">
          Skip
        </button>
        <button type="button" disabled={!story} onClick={() => story && read(story.id)} className="h-12 rounded-full border border-line bg-paper font-sans text-sm">
          Read
        </button>
        <button type="button" disabled={!story} onClick={save} className="h-12 rounded-full bg-ink font-sans text-sm text-paper">
          Save
        </button>
      </div>
      <p className="px-4 pb-2 text-center font-sans text-xs text-muted">Swipe left to skip, right to save. The card is the preview.</p>
      <AppNav />

      {filters ? (
        <div className="fixed inset-0 z-40 flex items-end bg-ink/40" onClick={() => setFilters(false)}>
          <div className="max-h-[80dvh] w-full overflow-y-auto rounded-t-3xl bg-paper p-5" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-center justify-between">
              <p className="font-serif text-2xl">Filters</p>
              <button type="button" className="h-11 font-sans text-sm" onClick={() => setFilters(false)}>Done</button>
            </div>
            <p className="kicker mt-4">Genre</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <button type="button" onClick={() => { setGenre(""); setIndex(0); }} className={`h-10 rounded-full border px-3 font-sans text-sm ${genre === "" ? "border-vermillion" : "border-line"}`}>Any</button>
              {genres.map((item) => (
                <button key={item} type="button" onClick={() => { setGenre(item); setIndex(0); }} className={`h-10 rounded-full border px-3 font-sans text-sm ${genre === item ? "border-vermillion" : "border-line"}`}>{item}</button>
              ))}
            </div>
            <p className="kicker mt-5">Want</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {tropes.map((trope) => (
                <button
                  key={trope}
                  type="button"
                  onClick={() => {
                    setIndex(0);
                    setAvoid(avoid.filter((item) => item !== trope));
                    setWant(want.includes(trope) ? want.filter((item) => item !== trope) : [...want, trope]);
                  }}
                  className={`h-10 rounded-full border px-3 font-sans text-sm ${want.includes(trope) ? "border-vermillion" : "border-line"}`}
                >
                  {trope}
                </button>
              ))}
            </div>
            <p className="kicker mt-5">Not this</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {tropes.map((trope) => (
                <button
                  key={`n-${trope}`}
                  type="button"
                  onClick={() => {
                    setIndex(0);
                    setWant(want.filter((item) => item !== trope));
                    setAvoid(avoid.includes(trope) ? avoid.filter((item) => item !== trope) : [...avoid, trope]);
                  }}
                  className={`h-10 rounded-full border px-3 font-sans text-sm ${avoid.includes(trope) ? "border-vermillion" : "border-line"}`}
                >
                  {trope}
                </button>
              ))}
            </div>
            <Link to="/discover" className="mt-6 inline-flex h-11 items-center font-sans text-sm text-muted">Back to the deck</Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
