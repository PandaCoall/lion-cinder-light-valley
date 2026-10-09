import { Link, createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { AppNav } from "@/components/nav";
import { readManuscript } from "@/lib/manuscript";
import { useReader } from "@/lib/reader-store";

type Search = { novel?: string; chapter?: string };

export const Route = createFileRoute("/editor")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    novel: typeof search.novel === "string" ? search.novel : undefined,
    chapter: typeof search.chapter === "string" ? search.chapter : undefined,
  }),
  head: () => ({ meta: [{ title: "Chapter · LightNov" }] }),
  component: Editor,
});

function Editor() {
  const { novel: novelId, chapter: chapterId } = Route.useSearch();
  const theme = useReader((state) => state.theme);
  const face = useReader((state) => state.face);
  const novels = useReader((state) => state.novels);
  const patchChapter = useReader((state) => state.patchChapter);
  const novel = novels.find((item) => item.id === novelId);
  const chapter = novel?.chapters.find((item) => item.id === chapterId);
  const fileRef = useRef<HTMLInputElement>(null);
  const [notice, setNotice] = useState("");

  const writeBody = (body: string) => {
    if (!novel || !chapter) return;
    patchChapter(novel.id, chapter.id, { body });
  };

  return (
    <div className="folio flex min-h-dvh flex-col bg-desk text-ink" data-theme={theme} data-face={face}>
      <header className="flex items-center justify-between gap-3 px-5 pt-5">
        <Link to="/studio" search={{ novel: novelId }} className="inline-flex h-11 items-center rounded-full border border-line bg-paper px-4 font-sans text-sm">Back</Link>
        <p className="kicker">Chapter editor</p>
      </header>
      <main className="mx-auto w-full max-w-3xl flex-1 px-5 py-5">
        {novel && chapter ? (
          <>
            <input
              value={chapter.title}
              aria-label="Chapter title"
              onChange={(event) => patchChapter(novel.id, chapter.id, { title: event.target.value })}
              className="w-full bg-transparent font-serif text-3xl outline-none"
            />
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                className="h-11 rounded-full border border-line bg-paper px-4 font-sans text-sm"
                onClick={() => {
                  void navigator.clipboard.readText().then((text) => {
                    writeBody(chapter.body ? `${chapter.body}\n\n${text}` : text);
                    setNotice("Pasted into the chapter.");
                  }).catch(() => setNotice("Paste was blocked. Use the page and press paste."));
                }}
              >
                Paste
              </button>
              <button type="button" className="h-11 rounded-full border border-line bg-paper px-4 font-sans text-sm" onClick={() => fileRef.current?.click()}>
                Upload Word or PDF
              </button>
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
                      writeBody(text);
                      if (!chapter.title || chapter.title.startsWith("Chapter")) {
                        patchChapter(novel.id, chapter.id, { title: file.name.replace(/\.[^.]+$/, "") });
                      }
                      setNotice(`Imported ${file.name}. Check that page numbers did not come in with the document. Take them out, recheck, edit, then publish.`);
                    })
                    .catch((error: unknown) => {
                      setNotice(error instanceof Error ? error.message : "That file could not be read.");
                    });
                }}
              />
            </div>
            {notice ? <p className="mt-2 font-sans text-sm text-muted">{notice}</p> : null}
            <p className="mt-2 font-sans text-sm text-muted">If this chapter came from a Word file or PDF, page numbers from that file often land in the text. Take them out, recheck, edit, then publish.</p>
            <textarea
              value={chapter.body}
              aria-label="Chapter"
              onChange={(event) => writeBody(event.target.value)}
              placeholder="Write, paste, or upload a Word file or PDF."
              className="mt-4 min-h-[55dvh] w-full rounded-3xl bg-paper p-6 font-serif text-lg leading-relaxed outline-none"
            />
            {novel.plates.length ? (
              <p className="mt-3 font-sans text-sm text-muted">{novel.plates.length} {novel.plates.length === 1 ? "illustration sits" : "illustrations sit"} with this volume. Manage them in the studio.</p>
            ) : null}
          </>
        ) : (
          <p className="font-serif text-2xl">Choose a chapter from the studio.</p>
        )}
      </main>
      <AppNav />
    </div>
  );
}
