import { useEffect, useRef, useState } from 'react'
import { SendIcon, MicIcon } from '../icons.jsx'

export default function ChatInput({ onSend, disabled = false }) {
  const [draft, setDraft] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [voiceSupported, setVoiceSupported] = useState(true)
  const recognitionRef = useRef(null)

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      setVoiceSupported(false)
      return
    }

    const recognition = new SpeechRecognition()
    recognition.continuous = false
    recognition.interimResults = true
    recognition.lang = 'en-US'

    recognition.onresult = (event) => {
      let transcript = ''
      for (let i = 0; i < event.results.length; i += 1) {
        transcript += event.results[i][0].transcript
      }
      setDraft(transcript)
    }
    recognition.onerror = () => setIsListening(false)
    recognition.onend = () => setIsListening(false)

    recognitionRef.current = recognition

    return () => {
      recognition.onresult = null
      recognition.onerror = null
      recognition.onend = null
      recognition.stop()
    }
  }, [])

  function toggleListening() {
    const recognition = recognitionRef.current
    if (!voiceSupported || !recognition) return

    if (isListening) {
      recognition.stop()
      setIsListening(false)
      return
    }

    setDraft('')
    try {
      recognition.start()
      setIsListening(true)
    } catch {
      setIsListening(false)
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!draft.trim() || disabled) return
    if (isListening) {
      recognitionRef.current?.stop()
      setIsListening(false)
    }
    onSend(draft)
    setDraft('')
  }

  return (
    <form className="chat-input-row" onSubmit={handleSubmit}>
      {voiceSupported && (
        <button
          type="button"
          className={`mic-btn ${isListening ? 'is-listening' : ''}`}
          onClick={toggleListening}
          disabled={disabled}
          aria-label={isListening ? 'Stop voice typing' : 'Start voice typing'}
          aria-pressed={isListening}
          title={isListening ? 'Listening… tap to stop' : 'Voice typing'}
        >
          <MicIcon />
        </button>
      )}
      <input
        type="text"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        disabled={disabled}
        placeholder={isListening ? 'Listening…' : disabled ? 'Mandodari is replying…' : 'Ask Mandodari anything...'}
        aria-label="Ask Mandodari anything"
      />
      <button type="submit" className="send-btn" disabled={disabled || !draft.trim()} aria-label="Send message">
        <SendIcon />
      </button>
    </form>
  )
}
