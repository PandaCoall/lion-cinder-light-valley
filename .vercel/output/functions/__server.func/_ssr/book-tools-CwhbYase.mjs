import { b as blocks, x as book } from "./router-BFzemKAe.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/book-tools-CwhbYase.js
var SPEED = {
	calm: .94,
	warm: .96,
	tense: 1.04,
	angry: 1.08,
	sad: .86,
	whisper: .84
};
var CAST = [
	"af_bella",
	"am_michael",
	"bf_emma",
	"bm_george",
	"af_sarah",
	"am_adam"
];
var KNOWN = {
	lioren: "am_michael",
	maris: "bf_emma",
	he: "am_michael",
	she: "bf_emma"
};
function performChapter(text, limit = 4) {
	const clean = text.replace(/\s+/g, " ").trim();
	if (!clean) return [];
	const beats = [];
	let lastSpeaker = "she";
	const parts = splitQuoted(clean);
	for (let index = 0; index < parts.length; index += 1) {
		const part = parts[index];
		if (!part) continue;
		if (part.kind === "dialogue") {
			const speaker = nameFrom(part.before, part.after) ?? lastSpeaker;
			lastSpeaker = speaker;
			const emotion = detectEmotion(`${part.text} ${part.before} ${part.after}`);
			beats.push(beat("dialogue", speaker, part.text, emotion, voiceFor(speaker)));
		} else {
			const narration = parts[index + 1]?.kind === "dialogue" ? stripCue(part.text) : part.text;
			for (const sentence of sentences(narration)) {
				const emotion = detectEmotion(sentence);
				beats.push(beat("narrator", "Narrator", sentence, emotion, "af_heart"));
				if (beats.length >= limit) return beats;
			}
		}
		if (beats.length >= limit) break;
	}
	return beats.slice(0, limit);
}
function beat(role, speaker, text, emotion, voice) {
	return {
		role,
		speaker,
		text,
		emotion,
		voice,
		speed: SPEED[emotion]
	};
}
function splitQuoted(text) {
	const re = /[“"]([^”"]+)[”"]/g;
	const parts = [];
	let last = 0;
	for (const match of text.matchAll(re)) {
		const index = match.index ?? 0;
		const before = text.slice(last, index);
		if (before.trim()) parts.push({
			kind: "narration",
			text: before.trim(),
			before: "",
			after: ""
		});
		const afterStart = index + match[0].length;
		parts.push({
			kind: "dialogue",
			text: match[1]?.trim() ?? "",
			before: before.slice(-64),
			after: text.slice(afterStart, afterStart + 64)
		});
		last = afterStart;
	}
	const rest = text.slice(last).trim();
	if (rest) parts.push({
		kind: "narration",
		text: rest,
		before: "",
		after: ""
	});
	if (!parts.length) parts.push({
		kind: "narration",
		text,
		before: "",
		after: ""
	});
	return parts.filter((part) => part.text);
}
function pronoun(name) {
	return /^(he|she)$/i.test(name) ? name.toLowerCase() : name;
}
function sentences(text) {
	return text.split(/(?<=[.!?])\s+/).map((sentence) => sentence.trim()).filter((sentence) => sentence.length > 1);
}
function stripCue(text) {
	return text.replace(/\s*[A-Za-z]+\s+(?:said|whispered|asked|cried|shouted|muttered|snapped)\s*[:,]?\s*$/i, "").trim();
}
function nameFrom(before, after) {
	const afterName = after.match(/^\s*(?:said|whispered|asked|cried|shouted|muttered|snapped)\s+([A-Z][a-z]+)/);
	if (afterName?.[1]) return pronoun(afterName[1]);
	const beforeName = before.match(/([A-Z][a-z]+)\s+(?:said|whispered|asked|cried|shouted|muttered|snapped)\s*[:,]?\s*$/);
	if (beforeName?.[1]) return pronoun(beforeName[1]);
	if (/\b(she|her)\b/i.test(`${before} ${after}`)) return "she";
	if (/\b(he|him|his)\b/i.test(`${before} ${after}`)) return "he";
	return null;
}
function detectEmotion(text) {
	const hay = text.toLowerCase();
	if (/whisper|hush|murmur|under her breath|under his breath/.test(hay)) return "whisper";
	if (/shout|snap|furious|hate|damn|rage|scream|snarl/.test(hay)) return "angry";
	if (/cry|grief|sorry|tear|mourn|sob|ache/.test(hay)) return "sad";
	if (/smile|love|gentle|laugh|warm|kiss|soft/.test(hay)) return "warm";
	if (/sudden|danger|blood|fear|knife|ran\b|dark|!/.test(hay)) return "tense";
	return "calm";
}
function voiceFor(name) {
	const key = name.toLowerCase();
	if (KNOWN[key]) return KNOWN[key];
	let hash = 0;
	for (const char of key) hash = (hash + char.charCodeAt(0)) % CAST.length;
	return CAST[hash] ?? "af_bella";
}
var engine = null;
var loading = null;
var context = null;
var players = [];
function primeVoice() {
	if (typeof window === "undefined") return;
	const Ctx = window.AudioContext ?? window.webkitAudioContext;
	if (!Ctx) return;
	if (!context) context = new Ctx();
	context.resume();
}
function stopVoice() {
	for (const player of players) try {
		player.stop();
	} catch {}
	players.length = 0;
}
async function loadEngine(onNote) {
	if (engine) return engine;
	if (!loading) {
		onNote?.("Loading the voice. First time takes a minute.");
		loading = import("../_libs/_.mjs").then((mod) => mod.KokoroTTS.from_pretrained("onnx-community/Kokoro-82M-v1.0-ONNX", {
			dtype: "q8",
			device: "wasm"
		}));
	}
	try {
		engine = await loading;
		return engine;
	} catch (error) {
		loading = null;
		throw error;
	}
}
function schedule(ctx, spoken, when, beat) {
	const buffer = ctx.createBuffer(1, spoken.audio.length, spoken.sampling_rate);
	buffer.copyToChannel(spoken.audio, 0);
	const source = ctx.createBufferSource();
	source.buffer = buffer;
	const highpass = ctx.createBiquadFilter();
	highpass.type = "highpass";
	highpass.frequency.value = 80;
	const presence = ctx.createBiquadFilter();
	presence.type = "peaking";
	presence.frequency.value = beat.emotion === "whisper" ? 1800 : 2800;
	presence.gain.value = beat.emotion === "whisper" ? -1 : 1.4;
	presence.Q.value = .7;
	const compressor = ctx.createDynamicsCompressor();
	compressor.threshold.value = -18;
	compressor.knee.value = 8;
	compressor.ratio.value = 2.4;
	compressor.attack.value = .004;
	compressor.release.value = .22;
	const gain = ctx.createGain();
	gain.gain.value = beat.emotion === "whisper" ? .58 : beat.emotion === "angry" ? .92 : .8;
	source.connect(highpass).connect(presence).connect(compressor).connect(gain).connect(ctx.destination);
	source.start(when);
	players.push(source);
	return when + buffer.duration + (beat.role === "dialogue" ? .16 : .1);
}
async function playBeats(beats, rate, onNote, alive = () => true) {
	primeVoice();
	if (!context) return false;
	await context.resume();
	const speaker = await loadEngine(onNote);
	if (!alive()) return false;
	let when = context.currentTime + .05;
	for (const beat of beats) {
		if (!alive()) {
			stopVoice();
			return false;
		}
		onNote?.(beat.role === "dialogue" ? `${beat.speaker} · ${beat.emotion}` : `Narrator · ${beat.emotion}`);
		const spoken = await speaker.generate(beat.text, {
			voice: beat.voice,
			speed: Number((beat.speed * rate).toFixed(2))
		});
		if (!alive()) {
			stopVoice();
			return false;
		}
		when = Math.max(when, context.currentTime + .02);
		when = schedule(context, spoken, when, beat);
	}
	return true;
}
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
function pageSpeech(pageBlocks) {
	const chunks = [];
	for (const block of pageBlocks) {
		if (block.kind === "plate") chunks.push(`Illustration. ${block.caption}`);
		if (block.kind === "p") chunks.push(block.text);
		if (block.kind === "chapter") chunks.push(block.title);
		if (block.kind === "afterword") chunks.push("Afterword.");
	}
	return chunks.join(" ");
}
async function speakBlocks(pageBlocks, rate = 1, onNote) {
	stopSpeech();
	const mine = voiceToken;
	primeVoice();
	const text = pageSpeech(pageBlocks);
	if (!text.trim()) return false;
	const beats = performChapter(text, 4);
	if (!beats.length) return false;
	try {
		return await playBeats(beats, rate, onNote, () => mine === voiceToken);
	} catch {
		return false;
	}
}
function stopSpeech() {
	voiceToken += 1;
	stopVoice();
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
export { pageText as a, stopSpeech as c, nearestPlate as i, wordCount as l, downloadEpub as n, plateCount as o, minutesToNextPlate as r, speakBlocks as s, cacheVolume as t };
