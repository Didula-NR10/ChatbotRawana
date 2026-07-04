# Mandhodhini — The Wisdom of Lanka

A React chat UI clone matching the Mandhodhini AI companion mockups, with dark and light themes and a mobile-responsive drawer sidebar.

## Setup

```bash
npm install
npm run dev
```

Open the printed local URL (usually http://localhost:5173).

To build for production:

```bash
npm run build
npm run preview
```

## Connecting to the FastAPI backend

The chat UI talks to the backend through `src/lib/api.js`, which calls
`POST {VITE_API_URL}/api/chat`. Configure the backend URL via an env file:

```bash
cp .env.example .env
# edit .env if your backend isn't at http://localhost:8000
```

Then, in a separate terminal, start the backend (see `backend/README.md`):

```bash
cd backend
source .venv/bin/activate
./run.sh   # runs on http://localhost:8000
```

Make sure the backend's `.env` has `ALLOWED_ORIGINS=http://localhost:5173`
(or whatever origin Vite prints) so CORS allows the request.

With both servers running, messages typed in the chat box are sent to
`/api/chat` along with the last 6 turns of visible conversation as
short-term context (never persisted anywhere), and the AI's reply — from
Gemini via the backend — is rendered as a bot bubble. A typing indicator
shows while waiting, inputs are disabled mid-request, and rate-limit /
network errors surface as an in-character fallback message instead of a
crash.

## Project structure

```
public/assets/        Images: logo, cropped logo mark, backgrounds, avatar
src/App.jsx            Root component, holds theme + active tab + mobile menu state
src/App.css             All styling (CSS variables drive the dark/light themes)
src/components/
  Sidebar.jsx           Left navigation, brand, quote card, theme switch
  ChatWindow.jsx         Chat header, message list, quick replies, input bar
  MessageBubble.jsx      Single chat bubble (user or bot, text or bullet list)
  icons.jsx              Inline SVG icon set used across the sidebar/chat
```

## Theming

Theme is toggled by the switch at the bottom of the sidebar and is applied via
`data-theme="dark"` / `data-theme="light"` on `<html>`. Every color, card
background, and the background photo itself is a CSS variable defined in
`App.css` under `[data-theme='dark']` and `[data-theme='light']`, so you can
retune the palette without touching components.

## Swapping in your own assets

- `public/assets/logo.png` — your full "Rawana Ceylon" logo (not shown in the
  UI directly, kept for favicon/marketing use).
- `public/assets/logo-mark.png` — the lotus-hand emblem cropped from the logo,
  shown at the top of the sidebar. Replace with a transparent PNG of your
  mark for a cleaner edge.
- `public/assets/bg-dark.jpg` / `bg-light.jpg` — the full-bleed background art
  behind the chat panel for each theme.
- `public/assets/avatar-queen.png` — Mandhodhini's avatar, used in the chat
  header and next to every bot message. Swap for a dedicated circular
  portrait for the sharpest result.

## Wiring up a real AI backend

`ChatWindow.jsx` currently answers with a small canned-response lookup in
`CANNED_ANSWERS`. Replace the `sendMessage` function's `setTimeout` block with
a call to your API (e.g. the Anthropic Messages API) and stream or set the
response into state the same way.
