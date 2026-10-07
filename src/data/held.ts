export const desk = [
  { title: "Salt & Second Chances", note: "On the desk" },
  { title: "The Letter’s Errand", note: "Not printed yet" },
  { title: "A Shirt Left Folded", note: "Announced" },
];

export const dropoff = [
  { plate: "Color insert", left: 12 },
  { plate: "The bow", left: 28 },
  { plate: "Maris", left: 41 },
  { plate: "Netmender’s Row", left: 63 },
];

export const plates = [
  { id: "cover", src: "/plates/cover.jpg", label: "The pier" },
  { id: "portrait", src: "/plates/portrait.jpg", label: "The bow" },
  { id: "keeper", src: "/plates/keeper.jpg", label: "Maris" },
  { id: "street", src: "/plates/street.jpg", label: "The row" },
];

export const starterManuscript = `# The pier

The tide had come in wrong.

[[plate:portrait]]

He kept the bow, and the city kept the rest.
`;

export type PreviewBit =
  | { kind: "h"; text: string }
  | { kind: "p"; text: string }
  | { kind: "plate"; src: string; label: string };

export function parseManuscript(source: string): PreviewBit[] {
  const bits: PreviewBit[] = [];
  for (const raw of source.split(/\n\s*\n/)) {
    const chunk = raw.trim();
    if (!chunk) continue;
    const plate = chunk.match(/^\[\[plate:([a-z]+)\]\]$/);
    if (plate) {
      const found = plates.find((item) => item.id === plate[1]);
      bits.push({
        kind: "plate",
        src: found?.src ?? "/plates/cover.jpg",
        label: found?.label ?? plate[1],
      });
      continue;
    }
    if (chunk.startsWith("# ")) {
      bits.push({ kind: "h", text: chunk.slice(2).trim() });
      continue;
    }
    bits.push({ kind: "p", text: chunk.replace(/\n/g, " ") });
  }
  return bits;
}
