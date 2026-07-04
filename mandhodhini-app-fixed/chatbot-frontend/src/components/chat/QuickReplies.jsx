export const QUICK_REPLIES = [
  "Tell me about Ravana's family",
  "What were Ravana's weaknesses?",
  'How is Ravana remembered in Lanka?',
]

export default function QuickReplies({ onPick, disabled = false }) {
  return (
    <div className="quick-replies">
      {QUICK_REPLIES.map((q) => (
        <button key={q} className="quick-reply" onClick={() => onPick(q)} disabled={disabled}>
          {q}
        </button>
      ))}
    </div>
  )
}
