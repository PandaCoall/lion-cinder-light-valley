import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useRef, useState } from "react";
import { plates } from "@/data/held";
import { retention } from "@/data/catalog";
import type { Block } from "@/data/volume";
import { useReader, type PayMode } from "@/lib/reader-store";

export const Route = createFileRoute("/write")({
  head: () => ({ meta: [{ title: "Desk · LightNov" }] }),
  component: Desk,
});

const pays: { id: PayMode; label: string }[] = [
  { id: "free", label: "Free" },
  { id: "intro", label: "Free opening, then paid" },
  { id: "subscription", label: "Subscription" },
];

function Desk() {
  const theme = useReader((state) => state.theme);
  const face = useReader((state) => state.face);
  const setOwn = useReader((state) => state.setOwn);
  const setAnchor = useReader((state) => state.setAnchor);
  const drafts = useReader((state) => state.drafts);
  const addDraft = useReader((state) => state.addDraft);
  const setDraft = useReader((state) => state.setDraft);
  const pay = useReader((state) => state.pay);
  const setPay = useReader((state) => state.setPay);
  const reactions = useReader((state) => state.reactions);
  const listens = useReader((state) => state.listens);
  const comments = useReader((state) => state.comments);
  const sheetRef = useRef<HTMLDivElement>(null);
  const [title, setTitle] = useState("Untitled volume");
  const [tab, setTab] = useState<"page" | "chapters" | "numbers">("page");
  const [draftTitle, setDraftTitle] = useState("");
  const navigate = useNavigate();

  const drop = (src: string, label: string) => {
    const root = sheetRef.current;
    if (!root) return;
    const figure = document.createElement("figure");
    figure.dataset.plate = src;
    figure.dataset.label = label;
    figure.className = "my-4";
    const image = document.createElement("img");
    image.src = src;
    image.alt = label;
    image.className = "mx-auto max-h-64";
    figure.append(image);
    root.append(figure);
  };

  const readIt = () => {
    const root = sheetRef.current;
    if (!root) return;
    const next: Block[] = [{ kind: "chapter", id: "own", kicker: "Your volume", title: title.trim() || "Untitled volume" }];
    for (const node of root.children) {
      if (!(node instanceof HTMLElement)) continue;
      if (node.dataset.plate) {
        next.push({
          kind: "plate",
          id: `own-${next.length}`,
          src: node.dataset.plate,
          alt: node.dataset.label ?? "",
          caption: node.dataset.label ?? "",
        });
        continue;
      }
      const text = node.textContent?.replace(/\u00a0/g, " ").trim();
      if (!text) continue;
      next.push({ kind: "p", text, drop: next.length === 1 });
    }
    next.push({ kind: "end" });
    setOwn(title.trim() || "Untitled volume", next);
    setAnchor(0, title.trim() || "Untitled volume", 0);
    void navigate({ to: "/read", search: { own: true } });
  };

  return (
    <div className="folio min-h-dvh bg-desk text-ink" data-theme={theme} data-size="md" data-face={face}>
      <header className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-5 pt-6 pb-2 sm:px-8">
        <div className="min-w-0">
          <p className="kicker">Author desk</p>
          <h1 className="mt-1 truncate font-serif text-3xl">The volume</h1>
        </div>
        <Link to="/" className="inline-flex h-11 shrink-0 items-center gap-1.5 rounded-full border border-line bg-paper px-4 font-sans text-sm text-ink">
          <ArrowLeft className="size-4" />
          Back
        </Link>
      </header>
      <div className="mx-auto flex max-w-3xl gap-2 px-5 pt-4 sm:px-8">
        {(["page", "chapters", "numbers"] as const).map((name) => (
          <button
            key={name}
            type="button"
            onClick={() => setTab(name)}
            className={`h-10 rounded-full px-4 font-sans text-sm ${tab === name ? "bg-ink text-paper" : "border border-line"}`}
          >
            {name === "page" ? "Page" : name === "chapters" ? "Chapters" : "Numbers"}
          </button>
        ))}
      </div>
      <main className="mx-auto max-w-3xl px-5 pt-4 pb-16 sm:px-8">
        {tab === "page" ? (
          <>
            <input value={title} onChange={(event) => setTitle(event.target.value)} aria-label="Volume title" className="w-full bg-transparent font-serif text-3xl outline-none" />
            <div className="mt-3 flex flex-wrap gap-2">
              {plates.map((plate) => (
                <button key={plate.id} type="button" className="h-10 rounded-full border border-line px-3 font-sans text-sm" onClick={() => drop(plate.src, plate.label)}>
                  {plate.label}
                </button>
              ))}
              <button type="button" className="h-10 rounded-full bg-ink px-4 font-sans text-sm text-paper" onClick={readIt}>Read it</button>
            </div>
            <article ref={sheetRef} contentEditable suppressContentEditableWarning aria-label="Page" className="sheet mt-4 min-h-[60dvh] bg-paper px-6 py-8 font-serif text-lg leading-relaxed outline-none">
              <p>The tide had come in wrong.</p>
            </article>
          </>
        ) : null}
        {tab === "chapters" ? (
          <div className="flex flex-col gap-4">
            <form
              className="flex gap-2"
              onSubmit={(event) => {
                event.preventDefault();
                if (!draftTitle.trim()) return;
                addDraft(draftTitle.trim());
                setDraftTitle("");
              }}
            >
              <input value={draftTitle} onChange={(event) => setDraftTitle(event.target.value)} placeholder="New chapter" aria-label="New chapter" className="h-12 flex-1 rounded-2xl border border-line bg-paper px-3 font-serif text-lg" />
              <button type="submit" className="h-12 rounded-full bg-ink px-4 font-sans text-sm text-paper">Add</button>
            </form>
            <ul className="divide-y divide-line border-y border-line">
              {drafts.map((draft) => (
                <li key={draft.id} className="flex flex-col gap-2 py-4">
                  <p className="font-serif text-xl">{draft.title}</p>
                  <div className="flex flex-wrap gap-2">
                    {(["draft", "scheduled", "published"] as const).map((status) => (
                      <button key={status} type="button" onClick={() => setDraft(draft.id, { status })} className={`h-9 rounded-full border px-3 font-sans text-xs ${draft.status === status ? "border-vermillion" : "border-line text-muted"}`}>
                        {status}
                      </button>
                    ))}
                  </div>
                  {draft.status === "scheduled" ? (
                    <input type="date" value={draft.when} onChange={(event) => setDraft(draft.id, { when: event.target.value })} aria-label={`Release date for ${draft.title}`} className="h-11 max-w-48 rounded-xl border border-line bg-paper px-3 font-sans text-sm" />
                  ) : null}
                </li>
              ))}
            </ul>
            <fieldset>
              <legend className="kicker">How it is offered</legend>
              <p className="mt-2 font-sans text-sm text-muted">Nothing is charged. Banking is not connected.</p>
              <div className="mt-3 flex flex-col gap-2">
                {pays.map((mode) => (
                  <button key={mode.id} type="button" onClick={() => setPay(mode.id)} className={`h-12 rounded-full border px-4 text-left font-sans text-sm ${pay === mode.id ? "border-vermillion" : "border-line"}`}>
                    {mode.label}
                  </button>
                ))}
              </div>
            </fieldset>
          </div>
        ) : null}
        {tab === "numbers" ? (
          <div>
            <p className="font-sans text-sm text-muted">Sample shape of this volume, plus what happened on this device.</p>
            <ul className="mt-4 flex flex-col gap-3">
              {retention.map((row) => (
                <li key={row.label}>
                  <div className="flex justify-between font-sans text-sm">
                    <span>{row.label}</span>
                    <span className="text-muted">{row.value}%</span>
                  </div>
                  <div className="mt-1 h-1 overflow-hidden rounded-full bg-line">
                    <div className="h-full bg-vermillion" style={{ width: `${row.value}%` }} />
                  </div>
                </li>
              ))}
            </ul>
            <p className="mt-8 font-serif text-xl">On this device</p>
            <p className="mt-2 font-sans text-sm text-muted">{listens} listens · {reactions.length} line reactions · {comments.length} chapter notes</p>
            <ul className="mt-3 flex flex-col gap-1">
              {reactions.slice(-8).map((item, index) => (
                <li key={`${item.key}-${index}`} className="font-sans text-sm">{item.emoji} · {item.key.slice(0, 72)}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </main>
    </div>
  );
}
