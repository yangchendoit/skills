import { BOMB_LABELS } from '../utils/storage'

export default function BombSection({ team, label, bombs, onAdd, onRemove, onClear, disabled }) {
  const bombScores = [200, 500, 1000, 2000, 5000, 10000]
  const total = bombs.reduce((sum, b) => sum + b, 0)

  return (
    <div>
      <div className="section-subtitle">{label}</div>
      <div className="bomb-section">
        <div className="bomb-actions">
          <button
            className="btn btn-undo"
            onClick={() => {
              if (bombs.length > 0) {
                onRemove(team, bombs.length - 1)
              }
            }}
          >
            ↩️
          </button>
          <button className="btn btn-danger" onClick={() => onClear(team)}>🗑️</button>
        </div>
        <div className="btn-grid">
          {bombScores.map(score => (
            <button
              key={score}
              className="btn btn-bomb"
              onClick={() => onAdd(team, score)}
              disabled={disabled}
            >
              {BOMB_LABELS[score]}
            </button>
          ))}
        </div>
        {bombs.length > 0 && (
          <div className="bomb-list">
            {bombs.map((bomb, index) => (
              <div key={index} className="bomb-item">
                <span>{BOMB_LABELS[bomb]} {bomb}分</span>
                <button onClick={() => onRemove(team, index)}>✕</button>
              </div>
            ))}
          </div>
        )}
        <div className="bomb-total">小计: {total}</div>
      </div>
    </div>
  )
}