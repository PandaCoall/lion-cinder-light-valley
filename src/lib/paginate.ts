export const SOLO_KINDS = new Set([
  "plate",
  "title",
  "end",
  "imprint",
  "insert",
  "afterword",
  "colophon",
]);

export function packPages(heights: number[], kinds: string[], limit: number): number[][] {
  const pages: number[][] = [];
  let cur: number[] = [];
  let used = 0;

  const flush = () => {
    if (cur.length) pages.push(cur);
    cur = [];
    used = 0;
  };

  for (let i = 0; i < heights.length; i++) {
    const h = Math.max(heights[i] ?? 0, 1);
    const kind = kinds[i] ?? "";
    if (SOLO_KINDS.has(kind)) {
      flush();
      pages.push([i]);
      continue;
    }
    if (kind === "chapter") flush();
    if (cur.length && used + h > limit) flush();
    cur.push(i);
    used += h;
  }
  flush();

  for (let p = 0; p < pages.length - 1; p++) {
    const page = pages[p];
    if (!page || page.length !== 1 || kinds[page[0] ?? -1] !== "chapter") continue;
    const next = pages[p + 1];
    const take = next?.[0];
    if (take === undefined || kinds[take] !== "p") continue;
    const combined = (heights[page[0] ?? 0] ?? 0) + (heights[take] ?? 0);
    if (combined > limit) continue;
    page.push(take);
    next.shift();
  }

  return pages.filter((page) => page.length > 0);
}

export function pageForAnchor(pages: number[][], anchor: number): number {
  if (!pages.length) return 0;
  const exact = pages.findIndex((page) => page.includes(anchor));
  if (exact >= 0) return exact;
  let best = 0;
  pages.forEach((page, index) => {
    const first = page[0] ?? 0;
    if (first <= anchor) best = index;
  });
  return best;
}