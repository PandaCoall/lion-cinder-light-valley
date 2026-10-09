export type ImportedChapter = { title: string; body: string };

const CHAPTER_LINE = /^(?:chapter|prologue|epilogue|interlude|afterword)\b.{0,80}$/i;

export function splitChapters(text: string): ImportedChapter[] {
  const lines = text.replace(/\r\n/g, "\n").replace(/\u0000/g, "").split("\n");
  const chunks: { title: string; body: string[] }[] = [];
  let current = { title: "", body: [] as string[] };
  for (const line of lines) {
    const trimmed = line.trim();
    if (CHAPTER_LINE.test(trimmed)) {
      if (current.title || current.body.some((item) => item.trim())) chunks.push(current);
      current = { title: trimmed, body: [] };
    } else {
      current.body.push(line);
    }
  }
  if (current.title || current.body.some((item) => item.trim())) chunks.push(current);
  return chunks
    .map((chunk, index) => ({
      title: chunk.title || (chunks.length > 1 ? `Chapter ${index + 1}` : ""),
      body: chunk.body.join("\n").replace(/\n{3,}/g, "\n\n").trim(),
    }))
    .filter((chunk) => chunk.body || chunk.title);
}

export async function readManuscript(file: File): Promise<string> {
  if (file.size > 20_000_000) throw new Error("That file is over 20 MB. Export a smaller document.");
  const name = file.name.toLowerCase();
  const type = file.type;
  if (name.endsWith(".pdf") || type === "application/pdf") return readPdf(await file.arrayBuffer());
  if (name.endsWith(".docx") || type.includes("wordprocessingml")) return readDocx(await file.arrayBuffer());
  if (name.endsWith(".doc") || type === "application/msword") return readLegacyDoc(await file.arrayBuffer());
  if (name.endsWith(".rtf") || type === "application/rtf") return stripRtf(await file.text());
  return (await file.text()).replace(/^\uFEFF/, "");
}

async function readDocx(buffer: ArrayBuffer): Promise<string> {
  const mammoth = await import("mammoth");
  const input: { arrayBuffer: ArrayBuffer; buffer?: Buffer } = { arrayBuffer: buffer };
  if (typeof Buffer !== "undefined") input.buffer = Buffer.from(buffer);
  const result = await mammoth.extractRawText(input);
  const text = result.value.trim();
  if (!text) throw new Error("That Word file had no readable text.");
  return text;
}

async function readPdf(buffer: ArrayBuffer): Promise<string> {
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
  const options: { data: Uint8Array; disableWorker?: boolean } = { data: new Uint8Array(buffer) };
  if (typeof window === "undefined") options.disableWorker = true;
  else pdfjs.GlobalWorkerOptions.workerSrc = "/vendor/pdf.worker.min.mjs";
  const doc = await pdfjs.getDocument(options).promise;
  const pages: string[] = [];
  for (let number = 1; number <= doc.numPages; number += 1) {
    const page = await doc.getPage(number);
    const content = await page.getTextContent();
    const lines: string[] = [];
    let line = "";
    let top: number | null = null;
    for (const item of content.items) {
      if (!("str" in item)) continue;
      const y = item.transform[5] ?? 0;
      if (top !== null && Math.abs(y - top) > 2) {
        lines.push(line.trimEnd());
        line = "";
      }
      top = y;
      line += item.str;
    }
    if (line.trim()) lines.push(line.trimEnd());
    const pageText = lines.join("\n").trim();
    if (pageText) pages.push(pageText);
  }
  const text = pages.join("\n\n").trim();
  if (!text) throw new Error("That PDF had no readable text. If it is a scan, export it as Word first.");
  return text;
}

async function readLegacyDoc(buffer: ArrayBuffer): Promise<string> {
  const bytes = new Uint8Array(buffer);
  const zip = bytes[0] === 0x50 && bytes[1] === 0x4b;
  if (zip) return readDocx(buffer);
  const text = legacyDocText(bytes);
  if (text.length < 20) {
    throw new Error("This is an older Word file. In Word, use Save As and choose .docx, then upload that.");
  }
  return text;
}

function legacyDocText(bytes: Uint8Array): string {
  const pieces: string[] = [];
  let run = "";
  const keep = (code: number) => (code >= 32 && code <= 126) || code === 10 || code === 13 || (code >= 160 && code <= 255) || code > 255;
  for (let index = 0; index + 1 < bytes.length; index += 2) {
    const code = bytes[index]! | (bytes[index + 1]! << 8);
    if (keep(code) && code !== 0) {
      run += String.fromCharCode(code);
    } else if (run.trim().length > 24) {
      pieces.push(run.trim());
      run = "";
    } else {
      run = "";
    }
  }
  if (run.trim().length > 24) pieces.push(run.trim());
  return pieces.join("\n\n").replace(/[^\S\n]{2,}/g, " ").trim();
}

function stripRtf(source: string): string {
  return source
    .replace(/\\par[d]?/g, "\n")
    .replace(/\\'[0-9a-fA-F]{2}/g, " ")
    .replace(/\\[a-z]+-?\d* ?/gi, "")
    .replace(/[{}]/g, "")
    .trim();
}
