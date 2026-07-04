// Local-only chat history persistence.
//
// IMPORTANT: this stores ONLY chat message text/timestamps in the user's own
// browser (localStorage) — nothing here is ever sent to, or synced with, the
// backend. No API keys, tokens, or credentials are ever present in this data
// (the Gemini key never leaves the server), so there's nothing sensitive to
// leak even if this storage were inspected via devtools.
//
// Safety notes:
// - Wrapped in try/catch: localStorage can throw (private/incognito mode,
//   storage disabled, quota exceeded, browser lockdown settings) and none
//   of that should ever crash the chat UI — it should just silently fall
//   back to an in-memory-only session.
// - History is capped (MAX_STORED_MESSAGES) so a very long-lived session
//   can't grow the stored payload unbounded.
// - Namespaced + versioned key, so a future change to the message shape
//   won't try to load and misrender old incompatible data.

const STORAGE_KEY = 'mandhodhini_chat_history_v1'
const MAX_STORED_MESSAGES = 100

function isStorageAvailable() {
  try {
    const testKey = '__mandhodhini_storage_test__'
    window.localStorage.setItem(testKey, '1')
    window.localStorage.removeItem(testKey)
    return true
  } catch {
    return false
  }
}

export function loadHistory() {
  if (!isStorageAvailable()) return null
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return null
    // Basic shape validation — never trust stored/parsed data blindly.
    return parsed.filter(
      (m) =>
        m &&
        (m.role === 'user' || m.role === 'bot') &&
        typeof m.content !== 'undefined'
    )
  } catch {
    // Corrupted or unreadable — start fresh rather than breaking the app.
    return null
  }
}

export function saveHistory(messages) {
  if (!isStorageAvailable()) return
  try {
    const trimmed = messages.slice(-MAX_STORED_MESSAGES)
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed))
  } catch {
    // Quota exceeded or storage blocked mid-session — fail silently,
    // the chat keeps working in-memory for the rest of the session.
  }
}

export function clearHistory() {
  if (!isStorageAvailable()) return
  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch {
    // Nothing to do — worst case the old data just stays until it expires
    // or the user clears site data manually.
  }
}
