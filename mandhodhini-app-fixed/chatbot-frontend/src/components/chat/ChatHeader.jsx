const AVATAR = '/assets/avatar-queen.png'

export default function ChatHeader({ onClearChat }) {
  return (
    <>
      <div className="chat-card-header">
        <img className="chat-avatar" src={AVATAR} alt="Mandhodhini" />
        <div>
          <h2>Mandhodhini</h2>
          <p>
            I am <strong>Mandhodhini</strong>, queen of Lanka.
            <br />
            Ask me anything about my lord, <strong>Ravana</strong>.
          </p>
        </div>
        {onClearChat && (
          <button
            type="button"
            className="chat-clear-btn"
            onClick={() => {
              if (window.confirm('Clear this chat? This only clears history saved on this device.')) {
                onClearChat()
              }
            }}
            aria-label="Clear chat history"
            title="Clear chat history (this device only)"
          >
            Clear chat
          </button>
        )}
      </div>
      <div className="chat-divider" />
    </>
  )
}

export { AVATAR }
