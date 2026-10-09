import { o as __toESM } from "../_runtime.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/manuscript-Bn5xcb8X.js
var CHAPTER_LINE = /^(?:chapter|prologue|epilogue|interlude|afterword)\b.{0,80}$/i;
function splitChapters(text) {
	const lines = text.replace(/\r\n/g, "\n").replace(/\u0000/g, "").split("\n");
	const chunks = [];
	let current = {
		title: "",
		body: []
	};
	for (const line of lines) {
		const trimmed = line.trim();
		if (CHAPTER_LINE.test(trimmed)) {
			if (current.title || current.body.some((item) => item.trim())) chunks.push(current);
			current = {
				title: trimmed,
				body: []
			};
		} else current.body.push(line);
	}
	if (current.title || current.body.some((item) => item.trim())) chunks.push(current);
	return chunks.map((chunk, index) => ({
		title: chunk.title || (chunks.length > 1 ? `Chapter ${index + 1}` : ""),
		body: chunk.body.join("\n").replace(/\n{3,}/g, "\n\n").trim()
	})).filter((chunk) => chunk.body || chunk.title);
}
async function readManuscript(file) {
	if (file.size > 2e7) throw new Error("That file is over 20 MB. Export a smaller document.");
	const name = file.name.toLowerCase();
	const type = file.type;
	if (name.endsWith(".pdf") || type === "application/pdf") return readPdf(await file.arrayBuffer());
	if (name.endsWith(".docx") || type.includes("wordprocessingml")) return readDocx(await file.arrayBuffer());
	if (name.endsWith(".doc") || type === "application/msword") return readLegacyDoc(await file.arrayBuffer());
	if (name.endsWith(".rtf") || type === "application/rtf") return stripRtf(await file.text());
	return (await file.text()).replace(/^\uFEFF/, "");
}
async function readDocx(buffer) {
	const mammoth = await import("../_libs/mammoth+xmlbuilder.mjs").then((n) => /* @__PURE__ */ __toESM(n.t()));
	const input = { arrayBuffer: buffer };
	if (typeof Buffer !== "undefined") input.buffer = Buffer.from(buffer);
	const text = (await mammoth.extractRawText(input)).value.trim();
	if (!text) throw new Error("That Word file had no readable text.");
	return text;
}
async function readPdf(buffer) {
	const pdfjs = await import("../_libs/pdfjs-dist.mjs").then((n) => n.t);
	const options = { data: new Uint8Array(buffer) };
	if (typeof window === "undefined") options.disableWorker = true;
	else pdfjs.GlobalWorkerOptions.workerSrc = "/vendor/pdf.worker.min.mjs";
	const doc = await pdfjs.getDocument(options).promise;
	const pages = [];
	for (let number = 1; number <= doc.numPages; number += 1) {
		const content = await (await doc.getPage(number)).getTextContent();
		const lines = [];
		let line = "";
		let top = null;
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
async function readLegacyDoc(buffer) {
	const bytes = new Uint8Array(buffer);
	if (bytes[0] === 80 && bytes[1] === 75) return readDocx(buffer);
	const text = legacyDocText(bytes);
	if (text.length < 20) throw new Error("This is an older Word file. In Word, use Save As and choose .docx, then upload that.");
	return text;
}
function legacyDocText(bytes) {
	const pieces = [];
	let run = "";
	const keep = (code) => code >= 32 && code <= 126 || code === 10 || code === 13 || code >= 160 && code <= 255 || code > 255;
	for (let index = 0; index + 1 < bytes.length; index += 2) {
		const code = bytes[index] | bytes[index + 1] << 8;
		if (keep(code) && code !== 0) run += String.fromCharCode(code);
		else if (run.trim().length > 24) {
			pieces.push(run.trim());
			run = "";
		} else run = "";
	}
	if (run.trim().length > 24) pieces.push(run.trim());
	return pieces.join("\n\n").replace(/[^\S\n]{2,}/g, " ").trim();
}
function stripRtf(source) {
	return source.replace(/\\par[d]?/g, "\n").replace(/\\'[0-9a-fA-F]{2}/g, " ").replace(/\\[a-z]+-?\d* ?/gi, "").replace(/[{}]/g, "").trim();
}
//#endregion
export { splitChapters as n, readManuscript as t };
