// Records each published chapter with Kokoro, then the app plays the joined
// file in src/lib/audiobook-data.ts. Re-running this only writes the chapter
// mp3s and public/audio/audiobook.json; join them and refresh that module
// before shipping, or Listen will not find the new cues.
import { mkdirSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { KokoroTTS } from "kokoro-js";
import { blocks } from "../src/data/volume.ts";

const outDir = "/workspace/public/audio";
mkdirSync(outDir, { recursive: true });

const books = [
  {
    id: "salt",
    voice: "af_heart",
    speed: 0.94,
    chapters: chaptersFrom(blocks, ["pier", "letter"]),
  },
  {
    id: "errand",
    voice: "bf_emma",
    speed: 0.95,
    chapters: [
      {
        id: "errand",
        title: "No address",
        lines: [
          { match: "No address", speak: "No address." },
          {
            match:
              "The wax was warm. Under his thumb the seal gave, not breaking, just acknowledging him, the way a door acknowledges a key it has decided to trust.",
            speak:
              "The wax was warm. Under his thumb the seal gave, not breaking, just acknowledging him, the way a door acknowledges a key it has decided to trust.",
          },
          {
            match:
              "“If I knew who it was for,” she said, “I would not need someone who can hear the endings that got lost.” The glass eye tracked a wave that was not in the room.",
            speak:
              "\"If I knew who it was for,\" she said, \"I would not need someone who can hear the endings that got lost.\" The glass eye tracked a wave that was not in the room.",
          },
        ],
      },
    ],
  },
  {
    id: "shirt",
    voice: "af_bella",
    speed: 0.92,
    chapters: [
      {
        id: "shirt",
        title: "The last fold",
        lines: [
          { match: "The last fold", speak: "The last fold." },
          {
            match:
              "The shirt was not dirty. She folded it anyway, because the person it belonged to had said he would return, and she had decided to believe him one more night.",
            speak:
              "The shirt was not dirty. She folded it anyway, because the person it belonged to had said he would return, and she had decided to believe him one more night.",
          },
          {
            match: "Two promises pulled at the same sleeve. She kept folding. The city, rude as ever, kept both of them possible.",
            speak: "Two promises pulled at the same sleeve. She kept folding. The city, rude as ever, kept both of them possible.",
          },
        ],
      },
    ],
  },
];

function chaptersFrom(source, ids) {
  const wanted = new Set(ids);
  const chapters = [];
  let current = null;
  for (const block of source) {
    if (block.kind === "chapter") {
      current = wanted.has(block.id)
        ? {
            id: block.id,
            title: block.title,
            lines: [{ match: block.title, speak: `${block.kicker}. ${block.title}.` }],
          }
        : null;
      if (current) chapters.push(current);
      continue;
    }
    if (!current) continue;
    if (block.kind === "p") current.lines.push({ match: block.text, speak: plain(block.text) });
    if (block.kind === "afterword" || block.kind === "end") current = null;
  }
  return chapters;
}

function plain(text) {
  return text
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/—/g, ", ")
    .replace(/…/g, "...")
    .replace(/\s+/g, " ")
    .trim();
}

