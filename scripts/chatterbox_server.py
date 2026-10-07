"""Local Chatterbox narrator. One English voice, loaded once."""

import io
import json
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

import torchaudio
from chatterbox.tts import ChatterboxTTS

print("chatterbox: loading", flush=True)
model = ChatterboxTTS.from_pretrained(device="cpu")
print("chatterbox: ready", flush=True)


class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        body = b"ready"
        self.send_response(200)
        self.send_header("Content-Type", "text/plain")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_POST(self):
        length = int(self.headers.get("Content-Length", "0"))
        try:
            body = json.loads(self.rfile.read(length) or b"{}")
        except json.JSONDecodeError:
            body = {}
        text = str(body.get("text") or "").strip()
        if not text:
            self.send_response(400)
            self.end_headers()
            return
        text = text[:900]
        wav = model.generate(text)
        buffer = io.BytesIO()
        torchaudio.save(buffer, wav, model.sr, format="wav")
        data = buffer.getvalue()
        self.send_response(200)
        self.send_header("Content-Type", "audio/wav")
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def log_message(self, fmt, *args):
        print(fmt % args, flush=True)


ThreadingHTTPServer(("127.0.0.1", 8099), Handler).serve_forever()
