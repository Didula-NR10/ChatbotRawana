"""
Request/response models. Pydantic validation is our first line of defense
against malformed or oversized input before anything touches the Gemini call.
"""
from typing import List, Literal, Optional

from pydantic import BaseModel, Field, field_validator


class ChatTurn(BaseModel):
    """A single prior turn, sent by the client purely to give the model
    short-term context within the *current* browser session. The backend
    never stores this — it is echoed back to Gemini and then forgotten."""

    role: Literal["user", "bot"]
    content: str = Field(..., max_length=1000)


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=600)
    history: Optional[List[ChatTurn]] = Field(default=None, max_length=6)

    @field_validator("message")
    @classmethod
    def not_blank(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("message must not be blank")
        return v


class ChatResponse(BaseModel):
    reply: str
    blocked: bool = False


class HealthResponse(BaseModel):
    status: str
    gemini_configured: bool