function pieces(text) {
  const clean = plain(text);
  if (clean.length <= 360) return [clean];
  const parts = clean.match(/[^.!?]+[.!?]+(?:["']+)?|[^.!?]+$/g) ?? [clean];
  const chunks = [];
  let buf = "";
  for (const part of parts) {
    if ((buf + part).trim().length > 360 && buf.trim()) {
      chunks.push(buf.trim());
      buf = part;
    } else buf += part;
  }
  if (buf.trim()) chunks.push(buf.trim());
  return chunks.length ? chunks : [clean];
}

function samplesOf(audio) {
  const raw = audio?.audio;
  const rate = audio?.sampling_rate || audio?.sample_rate || 24000;
  if (raw instanceof Float32Array) return { samples: raw, rate };
  if (ArrayBuffer.isView(raw)) return { samples: Float32Array.from(raw), rate };
  const wav = Buffer.from(audio.toWav());
  return parseWav(wav);
}

function parseWav(wav) {
  const rate = wav.readUInt32LE(24);
  const data = wav.subarray(44);
  const samples = new Float32Array(data.length / 2);
  for (let i = 0; i < samples.length; i++) samples[i] = data.readInt16LE(i * 2) / 32768;
  return { samples, rate };
}

function encodeWav(samples, rate) {
  const buffer = Buffer.alloc(44 + samples.length * 2);
  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(36 + samples.length * 2, 4);
  buffer.write("WAVE", 8);
  buffer.write("fmt ", 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(1, 22);
  buffer.writeUInt32LE(rate, 24);
  buffer.writeUInt32LE(rate * 2, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write("data", 36);
  buffer.writeUInt32LE(samples.length * 2, 40);
  for (let i = 0; i < samples.length; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    buffer.writeInt16LE(s < 0 ? s * 0x8000 : s * 0x7fff, 44 + i * 2);
  }
  return buffer;
}

async function one(tts, chunk, voice, speed) {
  try {
    const audio = await tts.generate(chunk, { voice, speed });
    return samplesOf(audio);
  } catch (error) {
    if (chunk.length < 80) throw error;
    const mid = chunk.lastIndexOf(" ", Math.floor(chunk.length / 2));
    const cut = mid > 20 ? mid : Math.floor(chunk.length / 2);
    const left = await one(tts, chunk.slice(0, cut).trim(), voice, speed);
    const right = await one(tts, chunk.slice(cut).trim(), voice, speed);
    const samples = new Float32Array(left.samples.length + right.samples.length);
    samples.set(left.samples, 0);
    samples.set(right.samples, left.samples.length);
    return { samples, rate: left.rate };
  }
}

async function say(tts, text, voice, speed) {
  const chunks = pieces(text);
  const parts = [];
  let rate = 24000;
  for (const chunk of chunks) {
    const part = await one(tts, chunk, voice, speed);
    rate = part.rate;
    parts.push(part.samples);
  }
  const gap = Math.round(rate * 0.06);
  const total = parts.reduce((sum, samples) => sum + samples.length, 0) + gap * Math.max(0, parts.length - 1);
  const samples = new Float32Array(total);
  let offset = 0;
  for (const part of parts) {
    samples.set(part, offset);
    offset += part.length + gap;
  }
  return { samples, rate };
}

const tts = await KokoroTTS.from_pretrained("onnx-community/Kokoro-82M-v1.0-ONNX", {
  dtype: "q8",
  device: "cpu",
});

const manifest = {};
for (const book of books) {
  manifest[book.id] = { chapters: [] };
  for (const chapter of book.chapters) {
    console.log("chapter", book.id, chapter.id, chapter.lines.length);
    const rendered = [];
    let rate = 24000;
    for (const line of chapter.lines) {
      const spoken = await say(tts, line.speak, book.voice, book.speed);
      rate = spoken.rate;
      rendered.push(spoken.samples);
      console.log(" ", rendered.length, line.speak.slice(0, 48));
    }
    const gap = Math.round(rate * 0.36);
    const lead = Math.round(rate * 0.12);
    const total = lead + rendered.reduce((sum, samples) => sum + samples.length + gap, 0);
    const mixed = new Float32Array(total);
    const cues = [];
    let offset = lead;
    for (const samples of rendered) {
      cues.push(Math.round((offset / rate) * 100) / 100);
      mixed.set(samples, offset);
      offset += samples.length + gap;
    }
    const wavPath = `/tmp/${book.id}-${chapter.id}.wav`;
    const mp3Name = `${book.id}-${chapter.id}.mp3`;
    writeFileSync(wavPath, encodeWav(mixed, rate));
    const encoded = spawnSync(
      "ffmpeg",
      [
        "-y",
        "-i",
        wavPath,
        "-ac",
        "1",
        "-ar",
        "24000",
        "-codec:a",
        "libmp3lame",
        "-b:a",
        "64k",
        "-af",
        "highpass=f=70,acompressor=threshold=-18dB:ratio=3:attack=5:release=80,volume=1.6",
        `${outDir}/${mp3Name}`,
      ],
      { stdio: "inherit" },
    );
    if (encoded.status !== 0) process.exit(encoded.status ?? 1);
    manifest[book.id].chapters.push({
      id: chapter.id,
      title: chapter.title,
      src: `/audio/${mp3Name}`,
      lines: chapter.lines.map((line, index) => ({ text: line.match, at: cues[index] })),
    });
    console.log("wrote", mp3Name, "seconds", Math.round(total / rate));
  }
}

writeFileSync(`${outDir}/audiobook.json`, JSON.stringify(manifest));
console.log("manifest", `${outDir}/audiobook.json`);
