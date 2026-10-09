import { writeFileSync, mkdirSync } from "node:fs";
import { KokoroTTS } from "kokoro-js";

const lines = [
  ["salt", "af_heart", 0.94, "The tide had come in wrong. Lioren Hale knew the sound of a correct tide. It arrived already listening."],
  ["errand", "bf_emma", 0.96, "The wax was warm. If I knew who it was for, I would not need someone who can hear the endings that got lost."],
  ["shirt", "af_bella", 0.9, "The shirt was not dirty. She folded it anyway, because he said he would return."],
];

const tts = await KokoroTTS.from_pretrained("onnx-community/Kokoro-82M-v1.0-ONNX", {
  dtype: "q8",
  device: "cpu",
});

mkdirSync("/tmp/listen", { recursive: true });
for (const [id, voice, speed, text] of lines) {
  const audio = await tts.generate(text, { voice, speed });
  const wav = Buffer.from(audio.toWav());
  writeFileSync(`/tmp/listen/${id}.wav`, wav);
  console.log(id, wav.length);
}
