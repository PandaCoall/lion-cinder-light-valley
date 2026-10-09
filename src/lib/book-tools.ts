import { blocks, book, type Block } from "@/data/volume";

const PLATES = ["/plates/cover.jpg", "/plates/portrait.jpg", "/plates/keeper.jpg", "/plates/street.jpg"];

export function wordCount(): number {
  return blocks.reduce((sum, block) => {
    if (block.kind !== "p") return sum;
    return sum + block.text.split(/\s+/).filter(Boolean).length;
  }, 0);
}

export function plateCount(): number {
  return blocks.filter((block) => block.kind === "plate").length;
}

export function minutesToNextPlate(anchor: number): number {
  let words = 0;
  for (let index = anchor; index < blocks.length; index++) {
    const block = blocks[index];
    if (!block) continue;
    if (index !== anchor && block.kind === "plate") break;
    if (block.kind === "p") words += block.text.split(/\s+/).filter(Boolean).length;
  }
  return Math.max(1, Math.round(words / 220));
}

export function nearestPlate(anchor: number): Extract<Block, { kind: "plate" }> | null {
  for (let index = anchor; index >= 0; index--) {
    const block = blocks[index];
    if (block?.kind === "plate") return block;
  }
  const first = blocks.find((block) => block.kind === "plate");
  return first && first.kind === "plate" ? first : null;
}

export function pageText(pageBlocks: Block[]): string {
  return pageBlocks
    .map((block) => {
      if (block.kind === "p") return block.text;
      if (block.kind === "chapter") return block.title;
      if (block.kind === "plate") return block.caption;
      return "";
    })
    .filter(Boolean)
    .join(" ");
}

let voiceToken = 0;
let clip: HTMLAudioElement | null = null;
let clipTimer = 0;

const CLIPS: Record<string, string> = {
  salt: "/audio/salt.mp3",
  errand: "/audio/errand.mp3",
  shirt: "/audio/shirt.mp3",
};

export function setSpeechRate(rate: number) {
  if (clip) clip.playbackRate = rate;
}

export async function speakBlocks(
  pageBlocks: Block[],
  rate = 1,
  onNote?: (note: string) => void,
  clipId = "salt",
): Promise<true | string> {
  stopSpeech();
  const mine = voiceToken;
  const url = CLIPS[clipId];
  if (!url || typeof Audio === "undefined") return "Voice is not available";
  if (!pageText(pageBlocks).trim()) return "Nothing to read";
  const audio = new Audio(url);
  audio.volume = 1;
  audio.preload = "auto";
  audio.playsInline = true;
  audio.playbackRate = rate;
  clip = audio;
  onNote?.("Playing 0:00");
  try {
    await audio.play();
  } catch (error) {
    return error instanceof Error ? error.message : "Voice did not start";
  }
  if (mine !== voiceToken) return "Stopped";
  const timer = window.setInterval(() => {
    if (mine !== voiceToken) return;
    const total = Math.floor(audio.currentTime);
    const minutes = Math.floor(total / 60);
    const seconds = String(total % 60).padStart(2, "0");
    onNote?.(`Playing ${minutes}:${seconds}`);
  }, 250);
  clipTimer = timer;
  await new Promise<void>((resolve) => {
    audio.onended = () => resolve();
    audio.onerror = () => resolve();
  });
  window.clearInterval(timer);
  return mine === voiceToken ? true : "Stopped";
}

export function stopSpeech() {
  voiceToken += 1;
  window.clearInterval(clipTimer);
  if (clip) {
    clip.pause();
    clip.src = "";
    clip = null;
  }
}

export async function shareCard(text: string) {
  const payload = { title: book.title, text, url: window.location.href };
  if (navigator.share) {
    await navigator.share(payload);
    return "shared" as const;
  }
  await navigator.clipboard.writeText(`${book.title}\n${text}`);
  return "copied" as const;
}

export async function cacheVolume(): Promise<boolean> {
  if (typeof caches === "undefined") return false;
  const cache = await caches.open("lightnov-volume");
  await cache.addAll(PLATES);
  return true;
}

export async function volumeIsCached(): Promise<boolean> {
  if (typeof caches === "undefined") return false;
  const cache = await caches.open("lightnov-volume");
  const hit = await cache.match(PLATES[0] ?? "");
  return Boolean(hit);
}

