import type { Beat } from "@/lib/performance";

type Spoken = { audio: Float32Array; sampling_rate: number };
type Engine = {
  generate: (text: string, options?: { voice?: string; speed?: number }) => Promise<Spoken>;
};

let engine: Engine | null = null;
let loading: Promise<Engine> | null = null;
let context: AudioContext | null = null;
const players: AudioBufferSourceNode[] = [];

export function primeVoice() {
  if (typeof window === "undefined") return;
  const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctx) return;
  if (!context) context = new Ctx();
  void context.resume();
}

export function stopVoice() {
  for (const player of players) {
    try {
      player.stop();
    } catch {
      /* already finished */
    }
  }
  players.length = 0;
}

async function loadEngine(onNote?: (note: string) => void): Promise<Engine> {
  if (engine) return engine;
  if (!loading) {
    onNote?.("Loading the voice. First time takes a minute.");
    loading = import("kokoro-web").then((mod: { KokoroTTS: { from_pretrained: (id: string, options: { dtype: "q8"; device: "wasm" }) => Promise<Engine> } }) =>
      mod.KokoroTTS.from_pretrained("onnx-community/Kokoro-82M-v1.0-ONNX", {
        dtype: "q8",
        device: "wasm",
      }),
    );
  }
  try {
    engine = await loading;
    return engine;
  } catch (error) {
    loading = null;
    throw error;
  }
}

function schedule(ctx: AudioContext, spoken: Spoken, when: number, beat: Beat) {
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
  presence.Q.value = 0.7;
  const compressor = ctx.createDynamicsCompressor();
  compressor.threshold.value = -18;
  compressor.knee.value = 8;
  compressor.ratio.value = 2.4;
  compressor.attack.value = 0.004;
  compressor.release.value = 0.22;
  const gain = ctx.createGain();
  gain.gain.value = beat.emotion === "whisper" ? 0.58 : beat.emotion === "angry" ? 0.92 : 0.8;
  source.connect(highpass).connect(presence).connect(compressor).connect(gain).connect(ctx.destination);
  source.start(when);
  players.push(source);
  return when + buffer.duration + (beat.role === "dialogue" ? 0.16 : 0.1);
}

export async function playBeats(
  beats: Beat[],
  rate: number,
  onNote?: (note: string) => void,
  alive: () => boolean = () => true,
): Promise<boolean> {
  primeVoice();
  if (!context) return false;
  await context.resume();
  const speaker = await loadEngine(onNote);
  if (!alive()) return false;
  let when = context.currentTime + 0.05;
  for (const beat of beats) {
    if (!alive()) {
      stopVoice();
      return false;
    }
    onNote?.(beat.role === "dialogue" ? `${beat.speaker} · ${beat.emotion}` : `Narrator · ${beat.emotion}`);
    const spoken = await speaker.generate(beat.text, { voice: beat.voice, speed: Number((beat.speed * rate).toFixed(2)) });
    if (!alive()) {
      stopVoice();
      return false;
    }
    when = Math.max(when, context.currentTime + 0.02);
    when = schedule(context, spoken, when, beat);
  }
  return true;
}
