import { createFileRoute } from "@tanstack/react-router";
import { Reader } from "@/components/reader";

type Search = { chapter?: string; plate?: string; own?: boolean; preview?: string };

export const Route = createFileRoute("/read")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    chapter: typeof search.chapter === "string" ? search.chapter : undefined,
    plate: typeof search.plate === "string" ? search.plate : undefined,
    own: search.own === true || search.own === "1" || search.own === 1,
    preview: typeof search.preview === "string" ? search.preview : undefined,
  }),
  head: () => ({
    meta: [{ title: "Salt & Second Chances · LightNov" }],
  }),
  component: ReadPage,
});

function ReadPage() {
  const { chapter, plate, own, preview } = Route.useSearch();
  return <Reader chapter={chapter} plate={plate} own={own} preview={preview} />;
}