function crc32(data: Uint8Array): number {
  let crc = 0xffffffff;
  for (const byte of data) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit++) {
      crc = crc & 1 ? (crc >>> 1) ^ 0xedb88320 : crc >>> 1;
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function zipStore(files: { name: string; data: Uint8Array }[]): Blob {
  const parts: Uint8Array[] = [];
  const central: Uint8Array[] = [];
  let offset = 0;
  const encoder = new TextEncoder();
  for (const file of files) {
    const name = encoder.encode(file.name);
    const crc = crc32(file.data);
    const local = new Uint8Array(30 + name.length);
    const view = new DataView(local.buffer);
    view.setUint32(0, 0x04034b50, true);
    view.setUint16(4, 20, true);
    view.setUint16(8, 0, true);
    view.setUint32(14, crc, true);
    view.setUint32(18, file.data.length, true);
    view.setUint32(22, file.data.length, true);
    view.setUint16(26, name.length, true);
    local.set(name, 30);
    parts.push(local, file.data);
    const cen = new Uint8Array(46 + name.length);
    const cenView = new DataView(cen.buffer);
    cenView.setUint32(0, 0x02014b50, true);
    cenView.setUint16(4, 20, true);
    cenView.setUint16(6, 20, true);
    cenView.setUint32(16, crc, true);
    cenView.setUint32(20, file.data.length, true);
    cenView.setUint32(24, file.data.length, true);
    cenView.setUint16(28, name.length, true);
    cenView.setUint32(42, offset, true);
    cen.set(name, 46);
    central.push(cen);
    offset += local.length + file.data.length;
  }
  const centralSize = central.reduce((sum, part) => sum + part.length, 0);
  const end = new Uint8Array(22);
  const endView = new DataView(end.buffer);
  endView.setUint32(0, 0x06054b50, true);
  endView.setUint16(8, files.length, true);
  endView.setUint16(10, files.length, true);
  endView.setUint32(12, centralSize, true);
  endView.setUint32(16, offset, true);
  const blobParts: BlobPart[] = [];
  for (const part of parts) blobParts.push(part as BlobPart);
  for (const part of central) blobParts.push(part as BlobPart);
  blobParts.push(end as BlobPart);
  return new Blob(blobParts, { type: "application/epub+zip" });
}

function xhtml(title: string, body: string): Uint8Array {
  const html = `<?xml version="1.0" encoding="utf-8"?>
<html xmlns="http://www.w3.org/1999/xhtml">
<head><title>${title}</title></head>
<body>${body}</body>
</html>`;
  return new TextEncoder().encode(html);
}

export async function downloadEpub() {
  const encoder = new TextEncoder();
  const files: { name: string; data: Uint8Array }[] = [];
  files.push({ name: "mimetype", data: encoder.encode("application/epub+zip") });
  files.push({
    name: "META-INF/container.xml",
    data: encoder.encode(
      `<?xml version="1.0"?><container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container"><rootfiles><rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/></rootfiles></container>`,
    ),
  });
  const imageNames: string[] = [];
  for (const src of PLATES) {
    const response = await fetch(src);
    const buffer = new Uint8Array(await response.arrayBuffer());
    const name = src.split("/").pop() ?? "plate.jpg";
    imageNames.push(name);
    files.push({ name: `OEBPS/images/${name}`, data: buffer });
  }
  const body: string[] = [
    `<h1>${book.title}</h1><p><em>${book.subtitle}</em></p>`,
  ];
  for (const name of imageNames) {
    body.push(`<p><img src="images/${name}" alt="" /></p>`);
  }
  for (const block of blocks) {
    if (block.kind === "chapter") body.push(`<h2>${block.title}</h2>`);
    if (block.kind === "p") body.push(`<p>${block.text}</p>`);
    if (block.kind === "plate") body.push(`<p><em>${block.caption}</em></p>`);
  }
  files.push({ name: "OEBPS/book.xhtml", data: xhtml(book.title, body.join("")) });
  const manifestImages = imageNames
    .map((name) => `<item id="${name}" href="images/${name}" media-type="image/jpeg"/>`)
    .join("");
  files.push({
    name: "OEBPS/content.opf",
    data: encoder.encode(
      `<?xml version="1.0"?><package xmlns="http://www.idpf.org/2007/opf" unique-identifier="uid" version="3.0"><metadata xmlns:dc="http://purl.org/dc/elements/1.1/"><dc:identifier id="uid">lightnov-salt</dc:identifier><dc:title>${book.title}</dc:title><dc:language>en</dc:language></metadata><manifest><item id="book" href="book.xhtml" media-type="application/xhtml+xml"/>${manifestImages}</manifest><spine><itemref idref="book"/></spine></package>`,
    ),
  });
  const blob = zipStore(files);
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "salt-and-second-chances.epub";
  link.click();
  URL.revokeObjectURL(url);
}

export function bumpBadge(active: boolean) {
  const nav = navigator as Navigator & { setAppBadge?: (n?: number) => Promise<void>; clearAppBadge?: () => Promise<void> };
  if (active && nav.setAppBadge) void nav.setAppBadge(1).catch(() => {});
  if (!active && nav.clearAppBadge) void nav.clearAppBadge().catch(() => {});
}
