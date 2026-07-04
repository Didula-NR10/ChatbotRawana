import logging

from fastapi import APIRouter, Request

from app.config import get_settings
from app.gemini_client import generate_reply
from app.schemas import ChatRequest, ChatResponse
from app.security import limiter, looks_like_injection_attempt, sanitize_text

logger = logging.getLogger("mandhodhini.chat")
settings = get_settings()

router = APIRouter(prefix="/api/chat", tags=["chat"])


@router.post("", response_model=ChatResponse)
@limiter.limit(settings.rate_limit)
async def chat(request: Request, payload: ChatRequest) -> ChatResponse:
    """
    Stateless chat endpoint.

    - Nothing received here is written to a database, file, or cache.
    - `payload.history`, if present, is only the current browser session's
      in-memory transcript sent by the client for short-term context; it is
      used for this one request and then discarded when the function returns.
    - The Gemini API key is never referenced in this file — it lives only
      inside gemini_client.py / environment variables.
    """
    clean_message = sanitize_text(payload.message)

    if looks_like_injection_attempt(clean_message):
        logger.info("Flagged possible prompt-injection attempt (not blocked, monitored only).")

    clean_history = None
    if payload.history:
        clean_history = [
            turn.model_copy(update={"content": sanitize_text(turn.content)})
            for turn in payload.history
        ]

    reply = generate_reply(clean_message, clean_history)
    return ChatResponse(reply=reply)
