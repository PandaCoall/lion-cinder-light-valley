import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ChevronLeft, ChevronRight, List, Settings, X } from "lucide-react";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { blocks as printed, book, cast, chapters, codex, glossary, type Block } from "@/data/volume";
import { previews, recapBank } from "@/data/catalog";
import { downloadEpub, minutesToNextPlate, nearestPlate, pageText, plateCount, setSpeechRate, speakBlocks, stopSpeech, wordCount } from "@/lib/book-tools";
import { SOLO_KINDS, packPages, pageForAnchor } from "@/lib/paginate";
import { useReader, type FaceName, type ReadMode, type ThemeName, type TypeSize } from "@/lib/reader-store";

type Panel = "contents" | "settings" | "codex" | "marks" | "recap" | "chapter" | null;

const RANK: Record<string, number> = { start: 0, pier: 1, letter: 2 };

export function Reader({ chapter, plate, own, preview }: { chapter?: string; plate?: string; own?: boolean; preview?: string }) {
  const theme = useReader((state) => state.theme);
  const size = useReader((state) => state.size);
  const anchor = useReader((state) => state.anchor);
  const setTheme = useReader((state) => state.setTheme);
  const setSize = useReader((state) => state.setSize);
  const setAnchor = useReader((state) => state.setAnchor);
  const mode = useReader((state) => state.mode);
  const face = useReader((state) => state.face);
  const setMode = useReader((state) => state.setMode);
  const setFace = useReader((state) => state.setFace);
  const dogears = useReader((state) => state.dogears);
  const toggleDogear = useReader((state) => state.toggleDogear);
  const savedPlates = useReader((state) => state.savedPlates);
  const togglePlate = useReader((state) => state.togglePlate);
  const addNote = useReader((state) => state.addNote);
  const notes = useReader((state) => state.notes);
  const bookmark = useReader((state) => state.bookmark);
  const setBookmark = useReader((state) => state.setBookmark);
  const finished = useReader((state) => state.finished);
  const setFinished = useReader((state) => state.setFinished);
  const setPassedLine = useReader((state) => state.setPassedLine);
  const ownBlocks = useReader((state) => state.ownBlocks);
  const ownTitle = useReader((state) => state.ownTitle);
  const quiet = useReader((state) => state.quiet);
  const setQuiet = useReader((state) => state.setQuiet);
  const rate = useReader((state) => state.rate);
  const setRate = useReader((state) => state.setRate);
  const pay = useReader((state) => state.pay);
  const bumpListens = useReader((state) => state.bumpListens);
  const comments = useReader((state) => state.comments);
  const addComment = useReader((state) => state.addComment);
  const shown = preview ? previews[preview] : undefined;
  const blocks = shown ? shown.blocks : own && ownBlocks.length ? ownBlocks : printed;
  const volumeTitle = shown ? shown.title : own && ownTitle ? ownTitle : book.title;
  const [gloss, setGloss] = useState<string | null>(null);
  const [litPlate, setLitPlate] = useState<Extract<Block, { kind: "plate" }> | null>(null);
  const [glow, setGlow] = useState<string | null>(null);
  const [insertOpen, setInsertOpen] = useState(false);
  const [insertAt, setInsertAt] = useState(0);
  const [spread, setSpread] = useState(false);
  const [noteLine, setNoteLine] = useState("");
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [noteDraft, setNoteDraft] = useState("");
  const [exporting, setExporting] = useState(false);
  const [markFlash, setMarkFlash] = useState(false);
  const [hearing, setHearing] = useState(false);
  const navigate = useNavigate();

  const bodyRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const blocksRef = useRef(blocks);
  blocksRef.current = blocks;
  const [pages, setPages] = useState<number[][]>([]);
  const [panel, setPanel] = useState<Panel>(null);
  const [chrome, setChrome] = useState(true);
  const [turn, setTurn] = useState<"next" | "prev" | null>(null);
  const drag = useRef<{ x: number; y: number } | null>(null);
  const lastTap = useRef(0);
  const pendingTurn = useRef<number | null>(null);
  const justToggled = useRef(0);
  const suppressClick = useRef(false);
  const sought = useRef(false);

  const measure = useCallback(() => {
    const body = bodyRef.current;
    const column = measureRef.current;
    if (!body || !column) return;
    const style = getComputedStyle(body);
    const padX = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
    const padY = parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);
    const width = body.clientWidth - padX;
    const limit = body.clientHeight - padY;
    if (width < 40 || limit < 80) return;
    column.style.width = `${width}px`;
    const nodes = [...column.querySelectorAll<HTMLElement>("[data-measure]")];
    const heights = nodes.map((node) => node.offsetHeight);
    const kinds = blocksRef.current.map((block) => block.kind);
    const next = packPages(heights, kinds, limit);
    setPages((prev) => (samePages(prev, next) ? prev : next));
  }, []);

  useEffect(() => {
    const onDouble = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target?.closest(".folio")) return;
      if (target.closest("a, .ribbon, aside, input, textarea, header, .ghost-turn")) return;
      if (performance.now() - justToggled.current < 500) return;
      if (pendingTurn.current) {
        window.clearTimeout(pendingTurn.current);
        pendingTurn.current = null;
      }
      setChrome((value) => !value);
    };
    document.addEventListener("dblclick", onDouble, true);
    return () => document.removeEventListener("dblclick", onDouble, true);
  }, []);

  useLayoutEffect(() => {
    measure();
  }, [measure, theme, size, own, ownBlocks, spread, chrome, preview]);

  useEffect(() => {
    const media = window.matchMedia("(orientation: landscape) and (min-width: 960px)");
    const apply = () => setSpread(media.matches);
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    const body = bodyRef.current;
    if (!body) return;
    const observer = new ResizeObserver(() => measure());
    observer.observe(body);
    const fonts = document.fonts;
    if (fonts?.ready) void fonts.ready.then(() => measure());
    return () => observer.disconnect();
  }, [measure]);

  useEffect(() => {
    if (sought.current) return;
    if (!chapter && !plate) return;
    const index = plate
      ? blocks.findIndex((block) => block.kind === "plate" && block.id === plate)
      : blocks.findIndex((block) => block.kind === "chapter" && block.id === chapter);
    sought.current = true;
    if (index >= 0) {
      const title = blocks[index];
      const label =
        title?.kind === "chapter" ? title.title : title?.kind === "plate" ? title.caption : book.title;
      setAnchor(index, label, index / (blocks.length - 1));
    }
    void navigate({ to: "/read", search: {}, replace: true });
  }, [chapter, plate, navigate, setAnchor]);

  const insertPlates = blocks.filter((block): block is Extract<Block, { kind: "plate" }> => block.kind === "plate" && block.insert === true);
  const hasAfterword = blocks.some((block) => block.kind === "afterword");
  const view = pages.filter((group) => {
    const hiddenInsert = group.every((index) => {
      const block = blocks[index];
      return block?.kind === "insert" || (block?.kind === "plate" && block.insert);
    });
    if (hiddenInsert) return false;
    if (!finished && hasAfterword && group.some((index) => {
      const block = blocks[index];
      return block?.kind === "afterword" || block?.kind === "cast" || block?.kind === "colophon" || block?.kind === "end" || (block?.kind === "plate" && block.id === "omake");
    })) return false;
    return true;
  });
  const links = blocks.flatMap((block) => (block.kind === "plate" && block.bind ? [{ id: block.id, phrase: block.bind }] : []));
  const faces = [
    { name: "Lioren", src: "/plates/portrait.jpg", plate: "portrait" },
    { name: "Maris", src: "/plates/keeper.jpg", plate: "keeper" },
  ].filter((face) => {
    const first = blocks.findIndex((block) => block.kind === "p" && block.text.includes(face.name));
    if (first < 0 || anchor < first) return false;
    return (view[pageForAnchor(view, anchor)] ?? []).some((index) => {
      const block = blocks[index];
      return block?.kind === "p" && block.text.includes(face.name);
    });
  });

  const page = pageForAnchor(view, anchor);
  const pageBlocks = (view[page] ?? []).map((index) => blocks[index]).filter(Boolean);
  const mateBlocks = spread ? (view[page + 1] ?? []).map((index) => blocks[index]).filter(Boolean) : [];
  const pageMarked = bookmark !== null && (view[page] ?? []).includes(bookmark);

  useEffect(() => {
    if (!pages.length) return;
    const currentAnchor = useReader.getState().anchor;
    const current = pageForAnchor(view, currentAnchor);
    let title = book.title;
    for (const group of view.slice(0, current + 1)) {
      for (const index of group) {
        const block = blocks[index];
        if (block?.kind === "chapter") title = block.title;
      }
    }
    setAnchor(currentAnchor, title, currentAnchor / (blocks.length - 1));
  }, [view, setAnchor]);

  const go = useCallback(
    (direction: 1 | -1) => {
      const current = pageForAnchor(view, useReader.getState().anchor);
      const atEnd = direction === 1 && current >= view.length - 1;
      if (atEnd && !finished && hasAfterword) {
        const index = blocks.findIndex((block) => block.kind === "afterword");
        if (index >= 0) {
          setFinished(true);
          setGlow(null);
          setTurn("next");
          setAnchor(index, "Afterword", index / (blocks.length - 1));
        }
        return;
      }
      const stride = spread && view[current + direction * 2] ? 2 : 1;
      const target = view[current + direction * stride];
      const nextAnchor = target?.[0];
      if (nextAnchor === undefined) return;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!reduce && navigator.vibrate) navigator.vibrate(10);
      setTurn(direction === 1 ? "next" : "prev");
      setGlow(null);
      let title = book.title;
      for (const group of view.slice(0, current + direction * stride + 1)) {
        for (const index of group) {
          const block = blocks[index];
          if (block?.kind === "chapter") title = block.title;
        }
      }
      setAnchor(nextAnchor, title, nextAnchor / (blocks.length - 1));
    },
    [view, setAnchor, spread, finished, hasAfterword, blocks, setFinished],
  );

  const followPlate = (item: Extract<Block, { kind: "plate" }>) => {
    if (item.bind) {
      const index = blocks.findIndex((block) => block.kind === "p" && block.text.includes(item.bind ?? ""));
      if (index >= 0) {
        setGlow(item.bind);
        setLitPlate(null);
        setAnchor(index, book.title, index / (blocks.length - 1));
        return;
      }
    }
    setLitPlate(item);
  };

  const openLink = (id: string) => {
    const item = blocks.find((block) => block.kind === "plate" && block.id === id);
    if (item?.kind === "plate") setLitPlate(item);
  };

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight" || event.key === "PageDown") {
        event.preventDefault();
        go(1);
      } else if (event.key === "ArrowLeft" || event.key === "PageUp") {
        event.preventDefault();
        go(-1);
      } else if (event.key === "Escape") {
        event.preventDefault();
        if (panel) setPanel(null);
        else setChrome(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, panel]);

  const jumpKind = (kind: Block["kind"]) => {
    const index = blocks.findIndex((block) => block.kind === kind);
    if (index < 0) return;
    setAnchor(index, book.title, index / (blocks.length - 1));
    setPanel(null);
  };

  const quoteLine = pageText(pageBlocks).slice(0, 180);
  const quotePlate = nearestPlate(anchor);

  const jumpTo = (id: string) => {
    const index = blocks.findIndex((block) => block.kind === "chapter" && block.id === id);
    if (index < 0) return;
    const title = blocks[index];
    setTurn("next");
    setAnchor(
      index,
      title && title.kind === "chapter" ? title.title : book.title,
      index / (blocks.length - 1),
    );
    setPanel(null);
  };

  const chapterLabel = (() => {
    let title = book.volume;
    for (const group of pages.slice(0, page + 1)) {
      for (const index of group) {
        const block = blocks[index];
        if (block?.kind === "chapter") title = block.title;
      }
    }
    return title;
  })();

  return (
    <div
      className="folio relative h-dvh overflow-hidden bg-desk text-ink"
      data-theme={theme}
      data-size={size}
      data-face={face}
      data-mode={mode}
      data-immersive={chrome ? "false" : "true"}
      onPointerUp={(event) => {
        const target = event.target as HTMLElement;
        if (target.closest("a, .ribbon, aside, input, textarea, .ghost-turn, header")) return;
        const now = performance.now();
        if (now - lastTap.current < 800) {
          lastTap.current = 0;
          suppressClick.current = true;
          justToggled.current = performance.now();
          if (pendingTurn.current) {
            window.clearTimeout(pendingTurn.current);
            pendingTurn.current = null;
          }
          setChrome((value) => !value);
          return;
        }
        lastTap.current = now;
      }}
    >
      <header
        className={`absolute inset-x-0 top-0 z-30 flex h-14 items-center gap-2 px-3 transition-opacity sm:px-5 ${
          chrome ? "opacity-100" : "hidden"
        }`}
      >
        <Link
          to="/"
          className="inline-flex h-11 shrink-0 items-center gap-1.5 rounded-full border border-line bg-paper px-3 font-sans text-sm text-ink"
        >
          <ArrowLeft className="size-4" />
          Back
        </Link>
        <div className="min-w-0 flex-1">
          <p className="truncate font-sans text-sm font-medium text-ink">{volumeTitle}</p>
          <p className="truncate font-sans text-xs text-muted">{chapterLabel}{pay !== "free" && reachedFrom(anchor) >= 2 ? " · marked paid, still open" : ""}</p>
        </div>
        <button
          type="button"
          onClick={() => {
            justToggled.current = performance.now();
            setChrome(false);
          }}
          className="inline-flex h-11 items-center rounded-full bg-ink px-4 font-sans text-sm text-paper"
        >
          Read
        </button>
        <button
          type="button"
          aria-label="Contents"
          onClick={() => setPanel(panel === "contents" ? null : "contents")}
          className="inline-flex size-11 items-center justify-center rounded-full text-ink"
        >
          <List className="size-5" />
        </button>
        <button
          type="button"
          aria-label="Reading settings"
          onClick={() => setPanel(panel === "settings" ? null : "settings")}
          className="inline-flex size-11 items-center justify-center rounded-full text-ink"
        >
          <Settings className="size-5" />
        </button>
      </header>

      <main className={chrome ? "flex h-full items-stretch justify-center px-3 pt-16 pb-20 sm:px-8" : "fixed inset-0 z-10"}>
        <article className={`sheet relative flex h-full w-full flex-col overflow-hidden bg-paper ${chrome ? "max-w-xl" : "max-w-none"}`}>
          <button
            type="button"
            className="ribbon"
            data-set={pageMarked ? "true" : "false"}
            aria-pressed={pageMarked}
            aria-label={pageMarked ? "Bookmark saved on this page" : "Bookmark this page"}
            onClick={() => {
              const here = view[page]?.[0] ?? anchor;
              setBookmark(here);
              setMarkFlash(true);
              window.setTimeout(() => setMarkFlash(false), 900);
            }}
          />
          {markFlash ? (
            <p className="pointer-events-none absolute top-12 right-6 z-30 font-sans text-xs text-vermillion">Marked</p>
          ) : null}
          {!chrome ? (
            <div className="relative z-20 flex h-12 shrink-0 items-center gap-4 px-5">
              <Link
                to="/"
                className="inline-flex h-9 items-center gap-1.5 rounded-full border border-line bg-paper px-3 font-sans text-sm text-ink"
              >
                <ArrowLeft className="size-4" />
                Back
              </Link>
              {insertPlates.length ? (
                <button type="button" className="font-sans text-sm text-muted" onClick={() => setInsertOpen(true)}>
                  Insert
                </button>
              ) : null}
            </div>
          ) : null}
          <div className={`flex min-h-0 flex-1 ${spread && !chrome ? "gap-0" : ""}`}>
          <div ref={bodyRef} className={`relative min-h-0 flex-1 px-6 sm:px-10 ${chrome ? "pt-8" : "pt-1"} ${mode === "scroll" ? "overflow-auto" : "overflow-hidden"}`}>
            {mode === "scroll" ? (
              <div className="pb-8">
                {blocks.map((block, index) => (
                  <LiveBlock key={index} block={block} reached={reachedFrom(anchor)} onTerm={setGloss} onPlate={setLitPlate} />
                ))}
              </div>
            ) : (
            <div
              key={`${page}-${turn ?? "stay"}`}
              className={`h-full ${turn === "prev" ? "page-turn-prev" : turn ? "page-turn-next" : ""}`}
              onPointerDown={(event) => {
                drag.current = { x: event.clientX, y: event.clientY };
              }}
              onPointerUp={(event) => {
                if (!drag.current) return;
                const dx = event.clientX - drag.current.x;
                const dy = event.clientY - drag.current.y;
                drag.current = null;
                if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy)) {
                  suppressClick.current = true;
                  go(dx < 0 ? 1 : -1);
                }
              }}
              onClick={() => {
                suppressClick.current = false;
              }}
            >
              <PageBody blocks={pageBlocks} reached={reachedFrom(anchor)} onTerm={setGloss} onPlate={followPlate} links={links} glow={glow} onLink={openLink} />
            </div>
            )}
            {faces.map((face) => (
              <button
                key={face.name}
                type="button"
                className="absolute top-24 left-1 z-20 h-28 w-7 overflow-hidden"
                aria-label={face.name}
                onClick={() => {
                  const item = blocks.find((block) => block.kind === "plate" && block.id === face.plate);
                  if (item?.kind === "plate") setLitPlate(item);
                }}
              >
                <img src={face.src} alt="" className="h-full w-full object-cover object-[center_18%]" />
              </button>
            ))}
          </div>
          {spread && !chrome && mateBlocks.length ? (
            <div className="min-h-0 flex-1 overflow-hidden border-l border-line px-6 pt-1 sm:px-10">
              <PageBody blocks={mateBlocks} reached={reachedFrom(anchor)} onTerm={setGloss} onPlate={followPlate} links={links} glow={glow} onLink={openLink} />
            </div>
          ) : null}
          </div>
          <footer className={`flex items-center justify-center gap-3 px-6 pt-2 pb-4 font-sans text-xs text-muted tabular-nums ${chrome ? "" : "hidden"}`}>
            <span className="h-px w-6 bg-line" aria-hidden="true" />
            {pages.length ? page + 1 : 1}
            <span aria-hidden="true">/</span>
            {Math.max(view.length, 1)}
            <span className="h-px w-6 bg-line" aria-hidden="true" />
          </footer>
          <button
            type="button"
            tabIndex={-1}
            aria-label="Previous page"
            onClick={() => {
              if (suppressClick.current) {
                suppressClick.current = false;
                return;
              }
              if (pendingTurn.current) window.clearTimeout(pendingTurn.current);
              pendingTurn.current = window.setTimeout(() => {
                pendingTurn.current = null;
                go(-1);
              }, 280);
            }}
            className="absolute inset-y-0 left-0 z-10 w-[18%] disabled:hidden"
            disabled={page <= 0}
          />
          <button
            type="button"
            tabIndex={-1}
            aria-label="Next page"
            onClick={() => {
              if (suppressClick.current) {
                suppressClick.current = false;
                return;
              }
              if (pendingTurn.current) window.clearTimeout(pendingTurn.current);
              pendingTurn.current = window.setTimeout(() => {
                pendingTurn.current = null;
                go(1);
              }, 280);
            }}
            className="absolute inset-y-0 right-0 z-10 w-[18%]"
            disabled={view.length > 0 && page >= view.length - 1}
          />
          {!chrome ? (
            <div className="relative z-20 flex h-12 shrink-0 items-center justify-between px-5">
              <button
                type="button"
                onClick={() => go(-1)}
                disabled={page <= 0}
                className="font-sans text-sm text-ink opacity-25 disabled:opacity-10"
              >
                Prev
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                disabled={view.length > 0 && page >= view.length - 1}
                className="font-sans text-sm text-ink opacity-25 disabled:opacity-10"
              >
                Next
              </button>
            </div>
          ) : null}
          <div ref={measureRef} className="pointer-events-none absolute top-0 left-0 -z-10 opacity-0" aria-hidden="true">
            {blocks.map((block, index) => (
              <MeasureBlock key={index} block={block} />
            ))}
          </div>
        </article>
      </main>

      <footer
        className={`absolute inset-x-0 bottom-0 z-30 flex h-16 items-center justify-between gap-3 px-3 sm:px-6 ${
          chrome ? "" : "hidden"
        }`}
      >
        <button
          type="button"
          onClick={() => go(-1)}
          disabled={page <= 0}
          className="inline-flex h-11 items-center gap-1 rounded-full px-3 font-sans text-sm text-ink disabled:opacity-30"
        >
          <ChevronLeft className="size-4" />
          Prev
        </button>
        <p className="font-sans text-xs text-muted">
          {minutesToNextPlate(anchor)} min to the next plate
        </p>
        <button
          type="button"
          onClick={() => go(1)}
          disabled={view.length > 0 && page >= view.length - 1}
          className="inline-flex h-11 items-center gap-1 rounded-full px-3 font-sans text-sm text-ink disabled:opacity-30"
        >
          Next
          <ChevronRight className="size-4" />
        </button>
      </footer>

      {panel ? (
        <div className="absolute inset-0 z-40 bg-ink/30" onClick={() => setPanel(null)}>
          <aside
            className="absolute inset-y-0 right-0 flex w-full max-w-sm flex-col bg-paper text-ink shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex h-14 items-center justify-between px-5">
              <p className="font-sans text-sm font-medium">
                {panel === "contents" ? "Contents" : panel === "codex" ? "Codex" : panel === "marks" ? "Marks" : panel === "recap" ? "Recap" : panel === "chapter" ? "Chapter" : "The page"}
              </p>
              <button type="button" aria-label="Close" onClick={() => setPanel(null)} className="inline-flex size-11 items-center justify-center">
                <X className="size-5" />
              </button>
            </div>
            {panel === "contents" ? (
              <ol className="flex-1 overflow-auto px-5 pb-8">
                <li>
                  <button type="button" onClick={() => { setInsertOpen(true); setPanel(null); }} className="flex min-h-14 w-full items-center text-left font-serif text-lg">
                    Color insert
                  </button>
                </li>
                {blocks.filter((block) => block.kind === "plate" && !block.insert && block.id !== "omake").map((block) => {
                  if (block.kind !== "plate") return null;
                  const index = blocks.indexOf(block);
                  return (
                    <li key={block.id} className="border-t border-line">
                      <button type="button" onClick={() => { setAnchor(index, block.caption, index / (blocks.length - 1)); setPanel(null); }} className="flex min-h-14 w-full items-center text-left font-serif text-lg">
                        {block.caption}
                      </button>
                    </li>
                  );
                })}
                {chapters.map((item) => (
                  <li key={item.id} className="border-t border-line">
                    <button type="button" onClick={() => jumpTo(item.id)} className="flex min-h-16 w-full flex-col justify-center text-left">
                      <span className="kicker">{item.kicker}</span>
                      <span className="mt-1 font-serif text-xl">{item.title}</span>
                    </button>
                  </li>
                ))}
                {hasAfterword ? (
                <li className="border-t border-line">
                  <button type="button" disabled={!finished} onClick={() => finished && jumpKind("afterword")} className="flex min-h-14 w-full items-center text-left font-serif text-lg disabled:text-muted">
                    Afterword{finished ? "" : " · sealed"}
                  </button>
                </li>
                ) : null}
                <li className="border-t border-line">
                  <button type="button" disabled={hasAfterword && !finished} onClick={() => (!hasAfterword || finished) && jumpKind("cast")} className="flex min-h-14 w-full items-center text-left font-serif text-lg disabled:text-muted">
                    Cast{hasAfterword && !finished ? " · sealed" : ""}
                  </button>
                </li>
                <li className="border-t border-line">
                  <button type="button" disabled={hasAfterword && !finished} onClick={() => (!hasAfterword || finished) && jumpKind("colophon")} className="flex min-h-14 w-full items-center text-left font-serif text-lg disabled:text-muted">
                    Colophon{hasAfterword && !finished ? " · sealed" : ""}
                  </button>
                </li>
              </ol>
            ) : panel === "codex" ? (
              <ul className="flex-1 overflow-auto px-5 pb-8">
                {codex.filter((entry) => reachedFrom(anchor) >= (RANK[entry.from] ?? 0)).map((entry) => (
                  <li key={entry.name} className="border-t border-line py-4">
                    <p className="kicker">{entry.group}</p>
                    <p className="mt-1 font-serif text-xl">{entry.name}</p>
                    <p className="font-sans text-xs text-muted">{entry.title} · {entry.faction}</p>
                    <p className="mt-2 font-sans text-sm">{entry.relation}</p>
                    <p className="font-sans text-sm text-muted">{entry.ability}</p>
                    <p className="mt-2 font-sans text-sm leading-relaxed text-muted">{entry.body}</p>
                  </li>
                ))}
                {codex.some((entry) => reachedFrom(anchor) < (RANK[entry.from] ?? 0)) ? (
                  <li className="py-4 font-sans text-sm text-muted">Later names stay hidden until you reach them.</li>
                ) : null}
              </ul>
            ) : panel === "marks" ? (
              <div className="flex flex-1 flex-col gap-4 overflow-auto px-5 pb-8">
                <button type="button" className="h-12 rounded-full border border-line font-sans text-sm" onClick={() => toggleDogear(anchor)}>
                  {dogears.includes(anchor) ? "Dog-ear removed" : "Dog-ear this page"}
                </button>
                <p className="font-sans text-sm text-muted">{dogears.length} dog-ears · {savedPlates.length} plates saved</p>
                <label className="font-sans text-sm text-muted">
                  Private note
                  <textarea value={noteDraft} onChange={(event) => setNoteDraft(event.target.value)} className="mt-2 h-24 w-full rounded-2xl border border-line bg-paper p-3 text-ink" />
                </label>
                <button type="button" className="h-12 rounded-full bg-ink font-sans text-sm text-paper" onClick={() => { if (noteDraft.trim()) addNote(anchor, noteDraft.trim()); setNoteDraft(""); }}>
                  Save note
                </button>
                {notes.map((item) => (
                  <p key={`${item.anchor}-${item.text}`} className="font-serif text-base">{item.text}</p>
                ))}
              </div>
            ) : panel === "recap" ? (
              <ul className="flex flex-1 flex-col gap-4 overflow-auto px-5 pb-8">
                <li className="font-sans text-sm text-muted">Only what you have already read. Later chapters stay out.</li>
                {recapBank.filter((item) => reachedFrom(anchor) >= item.from).map((item) => (
                  <li key={item.ask}>
                    <p className="font-serif text-lg">{item.ask}</p>
                    <p className="mt-1 font-sans text-sm leading-relaxed text-muted">{item.answer}</p>
                  </li>
                ))}
              </ul>
            ) : panel === "chapter" ? (
              <div className="flex flex-1 flex-col gap-3 overflow-auto px-5 pb-8">
                <p className="font-sans text-sm text-muted">Notes on this chapter. Not on the sentence.</p>
                <ul className="flex flex-col gap-3">
                  {comments.filter((item) => item.chapter === chapterLabel).map((item) => (
                    <li key={item.text} className="font-serif text-lg">{item.text}</li>
                  ))}
                </ul>
                <form
                  className="mt-2 flex flex-col gap-2"
                  onSubmit={(event) => {
                    event.preventDefault();
                    if (!noteLine.trim()) return;
                    addComment(chapterLabel, noteLine.trim());
                    setNoteLine("");
                  }}
                >
                  <textarea value={noteLine} onChange={(event) => setNoteLine(event.target.value)} aria-label="Chapter note" className="h-24 rounded-2xl border border-line bg-paper p-3 font-serif text-lg" />
                  <button type="submit" className="h-11 rounded-full bg-ink font-sans text-sm text-paper">Leave it on the chapter</button>
                </form>
              </div>
            ) : (
              <div className="flex flex-1 flex-col gap-8 overflow-auto px-5 pb-8">
                <fieldset>
                  <legend className="kicker">Paper</legend>
                  <div className="mt-3 flex gap-3">
                    <Swatch name="paper" current={theme} onPick={setTheme} label="Ivory" className="bg-swatch-paper" />
                    <Swatch name="sepia" current={theme} onPick={setTheme} label="Sepia" className="bg-swatch-sepia" />
                    <Swatch name="night" current={theme} onPick={setTheme} label="Night" className="bg-swatch-night" />
                  </div>
                </fieldset>
                <fieldset>
                  <legend className="kicker">Body</legend>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <ModeButton name="bunko" current={mode} onPick={setMode} label="Bunko" />
                    <ModeButton name="scroll" current={mode} onPick={setMode} label="Scroll" />
                  </div>
                </fieldset>
                <fieldset>
                  <legend className="kicker">Type</legend>
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    <SizeButton name="sm" current={size} onPick={setSize} label="Small" className="text-sm" />
                    <SizeButton name="md" current={size} onPick={setSize} label="Book" className="text-base" />
                    <SizeButton name="lg" current={size} onPick={setSize} label="Large" className="text-lg" />
                  </div>
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    <FaceButton name="newsreader" current={face} onPick={setFace} label="News" />
                    <FaceButton name="literata" current={face} onPick={setFace} label="Literata" />
                    <FaceButton name="fraunces" current={face} onPick={setFace} label="Fraunces" />
                  </div>
                </fieldset>
                <div className="grid gap-2">
                  <button type="button" className="h-12 rounded-full border border-line font-sans text-sm" onClick={() => { bumpListens(); setHearing(true); void speakBlocks(mode === "scroll" ? blocks : pageBlocks, rate).finally(() => setHearing(false)); }}>
                    {hearing ? "Reading" : "Listen"}
                  </button>
                  <div className="flex gap-2">
                    {[0.9, 1, 1.25, 1.5].map((speed) => (
                      <button key={speed} type="button" onClick={() => { setRate(speed); setSpeechRate(speed); }} className={`h-11 flex-1 rounded-full border font-sans text-sm ${rate === speed ? "border-vermillion" : "border-line text-muted"}`}>
                        {speed}×
                      </button>
                    ))}
                  </div>
                  <button type="button" className="h-12 rounded-full border border-line font-sans text-sm" onClick={() => stopSpeech()}>
                    Stop voice
                  </button>
                  <button type="button" className="h-12 rounded-full border border-line font-sans text-sm" onClick={() => setPanel("recap")}>
                    Recap, up to here
                  </button>
                  <button type="button" className="h-12 rounded-full border border-line font-sans text-sm" onClick={() => setPanel("chapter")}>
                    Chapter notes
                  </button>
                  <button type="button" className="h-12 rounded-full border border-line font-sans text-sm" onClick={() => setQuiet(!quiet)}>
                    {quiet ? "Line reactions are hidden" : "Hide line reactions"}
                  </button>
                  <button type="button" className="h-12 rounded-full border border-line font-sans text-sm" onClick={() => { setQuoteOpen(true); setPanel(null); }}>
                    Quote card
                  </button>
                  <button type="button" className="h-12 rounded-full border border-line font-sans text-sm" onClick={() => setPanel("codex")}>
                    Codex
                  </button>
                  <button type="button" className="h-12 rounded-full border border-line font-sans text-sm" onClick={() => setPanel("marks")}>
                    Marks and notes
                  </button>
                  <button type="button" disabled={exporting} className="h-12 rounded-full bg-ink font-sans text-sm text-paper disabled:opacity-50" onClick={() => { setExporting(true); void downloadEpub().finally(() => setExporting(false)); }}>
                    {exporting ? "Building EPUB…" : "Export EPUB"}
                  </button>
                </div>
                <p className="font-sans text-sm leading-relaxed text-muted">
                  Press Read, or double-tap the page, and the page fills the screen. Double-tap again for the framed page. The ribbon bookmarks this page.
                </p>
              </div>
            )}
          </aside>
        </div>
      ) : null}
      {gloss ? (
        <div className="absolute inset-x-0 bottom-20 z-40 mx-auto w-[min(100%-1.5rem,24rem)] rounded-2xl bg-paper p-4 text-ink shadow-xl">
          <p className="kicker">{gloss}</p>
          <p className="mt-2 font-serif text-lg">{glossary.find((item) => item.term === gloss)?.blurb}</p>
          <button type="button" className="mt-3 font-sans text-sm text-muted" onClick={() => setGloss(null)}>Close</button>
        </div>
      ) : null}
      {litPlate ? (
        <div className="absolute inset-0 z-50 flex flex-col bg-ink/90 p-4" onClick={() => setLitPlate(null)}>
          <img src={litPlate.src} alt={litPlate.alt} className="min-h-0 flex-1 object-contain" />
          <p className="pt-3 text-center font-serif text-paper">{litPlate.caption}</p>
          <button
            type="button"
            className="mx-auto mt-3 font-sans text-sm text-paper/80"
            onClick={(event) => {
              event.stopPropagation();
              setPassedLine(litPlate.caption);
              setLitPlate(null);
            }}
          >
            Pass this plate
          </button>
        </div>
      ) : null}
      {insertOpen && insertPlates.length ? (
        <div className="absolute inset-0 z-50 flex flex-col bg-paper">
          <div className="flex h-12 items-center justify-between px-4">
            <p className="kicker">Color insert</p>
            <button type="button" className="font-sans text-sm" onClick={() => setInsertOpen(false)}>Close</button>
          </div>
          <img src={insertPlates[insertAt]?.src} alt={insertPlates[insertAt]?.alt ?? ""} className="min-h-0 flex-1 object-contain" />
          <div className="flex h-14 items-center justify-between px-4">
            <button type="button" className="font-sans text-sm text-muted" disabled={insertAt <= 0} onClick={() => setInsertAt((value) => value - 1)}>Prev</button>
            <span className="font-sans text-xs text-muted">{insertAt + 1} / {insertPlates.length}</span>
            <button type="button" className="font-sans text-sm text-muted" disabled={insertAt >= insertPlates.length - 1} onClick={() => setInsertAt((value) => value + 1)}>Next</button>
          </div>
        </div>
      ) : null}
      {quoteOpen && quotePlate ? (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-ink/50 p-4" onClick={() => setQuoteOpen(false)}>
          <figure className="w-full max-w-sm overflow-hidden bg-ink text-paper" onClick={(event) => event.stopPropagation()}>
            <img src={quotePlate.src} alt="" className="aspect-[2/3] w-full object-cover" />
            <figcaption className="p-4">
              <p className="font-serif text-lg leading-snug">“{quoteLine}”</p>
              <p className="mt-3 font-sans text-xs tracking-widest uppercase">{book.title}</p>
            </figcaption>
          </figure>
        </div>
      ) : null}
    </div>
  );
}

