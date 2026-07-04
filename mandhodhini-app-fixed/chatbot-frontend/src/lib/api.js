// Small client for the Mandhodhini FastAPI backend.
//
// The base URL is read from Vite's env system. Set VITE_API_URL in a
// frontend/.env (or .env.local) file, e.g.:
//   VITE_API_URL=http://localhost:8000
// If it's not set, we fall back to localhost:8000 for local dev.
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

/**
 * Flatten the UI's message shape (which allows content to be an array of
 * bullet lines for bot replies) into the plain string history the backend
 * schema expects: { role: 'user' | 'bot', content: string }.
 */
function toHistoryPayload(messages) {
  return messages.map((m) => ({
    role: m.role,
    content: Array.isArray(m.content) ? m.content.join(' ') : m.content,
  }))
}

/**
 * POST /api/chat
 *
 * @param {string} message - the new user message
 * @param {Array<{role: string, content: string|string[]}>} priorMessages -
 *        recent conversation turns (already shown in the UI) used purely as
 *        short-term context; the backend never persists it. Backend caps
 *        history at 6 turns, so we only send the most recent 6 here.
 * @returns {Promise<{reply: string, blocked: boolean}>}
 */
export async function sendChatMessage(message, priorMessages = []) {
  const history = toHistoryPayload(priorMessages.slice(-6))

  let res
  try {
    res = await fetch(`${API_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, history }),
    })
  } catch (err) {
    // Network failure (backend down, CORS block, offline, etc.)
    throw new ApiError('network_error', 0)
  }

  if (res.status === 429) {
    throw new ApiError('rate_limited', 429)
  }

  if (!res.ok) {
    let detail = `Request failed with status ${res.status}`
    try {
      const body = await res.json()
      detail = body.detail || detail
    } catch {
      // response wasn't JSON — keep default detail
    }
    throw new ApiError(detail, res.status)
  }

  return res.json() // { reply, blocked }
}

/**
 * GET /api/health — useful for a connection-status indicator if you want one.
 * @returns {Promise<{status: string, gemini_configured: boolean}>}
 */
export async function checkHealth() {
  const res = await fetch(`${API_URL}/api/health`)
  if (!res.ok) throw new ApiError(`Health check failed: ${res.status}`, res.status)
  return res.json()
}

export { API_URL }
