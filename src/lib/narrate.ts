import { createServerFn } from "@tanstack/react-start";

const VOICE = "eve";

export const narrate = createServerFn({ method: "POST" })
  .validator((input: { text: string }) => {
    const text = typeof input?.text === "string" ? input.text.replace(/\s+/g, " ").trim().slice(0, 1500) : "";
    if (!text) throw new Error("Nothing to read");
    return { text };
  })
  .handler(async ({ data }) => {
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) return { ok: false as const, error: "Voice is not available" };
    const res = await fetch("https://api.x.ai/v1/tts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ text: data.text, voice_id: VOICE, language: "en" }),
    });
    if (!res.ok) return { ok: false as const, error: `Voice failed (${res.status})` };
    const bytes = new Uint8Array(await res.arrayBuffer());
    let binary = "";
    for (let index = 0; index < bytes.length; index += 0x8000) {
      binary += String.fromCharCode(...bytes.subarray(index, index + 0x8000));
    }
    return { ok: true as const, audio: btoa(binary) };
  });
