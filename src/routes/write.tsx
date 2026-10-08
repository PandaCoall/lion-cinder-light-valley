import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppNav } from "@/components/nav";
import { useReader } from "@/lib/reader-store";

export const Route = createFileRoute("/write")({
  head: () => ({ meta: [{ title: "Write · LightNov" }] }),
  component: Dashboard,
});

function Dashboard() {
  const theme = useReader((state) => state.theme);
  const face = useReader((state) => state.face);
  const novels = useReader((state) => state.novels);
  const createNovel = useReader((state) => state.createNovel);
  const navigate = useNavigate();

  return (
    <div className="folio flex min-h-dvh flex-col bg-desk text-ink" data-theme={theme} data-face={face}>
      <header className="mx-auto flex w-full max-w-3xl items-end justify-between px-5 pt-6">
        <div>
          <p className="kicker">Write</p>
          <h1 className="mt-1 font-serif text-4xl">Author dashboard</h1>
        </div>
        <button
          type="button"
          className="h-11 rounded-full bg-ink px-4 font-sans text-sm text-paper"
          onClick={() => {
            const id = createNovel();
            void navigate({ to: "/studio", search: { novel: id } });
          }}
        >
          New novel
        </button>
      </header>
      <main className="mx-auto w-full max-w-3xl flex-1 px-5 py-6">
        {novels.length ? (
          <ul className="flex flex-col gap-3">
            {novels.map((novel) => (
              <li key={novel.id}>
                <Link to="/studio" search={{ novel: novel.id }} className="block rounded-3xl bg-paper p-5">
                  <p className="font-sans text-xs text-muted">{novel.genre} · {novel.chapters.length} chapters · {novel.plates.length} {novel.plates.length === 1 ? "illustration" : "illustrations"}</p>
                  <h2 className="mt-1 font-serif text-2xl">{novel.title}</h2>
                  <p className="mt-2 font-sans text-sm text-muted">{novel.hook || "No hook yet."}</p>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="rounded-3xl bg-paper p-6">
            <p className="font-serif text-2xl">No volumes yet.</p>
            <p className="mt-2 font-sans text-sm text-muted">Start a novel, then write chapters and place the illustrations.</p>
          </div>
        )}
      </main>
      <AppNav />
    </div>
  );
}
