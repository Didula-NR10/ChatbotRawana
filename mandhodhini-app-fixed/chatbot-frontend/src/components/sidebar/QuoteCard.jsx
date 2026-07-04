export default function QuoteCard({ collapsed }) {
  if (collapsed) return null

  return (
    <div className="quote-card">
      <span className="quote-mark">&ldquo;</span>
      <p>
        A king misunderstood.
        <br />
        A scholar unmatched.
        <br />
        A legacy eternal.
      </p>
      <span className="quote-author">— Mandodari</span>
      <span className="quote-lotus">✦</span>
    </div>
  )
}
