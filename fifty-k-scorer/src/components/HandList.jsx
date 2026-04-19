export default function HandList({ hands, onRemove }) {
  if (hands.our.length === 0) return null

  return (
    <div className="hand-list">
      <div className="hand-list-title">
        <span>📊 本局累积</span>
        <span>{hands.our.length}把</span>
      </div>
      <div>
        {hands.our.map((hand, index) => (
          <div key={index} className="hand-item">
            <span>第{index + 1}把</span>
            <div className="hand-item-score">
              <span className="our">+{hand.totalScore}</span>
              <span>vs</span>
              <span className="their">+{hands.their[index]?.totalScore || 0}</span>
            </div>
            <button onClick={() => onRemove(index)}>✕</button>
          </div>
        ))}
      </div>
    </div>
  )
}