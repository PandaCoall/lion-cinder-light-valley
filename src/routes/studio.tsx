import { Link, createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { AppNav } from "@/components/nav";
import { genres, tropes } from "@/data/catalog";
import { readManuscript, splitChapters } from "@/lib/manuscript";
import { useReader } from "@/lib/reader-store";

type Search = { novel?: string };

export const Route = createFileRoute("/studio")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    novel: typeof search.novel === "string" ? search.novel : undefined,
  }),
  head: () => ({ meta: [{ title: "Studio · LightNov" }] }),
  component: Studio,
});

function Studio() {
  const { novel: novelId } = Route.useSearch();
  const theme = useReader((state) => state.theme);
  const face = useReader((state) => state.face);
  const novels = useReader((state) => state.novels);
  const patchNovel = useReader((state) => state.patchNovel);
  const addChapter = useReader((state) => state.addChapter);
  const importChapters = useReader((state) => state.importChapters);
  const addPlate = useReader((state) => state.addPlate);
  const removePlate = useReader((state) => state.removePlate);
  const novel = novels.find((item) => item.id === novelId);
  const fileRef = useRef<HTMLInputElement>(null);
  const [notice, setNotice] = useState("");

  const onImage = (file: File | undefined) => {
    if (!file || !novel) return;
    if (file.size > 1_500_000) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== "string") return;
      addPlate(novel.id, {
        id: `plate-${Date.now()}`,
        src: reader.result,
        caption: file.name.replace(/\.[^.]+$/, ""),
        after: novel.chapters[0]?.id ?? "",
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="folio flex min-h-dvh flex-col bg-desk text-ink" data-theme={theme} data-face={face}>
      <header className="flex items-center justify-between px-5 pt-5">
        <Link to="/write" className="inline-flex h-11 items-center rounded-full border border-line bg-paper px-4 font-sans text-sm">Back</Link>
        <p className="kicker">Novel studio</p>
      </header>
      <main className="mx-auto w-full max-w-3xl flex-1 px-5 py-6">
        {novel ? (
          <div className="flex flex-col gap-5">
            <label className="font-sans text-sm text-muted">
              Title
              <input value={novel.title} onChange={(event) => patchNovel(novel.id, { title: event.target.value })} className="mt-1 h-12 w-full rounded-2xl border border-line bg-paper px-4 font-serif text-2xl text-ink" />
            </label>
            <label className="font-sans text-sm text-muted">
              Hook
              <textarea value={novel.hook} onChange={(event) => patchNovel(novel.id, { hook: event.target.value })} className="mt-1 h-24 w-full rounded-2xl border border-line bg-paper p-4 font-serif text-lg text-ink" />
            </label>
            <label className="font-sans text-sm text-muted">
              Genre
              <select value={novel.genre} onChange={(event) => patchNovel(novel.id, { genre: event.target.value })} className="mt-1 h-12 w-full rounded-2xl border border-line bg-paper px-4 font-sans text-sm text-ink">
                {genres.map((genre) => (
                  <option key={genre}>{genre}</option>
                ))}
              </select>
            </label>
            <div>
              <p className="font-sans text-sm text-muted">Tropes</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {tropes.map((trope) => {
                  const on = novel.tropes.includes(trope);
                  return (
                    <button
                      key={trope}
                      type="button"
                      onClick={() =>
                        patchNovel(novel.id, {
                          tropes: on ? novel.tropes.filter((item) => item !== trope) : [...novel.tropes, trope],
                        })
                      }
                      className={`h-10 rounded-full border px-3 font-sans text-sm ${on ? "border-vermillion" : "border-line"}`}
                    >
                      {trope}
                    </button>
                  );
                })}
              </div>
            </div>
            <section>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="font-serif text-2xl">Chapters</h2>
                <div className="flex gap-2">
                  <button type="button" className="h-11 rounded-full border border-line px-4 font-sans text-sm" onClick={() => fileRef.current?.click()}>
                    Upload Word or PDF
                  </button>
                  <button type="button" className="h-11 rounded-full border border-line px-4 font-sans text-sm" onClick={() => addChapter(novel.id)}>
                    Add chapter
                  </button>
                </div>
              </div>
              <input
                ref={fileRef}
                type="file"
                accept=".txt,.md,.rtf,.doc,.docx,.pdf,text/plain,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  event.target.value = "";
                  if (!file) return;
                  setNotice(`Reading ${file.name}…`);
                  void readManuscript(file)
                    .then((text) => {
                      const chapters = splitChapters(text);
                      if (!chapters.length) {
                        setNotice("That file had no readable text.");
                        return;
                      }
                      const titled = chapters.map((chapter, index) => ({
                        title: chapter.title || file.name.replace(/\.[^.]+$/, "") || `Chapter ${index + 1}`,
                        body: chapter.body,
                      }));
                      importChapters(novel.id, titled);
                      setNotice(
                        titled.length > 1
                          ? `Imported ${titled.length} chapters from ${file.name}.`
                          : `Imported ${file.name} as one chapter.`,
                      );
                    })
                    .catch((error: unknown) => {
                      setNotice(error instanceof Error ? error.message : "That file could not be read.");
                    });
                }}
              />
              <p className="mt-2 font-sans text-sm text-muted">Word (.doc, .docx) and PDF. A line that starts with “Chapter” starts a new chapter.</p>
              {notice ? <p className="mt-2 font-sans text-sm text-muted">{notice}</p> : null}
              <ul className="mt-3 flex flex-col gap-2">
                {novel.chapters.map((chapter, index) => (
                  <li key={chapter.id}>
                    <Link to="/editor" search={{ novel: novel.id, chapter: chapter.id }} className="flex min-h-14 items-center justify-between rounded-2xl bg-paper px-4">
                      <span className="font-serif text-lg">{chapter.title || `Chapter ${index + 1}`}</span>
                      <span className="font-sans text-sm text-muted">Edit</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
            <section>
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-serif text-2xl">Illustrations</h2>
                <label className="inline-flex h-11 cursor-pointer items-center rounded-full border border-line px-4 font-sans text-sm">
                  Add illustration
                  <input type="file" accept="image/*" className="hidden" onChange={(event) => { onImage(event.target.files?.[0]); event.target.value = ""; }} />
                </label>
              </div>
              <p className="mt-1 font-sans text-sm text-muted">An illustration is a full-page picture, not a comic panel. Place it after a chapter.</p>
              <ul className="mt-3 flex flex-col gap-3">
                {novel.plates.map((plate) => (
                  <li key={plate.id} className="flex items-center gap-3 rounded-2xl bg-paper p-3">
                    <img src={plate.src} alt="" className="h-16 w-12 rounded-lg object-cover" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-serif">{plate.caption}</span>
                      <span className="font-sans text-xs text-muted">After {novel.chapters.find((chapter) => chapter.id === plate.after)?.title ?? "the opening"}</span>
                    </span>
                    <button type="button" className="h-11 font-sans text-sm text-muted" onClick={() => removePlate(novel.id, plate.id)}>Remove</button>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        ) : (
          <p className="font-serif text-2xl">Open a novel from the dashboard.</p>
        )}
      </main>
      <AppNav />
    </div>
  );
}
