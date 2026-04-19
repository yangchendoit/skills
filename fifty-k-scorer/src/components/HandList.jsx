import { BOMB_LABELS } from '../utils/storage'

export default function HandList({ hands, onRemove }) {
  if (hands.our.length === 0) return null

  // 计算累计炸弹总分
  const totalBombScore = hands.our.reduce((sum, hand) => sum + (hand.bombScore || 0), 0) +
                         hands.their.reduce((sum, hand) => sum + (hand.bombScore || 0), 0)

  return (
    <div className="hand-list">
      <div className="hand-list-title">
        <span>📊 本局累积</span>
        <span>{hands.our.length}把 {totalBombScore > 0 && `(炸弹${totalBombScore}分)`}</span>
      </div>
      <div>
        {hands.our.map((hand, index) => {
          const theirHand = hands.their[index]
          const ourBombs = hand.bombs || []
          const theirBombs = theirHand?.bombs || []

          return (
            <div key={index} className="hand-item">
              <div className="hand-item-main">
                <span className="hand-index">第{index + 1}把</span>
                <div className="hand-item-score">
                  <span className="our">+{hand.totalScore}</span>
                  <span>vs</span>
                  <span className="their">+{theirHand?.totalScore || 0}</span>
                </div>
                <button className="hand-remove-btn" onClick={() => onRemove(index)}>✕</button>
              </div>
              {(ourBombs.length > 0 || theirBombs.length > 0) && (
                <div className="hand-bombs">
                  {ourBombs.map((b, i) => (
                    <span key={i} className="bomb-tag our">
                      {b.player && <span className="bomb-player-small">{b.player}</span>}
                      {BOMB_LABELS[b.score || b]}
                    </span>
                  ))}
                  {theirBombs.map((b, i) => (
                    <span key={`t${i}`} className="bomb-tag their">
                      {b.player && <span className="bomb-player-small">{b.player}</span>}
                      {BOMB_LABELS[b.score || b]}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}