import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { BookOpen, ChevronLeft, X } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { stories, tropes } from "@/data/catalog";
import { speakBlocks, stopSpeech } from "@/lib/book-tools";
import { useReader } from "@/lib/reader-store";

export const Route = createFileRoute("/discover")({
  head: () => ({ meta: [{ title: "Discover · LightNov" }] }),
  component: Discover,
});

function Discover() {
  const theme = useReader((state) => state.theme);
  const face = useReader((state) => state.face);
  const navigate = useNavigate();
  const [want, setWant] = useState<string[]>([]);
  const [skip, setSkip] = useState<string[]>([]);
  const [index, setIndex] = useState(0);
  const [filters, setFilters] = useState(false);
  const [dx, setDx] = useState(0);
  const drag = useRef({ x: 0, on: false });

  const cards = useMemo(
    () =>
      stories.filter(
        (story) =>
          want.every((trope) => story.tropes.includes(trope)) &&
          skip.every((trope) => !story.tropes.includes(trope)),
      ),
    [want, skip],
  );

  const story = cards.length ? cards[index % cards.length] : undefined;
  const behind = cards.length > 1 ? cards[(index + 1) % cards.length] : undefined;

  const toggle = (list: string[], trope: string, set: (next: string[]) => void, other: string[], setOther: (next: string[]) => void) => {
    setIndex(0);
    setOther(other.filter((item) => item !== trope));
    set(list.includes(trope) ? list.filter((item) => item !== trope) : [...list, trope]);
  };

  const open = (id: string) => {
    if (id === "salt") {
      void navigate({ to: "/read" });
      return;
    }
    void navigate({ to: "/read", search: { preview: id } });
  };

  const pass = () => {
    setDx(0);
    if (cards.length < 2) return;
    setIndex((value) => (value + 1) % cards.length);
  };

  const back = () => {
    setDx(0);
    if (cards.length < 2) return;
    setIndex((value) => (value - 1 + cards.length) % cards.length);
  };

  return (
    <div className="folio relative h-dvh overflow-hidden bg-ink text-paper" data-theme={theme} data-face={face} data-size="md">
      {behind ? (
        <img src={behind.cover} alt="" className="absolute inset-4 top-8 h-[calc(100%-5rem)] w-[calc(100%-2rem)] scale-95 rounded-3xl object-cover opacity-70" />
      ) : null}

      {story ? (
        <article
          className="absolute inset-3 top-4 bottom-24 overflow-hidden rounded-3xl"
          style={{
            transform: `translateX(${dx}px) rotate(${dx / 28}deg)`,
            transition: drag.current.on ? "none" : "transform 180ms ease",
          }}
          onPointerDown={(event) => {
            drag.current = { x: event.clientX, on: true };
            event.currentTarget.setPointerCapture(event.pointerId);
          }}
          onPointerMove={(event) => {
            if (!drag.current.on) return;
            setDx(event.clientX - drag.current.x);
          }}
          onPointerUp={() => {
            const moved = dx;
            drag.current.on = false;
            if (moved > 90) open(story.id);
            else if (moved < -90) pass();
            else setDx(0);
          }}
        >
          <img src={story.cover} alt="" className="h-full w-full object-cover" />
          {dx < -36 ? (
            <span className="absolute top-16 left-6 rounded-full border border-paper px-4 py-2 font-sans text-sm">Not now</span>
          ) : null}
          {dx > 36 ? (
            <span className="absolute top-16 right-6 rounded-full border border-paper px-4 py-2 font-sans text-sm">Open</span>
          ) : null}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink via-ink/75 to-transparent px-5 pt-24 pb-6">
            <div className="flex items-baseline justify-between gap-3">
              <h2 className="font-serif text-3xl text-paper">{story.title}</h2>
              <span className="font-sans text-sm text-paper/80">{story.rating}</span>
            </div>
            <p className="mt-2 font-serif text-lg text-paper">{story.hook}</p>
            <p className="mt-3 flex flex-wrap gap-2">
              {story.tropes.map((trope) => (
                <span key={trope} className="rounded-full border border-paper/40 px-2 py-1 font-sans text-xs text-paper">
                  {trope}
                </span>
              ))}
            </p>
          </div>
        </article>
      ) : (
        <div className="flex h-full flex-col items-center justify-center px-8 text-center">
          <p className="font-serif text-3xl">Nothing matches that.</p>
          <button type="button" className="mt-6 h-12 rounded-full bg-paper px-5 font-sans text-sm text-ink" onClick={() => { setWant([]); setSkip([]); setIndex(0); }}>
            Clear the filters
          </button>
        </div>
      )}

      <div className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-4 pt-4">
        <Link to="/" className="inline-flex h-11 items-center gap-1 rounded-full bg-paper px-4 font-sans text-sm text-ink">
          <ChevronLeft className="size-4" />
          Back
        </Link>
        <button type="button" className="h-11 rounded-full bg-paper px-4 font-sans text-sm text-ink" onClick={() => setFilters(true)}>
          Filter
        </button>
      </div>

      {story ? (
        <div className="absolute inset-x-0 bottom-5 z-20 flex items-center justify-center gap-6">
          <button type="button" aria-label="Previous book" onClick={back} className="inline-flex size-12 items-center justify-center rounded-full border border-paper/50 text-paper">
            <ChevronLeft className="size-6" />
          </button>
          <button type="button" aria-label="Not now" onClick={pass} className="inline-flex size-16 items-center justify-center rounded-full bg-paper text-ink">
            <X className="size-7" />
          </button>
          <button
            type="button"
            className="h-12 rounded-full border border-paper/50 px-4 font-sans text-sm text-paper"
            onClick={() => void speakBlocks([{ kind: "p", text: story.audio }])}
          >
            Hear
          </button>
          <button type="button" aria-label="Stop" className="font-sans text-sm text-paper/70" onClick={() => stopSpeech()}>
            Stop
          </button>
          <button type="button" aria-label="Open" onClick={() => open(story.id)} className="inline-flex size-16 items-center justify-center rounded-full bg-paper text-ink">
            <BookOpen className="size-7" />
          </button>
        </div>
      ) : null}

      {filters ? (
        <div className="absolute inset-0 z-30 flex items-end bg-ink/50" onClick={() => setFilters(false)}>
          <div className="max-h-[80dvh] w-full overflow-y-auto rounded-t-3xl bg-paper p-5 text-ink" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-center justify-between">
              <p className="kicker">Want</p>
              <button type="button" className="font-sans text-sm text-muted" onClick={() => setFilters(false)}>Done</button>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {tropes.map((trope) => (
                <button
                  key={`w-${trope}`}
                  type="button"
                  onClick={() => toggle(want, trope, setWant, skip, setSkip)}
                  className={`h-10 rounded-full border px-3 font-sans text-sm ${want.includes(trope) ? "border-vermillion" : "border-line text-muted"}`}
                >
                  {trope}
                </button>
              ))}
            </div>
            <p className="kicker mt-6">Not this</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {tropes.map((trope) => (
                <button
                  key={`s-${trope}`}
                  type="button"
                  onClick={() => toggle(skip, trope, setSkip, want, setWant)}
                  className={`h-10 rounded-full border px-3 font-sans text-sm ${skip.includes(trope) ? "border-ink" : "border-line text-muted"}`}
                >
                  {trope}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
