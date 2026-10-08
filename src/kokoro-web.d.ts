declare module "kokoro-web" {
  export class KokoroTTS {
    static from_pretrained(
      id: string,
      options?: { dtype?: string; device?: string },
    ): Promise<{
      generate(text: string, options?: { voice?: string; speed?: number }): Promise<{ audio: Float32Array; sampling_rate: number }>;
    }>;
  }
}
