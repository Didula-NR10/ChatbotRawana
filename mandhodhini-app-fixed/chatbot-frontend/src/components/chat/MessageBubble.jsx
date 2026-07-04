import { CheckIcon } from '../icons.jsx'

export default function MessageBubble({ role, content, time, avatar }) {
  const isUser = role === 'user'

  return (
    <div className={`message-row ${isUser ? 'message-row--user' : 'message-row--bot'}`}>
      {!isUser && (
        <img className="message-avatar" src={avatar} alt="Mandhodhini" />
      )}
      <div className={`message-bubble ${isUser ? 'message-bubble--user' : 'message-bubble--bot'}`}>
        {Array.isArray(content) ? (
          <ul className="message-list">
            {content.map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ul>
        ) : (
          <p>{content}</p>
        )}
        <span className="message-meta">
          {time}
          {isUser && (
            <span className="message-ticks">
              <CheckIcon />
            </span>
          )}
        </span>
      </div>
    </div>
  )
}
