import { useEffect, useRef, useState } from 'react'
import ChatHeader from './ChatHeader.jsx'
import MessageList from './MessageList.jsx'
import QuickReplies from './QuickReplies.jsx'
import ChatInput from './ChatInput.jsx'
import { MenuIcon } from '../icons.jsx'
import { sendChatMessage, ApiError } from '../../lib/api.js'
import { loadHistory, saveHistory, clearHistory } from '../../lib/chatStorage.js'

function formatTime() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const INITIAL_MESSAGES = [
  {
    role: 'bot',
    content:
      "I am Mandhodhini, queen of Lanka. Ask me anything about my lord, Ravana — his family, his wisdom, his kingdom, or how he is remembered.",
    time: formatTime(),
  },
]

export default function ChatWindow({ onOpenMenu }) {
  // Lazy init: read any saved history from this device on first render only.
  // Falls back to the greeting if nothing was stored (first visit, storage
  // unavailable, or the user previously cleared their chat).
  const [messages, setMessages] = useState(() => {
    const stored = loadHistory()
    return stored && stored.length > 0 ? stored : INITIAL_MESSAGES
  })
  const [isSending, setIsSending] = useState(false)
  const scrollRef = useRef(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, isSending])

  // Persist to this device only, every time the visible conversation
  // changes. This never touches the backend — it's purely local storage
  // on the user's own browser.
  useEffect(() => {
    saveHistory(messages)
  }, [messages])

  async function sendMessage(text) {
    const trimmed = text.trim()
    if (!trimmed || isSending) return

    // Snapshot the conversation so far (for backend context) before adding
    // the new user turn to state.
    const priorMessages = messages

    setMessages((prev) => [...prev, { role: 'user', content: trimmed, time: formatTime() }])
    setIsSending(true)

    try {
      const data = await sendChatMessage(trimmed, priorMessages)
      setMessages((prev) => [...prev, { role: 'bot', content: data.reply, time: formatTime() }])
    } catch (err) {
      const message =
        err instanceof ApiError && err.status === 429
          ? "I've been asked too many questions too quickly — please wait a moment before asking again."
          : 'I could not reach the chronicles just now. Please check your connection and try again.'
      setMessages((prev) => [...prev, { role: 'bot', content: message, time: formatTime() }])
    } finally {
      setIsSending(false)
    }
  }

  function handleClearChat() {
    clearHistory()
    setMessages(INITIAL_MESSAGES)
  }

  return (
    <section className="chat-panel">
      <header className="chat-topbar">
        <p className="chat-tagline">
          Your AI companion to explore the <em>life</em>, <em>wisdom</em>, and <em>legacy</em> of{' '}
          <em>King Ravana</em>.
        </p>
        <button className="hamburger" onClick={onOpenMenu} aria-label="Open menu">
          <MenuIcon />
        </button>
      </header>

      <div className="chat-card">
        <ChatHeader onClearChat={handleClearChat} />
        <MessageList messages={messages} isTyping={isSending} ref={scrollRef} />
        <QuickReplies onPick={sendMessage} disabled={isSending} />
        <ChatInput onSend={sendMessage} disabled={isSending} />
        <p className="chat-disclaimer">
          Mandhodhini is an AI chatbot for educational and informational purposes.
          <br />
          Answers are based on historical, literary, and cultural sources. Your
          chat history is saved only on this device and is never sent to our
          servers for storage.
        </p>
      </div>
    </section>
  )
}
