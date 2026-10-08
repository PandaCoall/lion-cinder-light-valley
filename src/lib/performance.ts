export type Emotion = "calm" | "warm" | "tense" | "angry" | "sad" | "whisper";

export type Beat = {
  role: "narrator" | "dialogue";
  speaker: string;
  text: string;
  emotion: Emotion;
  voice: string;
  speed: number;
};

const SPEED: Record<Emotion, number> = {
  calm: 0.94,
  warm: 0.96,
  tense: 1.04,
  angry: 1.08,
  sad: 0.86,
  whisper: 0.84,
};

const CAST = ["af_bella", "am_michael", "bf_emma", "bm_george", "af_sarah", "am_adam"] as const;

const KNOWN: Record<string, string> = {
  lioren: "am_michael",
  maris: "bf_emma",
  he: "am_michael",
  she: "bf_emma",
};

export function performChapter(text: string, limit = 4): Beat[] {
  const clean = text.replace(/\s+/g, " ").trim();
  if (!clean) return [];
  const beats: Beat[] = [];
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

function beat(role: Beat["role"], speaker: string, text: string, emotion: Emotion, voice: string): Beat {
  return { role, speaker, text, emotion, voice, speed: SPEED[emotion] };
}

function splitQuoted(text: string) {
  const re = /[“"]([^”"]+)[”"]/g;
  const parts: { kind: "dialogue" | "narration"; text: string; before: string; after: string }[] = [];
  let last = 0;
  for (const match of text.matchAll(re)) {
    const index = match.index ?? 0;
    const before = text.slice(last, index);
    if (before.trim()) parts.push({ kind: "narration", text: before.trim(), before: "", after: "" });
    const afterStart = index + match[0].length;
    parts.push({
      kind: "dialogue",
      text: match[1]?.trim() ?? "",
      before: before.slice(-64),
      after: text.slice(afterStart, afterStart + 64),
    });
    last = afterStart;
  }
  const rest = text.slice(last).trim();
  if (rest) parts.push({ kind: "narration", text: rest, before: "", after: "" });
  if (!parts.length) parts.push({ kind: "narration", text, before: "", after: "" });
  return parts.filter((part) => part.text);
}

function pronoun(name: string) {
  return /^(he|she)$/i.test(name) ? name.toLowerCase() : name;
}

function sentences(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length > 1);
}

function stripCue(text: string) {
  return text
    .replace(/\s*[A-Za-z]+\s+(?:said|whispered|asked|cried|shouted|muttered|snapped)\s*[:,]?\s*$/i, "")
    .trim();
}

function nameFrom(before: string, after: string): string | null {
  const afterName = after.match(/^\s*(?:said|whispered|asked|cried|shouted|muttered|snapped)\s+([A-Z][a-z]+)/);
  if (afterName?.[1]) return pronoun(afterName[1]);
  const beforeName = before.match(/([A-Z][a-z]+)\s+(?:said|whispered|asked|cried|shouted|muttered|snapped)\s*[:,]?\s*$/);
  if (beforeName?.[1]) return pronoun(beforeName[1]);
  if (/\b(she|her)\b/i.test(`${before} ${after}`)) return "she";
  if (/\b(he|him|his)\b/i.test(`${before} ${after}`)) return "he";
  return null;
}

export function detectEmotion(text: string): Emotion {
  const hay = text.toLowerCase();
  if (/whisper|hush|murmur|under her breath|under his breath/.test(hay)) return "whisper";
  if (/shout|snap|furious|hate|damn|rage|scream|snarl/.test(hay)) return "angry";
  if (/cry|grief|sorry|tear|mourn|sob|ache/.test(hay)) return "sad";
  if (/smile|love|gentle|laugh|warm|kiss|soft/.test(hay)) return "warm";
  if (/sudden|danger|blood|fear|knife|ran\b|dark|!/.test(hay)) return "tense";
  return "calm";
}

export function voiceFor(name: string): string {
  const key = name.toLowerCase();
  if (KNOWN[key]) return KNOWN[key];
  let hash = 0;
  for (const char of key) hash = (hash + char.charCodeAt(0)) % CAST.length;
  return CAST[hash] ?? "af_bella";
}