function reachedFrom(anchor: number): number {
  let rank = 0;
  for (let index = 0; index <= anchor; index++) {
    const block = printed[index];
    if (block?.kind === "chapter") rank = RANK[block.id] ?? rank;
  }
  return rank;
}

function PageBody({
  blocks: pageBlocks,
  reached,
  onTerm,
  onPlate,
  links,
  glow,
  onLink,
}: {
  blocks: Block[];
  reached: number;
  onTerm: (term: string) => void;
  onPlate: (plate: Extract<Block, { kind: "plate" }>) => void;
  links: { id: string; phrase: string }[];
  glow: string | null;
  onLink: (id: string) => void;
}) {
  if (pageBlocks.length === 1) {
    const only = pageBlocks[0];
    if (only && SOLO_KINDS.has(only.kind)) {
      return (
        <div className="h-full">
          <LiveBlock block={only} reached={reached} onTerm={onTerm} onPlate={onPlate} links={links} glow={glow} onLink={onLink} />
        </div>
      );
    }
  }
  return (
    <div>
      {pageBlocks.map((block, index) => (
        <div key={index} className={glow && block.kind === "p" && !block.text.includes(glow) ? "opacity-25" : ""}>
          <LiveBlock block={block} reached={reached} onTerm={onTerm} onPlate={onPlate} links={links} glow={glow} onLink={onLink} />
        </div>
      ))}
    </div>
  );
}

