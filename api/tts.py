import asyncio
import hashlib
import json
import re
import io


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


def strip_for_speech(text):
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
    import edge_tts
    text = strip_for_speech(text)
    voice = VOICE_MAP.get(voice_key, "ms-MY-YasminNeural")
    rate_str = get_rate(rate)
    communicate = edge_tts.Communicate(text, voice, rate=rate_str)
    audio_data = b""
    async for chunk in communicate.stream():
        if chunk["type"] == "audio":
            audio_data += chunk["data"]
    return audio_data


def application(environ, start_response):
    method = environ.get("REQUEST_METHOD", "GET")
    path = environ.get("PATH_INFO", "/")

    if path == "/api/tts" and method == "POST":
        try:
            content_length = int(environ.get("CONTENT_LENGTH", 0))
            body = environ["wsgi.input"].read(content_length)
            data = json.loads(body)

            text = data.get("text", "").strip()
            voice = data.get("voice", "ms")
            rate = float(data.get("rate", 1.0))

            if not text:
                start_response("400 Bad Request", [
                    ("Content-Type", "application/json"),
                ])
                return [json.dumps({"error": "No text provided"}).encode()]

            audio = asyncio.run(generate_tts(text, voice, rate))
            start_response("200 OK", [
                ("Content-Type", "audio/mpeg"),
                ("Cache-Control", "public, max-age=86400"),
                ("Access-Control-Allow-Origin", "*"),
            ])
            return [audio]

        except Exception as e:
            start_response("500 Internal Server Error", [
                ("Content-Type", "application/json"),
            ])
            return [json.dumps({"error": str(e)}).encode()]

    elif path == "/api/tts" and method == "OPTIONS":
        start_response("200 OK", [
            ("Access-Control-Allow-Origin", "*"),
            ("Access-Control-Allow-Methods", "POST, OPTIONS"),
            ("Access-Control-Allow-Headers", "Content-Type"),
        ])
        return [b""]

    elif path == "/api/tts" and method == "GET":
        start_response("200 OK", [
            ("Content-Type", "application/json"),
        ])
        return [json.dumps({"status": "ok", "voices": list(VOICE_MAP.keys())}).encode()]

    else:
        start_response("404 Not Found", [])
        return [b"Not Found"]
