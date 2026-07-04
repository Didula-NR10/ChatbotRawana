"""
Security helpers.

- Rate limiting (per-IP, via slowapi) protects the Gemini quota and the
  server from abuse/flooding.
- sanitize_text() strips control characters / HTML before anything is
  logged or sent to the model.
- API key handling: the Gemini key is read once from environment via
  config.get_settings() and is never included in any response payload,
  never logged, and never sent to the client in any form.
"""
import re

from slowapi import Limiter
from slowapi.util import get_remote_address

from app.config import get_settings

settings = get_settings()

# One shared limiter instance, keyed by client IP.
limiter = Limiter(key_func=get_remote_address, default_limits=[settings.rate_limit])

_CONTROL_CHARS = re.compile(r"[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]")
_HTML_TAG = re.compile(r"<[^>]*>")


def sanitize_text(text: str) -> str:
    """Strip control characters and raw HTML tags from user-supplied text.

    This is defense-in-depth, not a substitute for the frontend rendering
    bot output as plain text (React already escapes by default).
    """
    text = _CONTROL_CHARS.sub("", text)
    text = _HTML_TAG.sub("", text)
    return text.strip()


def looks_like_injection_attempt(text: str) -> bool:
    """Lightweight heuristic to flag obvious prompt-injection phrasing so we
    can log/monitor it. The real defense is the system-instruction
    hierarchy in gemini_client.py, which Gemini treats as higher-privilege
    than user content — this is only a secondary signal."""
    patterns = [
        r"ignore (all|any|previous|the) instructions",
        r"you are now",
        r"system prompt",
        r"reveal (your|the) (prompt|instructions|api key)",
        r"act as (?!mandhodhini)",
    ]
    lowered = text.lower()
    return any(re.search(p, lowered) for p in patterns)