function LiveBlock({
  block,
  reached,
  onTerm,
  onPlate,
  links = [],
  glow = null,
  onLink = () => {},
}: {
  block: Block;
  reached: number;
  onTerm: (term: string) => void;
  onPlate: (plate: Extract<Block, { kind: "plate" }>) => void;
  links?: { id: string; phrase: string }[];
  glow?: string | null;
  onLink?: (id: string) => void;
}) {
  if (block.kind === "insert") {
    return (
      <div className="flex h-full flex-col justify-center">
        <p className="kicker">Color insert</p>
        <h1 className="mt-4 font-serif text-4xl leading-tight">Four plates, before the prose</h1>
        <p className="mt-4 font-serif text-lg text-muted">Turn the page. The story starts after the insert.</p>
      </div>
    );
  }
  if (block.kind === "imprint") {
    return (
      <div className="flex h-full flex-col justify-center">
        <p className="kicker">Imprint</p>
        <p className="mt-4 font-serif text-3xl">LightNov</p>
        <p className="mt-3 font-serif text-lg text-muted">Original sample volume. Set in the author’s chosen face.</p>
      </div>
    );
  }
  if (block.kind === "title") {
    return (
      <div className="flex h-full flex-col justify-center pb-8">
        <p className="kicker">{book.volume}</p>
        <h1 className="mt-4 font-serif text-4xl leading-tight text-balance sm:text-5xl">{book.title}</h1>
        <p className="mt-4 font-serif text-xl text-muted italic">{book.subtitle}</p>
        <div className="mt-8 h-px w-14 bg-vermillion" />
        <p className="mt-8 font-sans text-sm text-muted">A LightNov sample · original text</p>
      </div>
    );
  }
  if (block.kind === "afterword") {
    return (
      <div className="flex h-full flex-col justify-center">
        <p className="kicker">Afterword</p>
        <h2 className="mt-4 font-serif text-3xl leading-tight">He still doesn’t know who the letter is for.</h2>
        <p className="mt-4 font-serif text-lg leading-relaxed text-muted">That is the point of the sample. The next volume would open on the alley, not on an explanation.</p>
      </div>
    );
  }
  if (block.kind === "cast") {
    return (
      <div>
        <p className="kicker">Cast</p>
        <ul className="mt-4 flex flex-col gap-3">
          {cast.map((person) => {
            const plate = printed.find((item) => item.kind === "plate" && item.id === person.plate);
            const src = plate && plate.kind === "plate" ? plate.src : "/plates/cover.jpg";
            return (
              <li key={person.name} className="flex items-center gap-3">
                <img src={src} alt="" className="size-14 object-cover" />
                <span>
                  <span className="block font-serif text-lg">{person.name}</span>
                  <span className="font-sans text-xs text-muted">{person.role}</span>
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
  if (block.kind === "colophon") {
    return (
      <div className="flex h-full flex-col justify-center">
        <p className="kicker">Colophon</p>
        <p className="mt-4 font-serif text-4xl tabular-nums">{wordCount().toLocaleString()} words</p>
        <p className="mt-2 font-serif text-xl text-muted">{plateCount()} plates in this volume</p>
        <p className="mt-6 font-sans text-sm text-muted">Set for LightNov. Paper, ribbon, and a short haptic on the turn.</p>
      </div>
    );
  }
  if (block.kind === "end") {
    return (
      <div className="flex h-full flex-col items-center justify-center">
        <img src="/plates/cover.jpg" alt="" className="max-h-[68%] w-auto object-contain" />
        <p className="mt-6 font-serif text-2xl">Closed.</p>
        <Link to="/" className="mt-4 inline-flex h-11 items-center gap-1.5 rounded-full border border-line px-4 font-sans text-sm text-ink">
          <ArrowLeft className="size-4" />
          Back
        </Link>
      </div>
    );
  }
  if (block.kind === "plate") {
    return (
      <figure className="relative flex h-full min-h-0 flex-col">
        <button type="button" className="min-h-0 flex-1" onClick={() => onPlate(block)}>
          <img src={block.src} alt={block.alt} className="h-full w-full object-contain object-center" />
        </button>
        <span className="absolute right-0 bottom-0">
          <PlateSave id={block.id} />
        </span>
      </figure>
    );
  }
  if (block.kind === "chapter") {
    return (
      <header className="pb-6">
        <p className="kicker">{block.kicker}</p>
        <h2 className="mt-2 font-serif text-3xl leading-tight text-balance">{block.title}</h2>
      </header>
    );
  }
  if (block.kind === "ornament") {
    return (
      <div className="flex items-center justify-center gap-3 py-5">
        <span className="h-px w-8 bg-line" />
        <span className="size-1.5 rotate-45 bg-vermillion" />
        <span className="h-px w-8 bg-line" />
      </div>
    );
  }
  return (
    <p className={`read-copy gap-after ${block.drop ? "drop-cap" : ""}`}>
      <RichText text={block.text} reached={reached} onTerm={onTerm} links={links} glow={glow} onLink={onLink} />
      <LineMarks line={block.text} />
    </p>
  );
}

function MeasureBlock({ block }: { block: Block }) {
  if (SOLO_KINDS.has(block.kind)) {
    return <div data-measure className="h-px" />;
  }
  if (block.kind === "chapter") {
    return (
      <header data-measure className="pb-6">
        <p className="kicker">{block.kicker}</p>
        <h2 className="mt-2 font-serif text-3xl leading-tight">{block.title}</h2>
      </header>
    );
  }
  if (block.kind === "ornament") {
    return (
      <div data-measure className="flex items-center justify-center gap-3 py-5">
        <span className="h-px w-8 bg-line" />
        <span className="size-1.5 rotate-45 bg-vermillion" />
        <span className="h-px w-8 bg-line" />
      </div>
    );
  }
  if (block.kind === "cast") return <div data-measure className="h-80" />;
  if (block.kind !== "p") return <div data-measure className="h-px" />;
  return (
    <p data-measure className={`read-copy gap-after ${block.drop ? "drop-cap" : ""}`}>
      {block.text}
    </p>
  );
}

function RichText({
  text,
  reached,
  onTerm,
  links,
  glow,
  onLink,
}: {
  text: string;
  reached: number;
  onTerm: (term: string) => void;
  links: { id: string; phrase: string }[];
  glow: string | null;
  onLink: (id: string) => void;
}) {
  const link = links.find((item) => text.includes(item.phrase));
  if (link) {
    const [before, after] = text.split(itemPhrase(link.phrase));
    return (
      <>
        <GlossaryText text={before ?? ""} reached={reached} onTerm={onTerm} />
        <button type="button" className={glow === link.phrase ? "bind-hot" : "bind"} onClick={() => onLink(link.id)}>
          {link.phrase}
        </button>
        <GlossaryText text={after ?? ""} reached={reached} onTerm={onTerm} />
      </>
    );
  }
  return <GlossaryText text={text} reached={reached} onTerm={onTerm} />;
}

function LineMarks({ line }: { line: string }) {
  const quiet = useReader((state) => state.quiet);
  const reactions = useReader((state) => state.reactions);
  const addReaction = useReader((state) => state.addReaction);
  const [open, setOpen] = useState(false);
  if (quiet) return null;
  const key = line.slice(0, 80);
  const marks = ["❤️", "😭", "😂", "👀", "😡"];
  const chosen = reactions.filter((item) => item.key === key);
  return (
    <span className="mt-1 flex flex-wrap items-center gap-1">
      <button type="button" className="font-sans text-xs text-muted" onClick={() => setOpen((value) => !value)}>
        {chosen.length ? chosen.map((item) => item.emoji).join(" ") : "Mark"}
      </button>
      {open
        ? marks.map((mark) => (
            <button key={mark} type="button" className="h-8 rounded-full border border-line px-2 font-sans text-xs" onClick={() => addReaction(key, mark)}>
              {mark}
            </button>
          ))
        : null}
    </span>
  );
}

function itemPhrase(phrase: string) {
  return phrase;
}

function GlossaryText({
  text,
  reached,
  onTerm,
}: {
  text: string;
  reached: number;
  onTerm: (term: string) => void;
}) {
  const visible = glossary.filter((item) => reached >= (RANK[item.from] ?? 0));
  if (!visible.length) return text;
  const pattern = new RegExp(`\\b(${visible.map((item) => item.term).join("|")})\\b`, "gi");
  const parts = text.split(pattern);
  return parts.map((part, index) => {
    const hit = visible.find((item) => item.term.toLowerCase() === part.toLowerCase());
    if (!hit) return <span key={index}>{part}</span>;
    return (
      <button key={index} type="button" className="term" onClick={() => onTerm(hit.term)}>
        {part}
      </button>
    );
  });
}

function PlateSave({ id }: { id: string; savedHint?: boolean }) {
  const saved = useReader((state) => state.savedPlates.includes(id));
  const toggle = useReader((state) => state.togglePlate);
  return (
    <button type="button" className="font-sans text-xs text-vermillion" onClick={() => toggle(id)}>
      {saved ? "Saved" : "Save plate"}
    </button>
  );
}

function ModeButton({
  name,
  current,
  onPick,
  label,
}: {
  name: ReadMode;
  current: ReadMode;
  onPick: (mode: ReadMode) => void;
  label: string;
}) {
  const selected = name === current;
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={() => onPick(name)}
      className={`h-12 rounded-full border font-sans text-sm ${selected ? "border-vermillion text-ink" : "border-line text-muted"}`}
    >
      {label}
    </button>
  );
}

function FaceButton({
  name,
  current,
  onPick,
  label,
}: {
  name: FaceName;
  current: FaceName;
  onPick: (face: FaceName) => void;
  label: string;
}) {
  const selected = name === current;
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={() => onPick(name)}
      className={`h-12 rounded-full border font-serif text-sm ${selected ? "border-vermillion text-ink" : "border-line text-muted"}`}
    >
      {label}
    </button>
  );
}

function Swatch({
  name,
  current,
  onPick,
  label,
  className,
}: {
  name: ThemeName;
  current: ThemeName;
  onPick: (theme: ThemeName) => void;
  label: string;
  className: string;
}) {
  const selected = name === current;
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={() => onPick(name)}
      className="flex flex-col items-center gap-2"
    >
      <span
        className={`size-12 rounded-full border ${className} ${selected ? "border-vermillion" : "border-line"}`}
      />
      <span className="font-sans text-xs text-muted">{label}</span>
    </button>
  );
}

function SizeButton({
  name,
  current,
  onPick,
  label,
  className,
}: {
  name: TypeSize;
  current: TypeSize;
  onPick: (size: TypeSize) => void;
  label: string;
  className: string;
}) {
  const selected = name === current;
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={() => onPick(name)}
      className={`flex h-12 items-center justify-center rounded-full border font-serif ${className} ${
        selected ? "border-vermillion text-ink" : "border-line text-muted"
      }`}
    >
      {label}
    </button>
  );
}

function samePages(a: number[][], b: number[][]): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    const left = a[i];
    const right = b[i];
    if (!left || !right || left.length !== right.length) return false;
    for (let j = 0; j < left.length; j++) {
      if (left[j] !== right[j]) return false;
    }
  }
  return true;
}
