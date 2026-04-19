import { useState } from 'react'
import { BOMB_LABELS } from '../utils/storage'

export default function BombSection({ team, label, bombs, players, onAdd, onRemove, onClear, disabled }) {
  const bombScores = [200, 500, 1000, 2000, 5000, 10000]
  const total = bombs.reduce((sum, b) => sum + (b.score || b), 0)
  const [showPlayerSelect, setShowPlayerSelect] = useState(false)
  const [pendingScore, setPendingScore] = useState(null)

  const handleBombClick = (score) => {
    if (disabled) return
    // 如果没有玩家名，直接添加不带玩家信息
    if (!players || players.filter(p => p).length === 0) {
      onAdd(team, { score, player: null })
    } else {
      setPendingScore(score)
      setShowPlayerSelect(true)
    }
  }

  const handlePlayerSelect = (player) => {
    onAdd(team, { score: pendingScore, player })
    setShowPlayerSelect(false)
    setPendingScore(null)
  }

  const validPlayers = players ? players.filter(p => p) : []

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
              onClick={() => handleBombClick(score)}
              disabled={disabled}
            >
              {BOMB_LABELS[score]}
            </button>
          ))}
        </div>
        {bombs.length > 0 && (
          <div className="bomb-list">
            {bombs.map((bomb, index) => {
              const bombScore = bomb.score || bomb
              const bombPlayer = bomb.player
              return (
                <div key={index} className="bomb-item">
                  <span>
                    {bombPlayer && <span className="bomb-player">🎯{bombPlayer}</span>}
                    {BOMB_LABELS[bombScore]} {bombScore}分
                  </span>
                  <button onClick={() => onRemove(team, index)}>✕</button>
                </div>
              )
            })}
          </div>
        )}
        <div className="bomb-total">小计: {total}</div>

        {showPlayerSelect && (
          <div className="player-select-popup">
            <div className="player-select-content">
              <div className="player-select-title">谁打的?</div>
              <div className="player-select-buttons">
                {validPlayers.map(player => (
                  <button key={player} className="btn btn-player" onClick={() => handlePlayerSelect(player)}>
                    {player}
                  </button>
                ))}
                <button className="btn btn-secondary" onClick={() => handlePlayerSelect(null)}>
                  不记录
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}