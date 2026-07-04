---
title: Mandodari Backend
emoji: 🐍
colorFrom: purple
colorTo: pink
sdk: docker
app_port: 7860
pinned: false
---

# Mandodari Backend (FastAPI + Gemini)

Stateless FastAPI backend for the Ravana chatbot. It proxies chat messages to
the Gemini free-tier API using a persona/topic-locked system prompt, and
**never stores any chat history** — nothing is written to disk or a database.
Each browser session's history lives only in the React state on the frontend
and disappears when the user leaves/refreshes, exactly as required.

## Folder structure

```
backend/
├── app/
│   ├── main.py            # FastAPI app, CORS, security headers, error handling
│   ├── config.py          # env-based settings (pydantic-settings)
│   ├── schemas.py         # request/response validation models
│   ├── security.py        # rate limiter + input sanitization
│   ├── gemini_client.py   # Gemini call + persona/topic system prompt
│   └── routers/
│       ├── chat.py        # POST /api/chat
│       └── health.py      # GET  /api/health
├── requirements.txt
├── .env.example
├── setup_venv.sh / .bat
└── run.sh
```

## 1. Setup

Requires Python 3.10+.

```bash
cd backend
./setup_venv.sh          # Windows: setup_venv.bat
```

This creates `.venv`, installs dependencies, and copies `.env.example` → `.env`.

Then edit `.env`:

```
GEMINI_API_KEY=your_real_key_here      # https://aistudio.google.com/app/apikey
ALLOWED_ORIGINS=http://localhost:5173  # your Vite dev URL, comma-separate for multiple
```

`.env` is git-ignored — the key never gets committed or sent to the browser.

## 2. Run

```bash
source .venv/bin/activate   # if not already active
./run.sh
# or: uvicorn app.main:app --reload --port 8000
```

Server runs at `http://localhost:8000`. Interactive docs at `/docs` (disabled
automatically when `ENVIRONMENT=production`).

## 3. Endpoints

### `GET /api/health`
Returns `{"status": "ok", "gemini_configured": true}`. Use for uptime checks.

### `POST /api/chat`
```json
// Request
{
  "message": "Who was Ravana's family?",
  "history": [                          // optional, session-only, max 6 turns
    { "role": "user", "content": "Tell me about Ravana" },
    { "role": "bot",  "content": "He was..." }
  ]
}
```
```json
// Response
{ "reply": "Ravana was born to sage Vishrava and Kaikesi...", "blocked": false }
```

- `message`: 1–600 characters, required.
- `history`: optional — pass the current session's visible messages if you
  want the model to have short-term context. **Do not persist this
  anywhere** on the client either (the frontend already keeps it only in
  React state, which is correct).
- Rate limited per-IP (default `15/minute`, configurable via `RATE_LIMIT`
  in `.env`) — returns `429` when exceeded.
- Off-topic questions get a polite in-persona redirect back to Ravana
  instead of an error, so the UI doesn't need special-case handling.

## 4. Connecting the React frontend

In `ChatWindow.jsx`, replace the canned `CANNED_ANSWERS` logic in
`sendMessage` with a call to the backend, keeping everything else
(including the in-memory `messages` state that resets on reload) unchanged:

```js
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

async function sendMessage(text) {
  const trimmed = text.trim()
  if (!trimmed) return

  setMessages((prev) => [...prev, { role: 'user', content: trimmed, time: formatTime() }])

  try {
    const res = await fetch(`${API_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: trimmed,
        // Optional short-term context, session-only, never persisted:
        history: messages.slice(-6).map((m) => ({
          role: m.role,
          content: Array.isArray(m.content) ? m.content.join(' ') : m.content,
        })),
      }),
    })
    if (!res.ok) throw new Error(`Request failed: ${res.status}`)
    const data = await res.json()
    setMessages((prev) => [...prev, { role: 'bot', content: data.reply, time: formatTime() }])
  } catch (err) {
    setMessages((prev) => [
      ...prev,
      { role: 'bot', content: 'I could not reach the chronicles just now. Please try again.', time: formatTime() },
    ])
  }
}
```

Add a `.env` in the frontend (Vite):
```
VITE_API_URL=http://localhost:8000
```

No API key or Gemini reference is ever needed on the frontend — it only
talks to your FastAPI server.

## 5. Security measures implemented

- **API key isolation**: `GEMINI_API_KEY` is read once server-side from
  environment variables (`config.py`) and used only inside
  `gemini_client.py`. It is never included in any response, log line, or
  error message.
- **CORS allowlist**: only origins listed in `ALLOWED_ORIGINS` may call the
  API — set this to your real deployed frontend URL in production.
- **Rate limiting**: per-IP limit (`slowapi`) on `/api/chat` to protect the
  Gemini quota and prevent abuse; returns `429` when exceeded.
- **Strict input validation**: Pydantic enforces message length, non-blank
  content, and a max of 6 history turns before anything reaches the model.
- **Sanitization**: control characters and raw HTML are stripped from all
  user input before use.
- **Prompt-injection hardening**: the persona/topic instructions are sent
  as a Gemini `system_instruction` (higher-privilege than user turns, not
  just prepended text), and obviously injection-shaped input is logged for
  monitoring.
- **Content safety filters**: Gemini safety settings block
  harassment/hate/sexual/dangerous content categories at medium+ severity.
- **No persistence**: there is no database, cache, or file write anywhere
  in this backend — chat history exists only transiently during a single
  request and in the browser's own React state.
- **Security headers**: `X-Content-Type-Options`, `X-Frame-Options`,
  `Referrer-Policy` set on every response.
- **Docs hidden in production**: `/docs` and `/redoc` are disabled when
  `ENVIRONMENT=production`.
- **Generic error responses**: unhandled exceptions return a generic 500
  message to the client; full details go only to server logs.

## 6. Deployment notes

- Set `ENVIRONMENT=production`, a real `ALLOWED_ORIGINS`, and a strong
  `RATE_LIMIT` in your production `.env` (or your host's secret manager —
  never commit `.env`).
- Put the API behind HTTPS (e.g. via your hosting provider or a reverse
  proxy like Nginx/Caddy) so the API key exchange and traffic are encrypted
  in transit.
- The Gemini free tier has its own request-per-minute/day caps — the
  `RATE_LIMIT` here should stay comfortably under those.
