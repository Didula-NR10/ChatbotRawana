import { forwardRef } from 'react'
import MessageBubble from './MessageBubble.jsx'
import { AVATAR } from './ChatHeader.jsx'

const MessageList = forwardRef(function MessageList({ messages, isTyping }, ref) {
  return (
    <div className="message-list-scroll" ref={ref}>
      {messages.map((m, i) => (
        <MessageBubble key={i} role={m.role} content={m.content} time={m.time} avatar={AVATAR} />
      ))}
      {isTyping && (
        <div className="message-row message-row--bot">
          <img className="message-avatar" src={AVATAR} alt="Mandhodhini" />
          <div className="message-bubble message-bubble--bot typing-bubble" aria-label="Mandhodhini is typing">
            <span className="typing-dot" />
            <span className="typing-dot" />
            <span className="typing-dot" />
          </div>
        </div>
      )}
    </div>
  )
})

export default MessageList
