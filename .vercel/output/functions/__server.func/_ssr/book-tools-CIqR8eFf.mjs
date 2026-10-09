import { b as blocks, x as book } from "./router-CNRKipda.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/book-tools-CIqR8eFf.js
var PLATES = [
	"/plates/cover.jpg",
	"/plates/portrait.jpg",
	"/plates/keeper.jpg",
	"/plates/street.jpg"
];
function wordCount() {
	return blocks.reduce((sum, block) => {
		if (block.kind !== "p") return sum;
		return sum + block.text.split(/\s+/).filter(Boolean).length;
	}, 0);
}
function plateCount() {
	return blocks.filter((block) => block.kind === "plate").length;
}
function minutesToNextPlate(anchor) {
	let words = 0;
	for (let index = anchor; index < blocks.length; index++) {
		const block = blocks[index];
		if (!block) continue;
		if (index !== anchor && block.kind === "plate") break;
		if (block.kind === "p") words += block.text.split(/\s+/).filter(Boolean).length;
	}
	return Math.max(1, Math.round(words / 220));
}
function nearestPlate(anchor) {
	for (let index = anchor; index >= 0; index--) {
		const block = blocks[index];
		if (block?.kind === "plate") return block;
	}
	const first = blocks.find((block) => block.kind === "plate");
	return first && first.kind === "plate" ? first : null;
}
function pageText(pageBlocks) {
	return pageBlocks.map((block) => {
		if (block.kind === "p") return block.text;
		if (block.kind === "chapter") return block.title;
		if (block.kind === "plate") return block.caption;
		return "";
	}).filter(Boolean).join(" ");
}
var voiceToken = 0;
var clip = null;
var clipTimer = 0;
var CLIPS = {
	salt: "/audio/salt.mp3",
	errand: "/audio/errand.mp3",
	shirt: "/audio/shirt.mp3"
};
function setSpeechRate(rate) {
	if (clip) clip.playbackRate = rate;
}
async function speakBlocks(pageBlocks, rate = 1, onNote, clipId = "salt") {
	stopSpeech();
	const mine = voiceToken;
	const url = CLIPS[clipId];
	if (!url || typeof Audio === "undefined") return "Voice is not available";
	if (!pageText(pageBlocks).trim()) return "Nothing to read";
	const audio = new Audio(url);
	audio.volume = 1;
	audio.preload = "auto";
	audio.setAttribute("playsinline", "true");
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
	await new Promise((resolve) => {
		audio.onended = () => resolve();
		audio.onerror = () => resolve();
	});
	window.clearInterval(timer);
	return mine === voiceToken ? true : "Stopped";
}
function stopSpeech() {
	voiceToken += 1;
	window.clearInterval(clipTimer);
	if (clip) {
		clip.pause();
		clip.src = "";
		clip = null;
	}
}
async function cacheVolume() {
	if (typeof caches === "undefined") return false;
	await (await caches.open("lightnov-volume")).addAll(PLATES);
	return true;
}
function crc32(data) {
	let crc = 4294967295;
	for (const byte of data) {
		crc ^= byte;
		for (let bit = 0; bit < 8; bit++) crc = crc & 1 ? crc >>> 1 ^ 3988292384 : crc >>> 1;
	}
	return (crc ^ 4294967295) >>> 0;
}
function zipStore(files) {
	const parts = [];
	const central = [];
	let offset = 0;
	const encoder = new TextEncoder();
	for (const file of files) {
		const name = encoder.encode(file.name);
		const crc = crc32(file.data);
		const local = new Uint8Array(30 + name.length);
		const view = new DataView(local.buffer);
		view.setUint32(0, 67324752, true);
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
		cenView.setUint32(0, 33639248, true);
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
	const end = /* @__PURE__ */ new Uint8Array(22);
	const endView = new DataView(end.buffer);
	endView.setUint32(0, 101010256, true);
	endView.setUint16(8, files.length, true);
	endView.setUint16(10, files.length, true);
	endView.setUint32(12, centralSize, true);
	endView.setUint32(16, offset, true);
	const blobParts = [];
	for (const part of parts) blobParts.push(part);
	for (const part of central) blobParts.push(part);
	blobParts.push(end);
	return new Blob(blobParts, { type: "application/epub+zip" });
}
function xhtml(title, body) {
	const html = `<?xml version="1.0" encoding="utf-8"?>
<html xmlns="http://www.w3.org/1999/xhtml">
<head><title>${title}</title></head>
<body>${body}</body>
</html>`;
	return new TextEncoder().encode(html);
}
async function downloadEpub() {
	const encoder = new TextEncoder();
	const files = [];
	files.push({
		name: "mimetype",
		data: encoder.encode("application/epub+zip")
	});
	files.push({
		name: "META-INF/container.xml",
		data: encoder.encode(`<?xml version="1.0"?><container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container"><rootfiles><rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/></rootfiles></container>`)
	});
	const imageNames = [];
	for (const src of PLATES) {
		const response = await fetch(src);
		const buffer = new Uint8Array(await response.arrayBuffer());
		const name = src.split("/").pop() ?? "plate.jpg";
		imageNames.push(name);
		files.push({
			name: `OEBPS/images/${name}`,
			data: buffer
		});
	}
	const body = [`<h1>${book.title}</h1><p><em>${book.subtitle}</em></p>`];
	for (const name of imageNames) body.push(`<p><img src="images/${name}" alt="" /></p>`);
	for (const block of blocks) {
		if (block.kind === "chapter") body.push(`<h2>${block.title}</h2>`);
		if (block.kind === "p") body.push(`<p>${block.text}</p>`);
		if (block.kind === "plate") body.push(`<p><em>${block.caption}</em></p>`);
	}
	files.push({
		name: "OEBPS/book.xhtml",
		data: xhtml(book.title, body.join(""))
	});
	const manifestImages = imageNames.map((name) => `<item id="${name}" href="images/${name}" media-type="image/jpeg"/>`).join("");
	files.push({
		name: "OEBPS/content.opf",
		data: encoder.encode(`<?xml version="1.0"?><package xmlns="http://www.idpf.org/2007/opf" unique-identifier="uid" version="3.0"><metadata xmlns:dc="http://purl.org/dc/elements/1.1/"><dc:identifier id="uid">lightnov-salt</dc:identifier><dc:title>${book.title}</dc:title><dc:language>en</dc:language></metadata><manifest><item id="book" href="book.xhtml" media-type="application/xhtml+xml"/>${manifestImages}</manifest><spine><itemref idref="book"/></spine></package>`)
	});
	const blob = zipStore(files);
	const url = URL.createObjectURL(blob);
	const link = document.createElement("a");
	link.href = url;
	link.download = "salt-and-second-chances.epub";
	link.click();
	URL.revokeObjectURL(url);
}
//#endregion
export { pageText as a, speakBlocks as c, nearestPlate as i, stopSpeech as l, downloadEpub as n, plateCount as o, minutesToNextPlate as r, setSpeechRate as s, cacheVolume as t, wordCount as u };
