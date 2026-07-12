import asyncio
import hashlib
import os
import sys
from pathlib import Path

from aiohttp import web
import edge_tts

CACHE_DIR = Path(__file__).parent / "tts_cache"
CACHE_DIR.mkdir(exist_ok=True)

VOICE_MAP = {
    "ms": "ms-MY-YasminNeural",
    "ms-MY": "ms-MY-YasminNeural",
    "ms-male": "ms-MY-OsmanNeural",
    "ms-female": "ms-MY-YasminNeural",
    "en": "en-US-AriaNeural",
    "zh": "zh-CN-XiaoxiaoNeural",
}

RATE_MAP = {
    0.5: "-50%", 0.6: "-40%", 0.7: "-30%", 0.8: "-20%", 0.9: "-10%",
    1.0: "+0%", 1.1: "+10%", 1.2: "+20%", 1.3: "+30%", 1.4: "+40%", 1.5: "+50%",
    1.6: "+60%", 1.7: "+70%", 1.8: "+80%", 1.9: "+90%", 2.0: "+100%",
}


def get_rate(rate):
    if rate in RATE_MAP:
        return RATE_MAP[rate]
    pct = int((rate - 1.0) * 100)
    sign = "+" if pct >= 0 else ""
    return f"{sign}{pct}%"


import re

def strip_for_speech(text):
    """Remove all non-word, non-whitespace, non-punctuation chars that TTS would read aloud."""
    text = re.sub(r'[^\w\s.,!?\'\u00C0-\u024F\u0400-\u04FF\u0600-\u06FF\u0E00-\u0E7F\u4E00-\u9FFF]', ' ', text)
    text = re.sub(r'\.{4,}', '...', text)
    text = re.sub(r'[,]{2,}', ',', text)
    text = re.sub(r' ,', ',', text)
    text = re.sub(r' \.', '.', text)
    text = re.sub(r' \!', '!', text)
    text = re.sub(r' \?', '?', text)
    text = re.sub(r'\s{2,}', ' ', text)
    return text.strip()


async def generate_tts(text, voice_key, rate):
    text = strip_for_speech(text)
    voice = VOICE_MAP.get(voice_key, "ms-MY-YasminNeural")
    rate_str = get_rate(rate)

    cache_key = hashlib.md5(f"{text}|{voice}|{rate_str}".encode()).hexdigest()
    cache_file = CACHE_DIR / f"{cache_key}.mp3"

    if cache_file.exists():
        return cache_file

    communicate = edge_tts.Communicate(text, voice, rate=rate_str)
    await communicate.save(str(cache_file))
    return cache_file


async def handle_tts(request):
    try:
        body = await request.json()
        text = body.get("text", "").strip()
        voice = body.get("voice", "ms")
        rate = float(body.get("rate", 1.0))

        if not text:
            return web.json_response({"error": "No text provided"}, status=400)

        audio_file = await generate_tts(text, voice, rate)
        return web.FileResponse(
            audio_file,
            headers={
                "Content-Type": "audio/mpeg",
                "Cache-Control": "public, max-age=86400",
            },
        )
    except Exception as e:
        return web.json_response({"error": str(e)}, status=500)


async def handle_health(request):
    return web.json_response({"status": "ok", "voices": list(VOICE_MAP.keys())})


app = web.Application()
app.router.add_get("/health", handle_health)
app.router.add_post("/tts", handle_tts)

if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 5175
    print(f"Starting TTS server on http://localhost:{port}")
    web.run_app(app, port=port)
