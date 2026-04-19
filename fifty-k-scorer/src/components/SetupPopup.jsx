import { useState } from 'react'

export default function SetupPopup({ players, onSave, onClose }) {
  const [ourPlayer1, setOurPlayer1] = useState(players.our[0] || '')
  const [ourPlayer2, setOurPlayer2] = useState(players.our[1] || '')
  const [theirPlayer1, setTheirPlayer1] = useState(players.their[0] || '')
  const [theirPlayer2, setTheirPlayer2] = useState(players.their[1] || '')

  const handleSave = () => {
    onSave({
      our: [ourPlayer1.trim(), ourPlayer2.trim()],
      their: [theirPlayer1.trim(), theirPlayer2.trim()]
    })
  }

  return (
    <div className="popup show" onClick={(e) => e.target.classList.contains('popup') && onClose()}>
      <div className="popup-content">
        <div className="popup-title">👥 设置玩家</div>
        <div className="player-setup">
          <div className="player-grid">
            <div className="player-group our">
              <div className="player-group-title">🟢 我方</div>
              <div className="player-input">
                <label>玩家1</label>
                <input
                  type="text"
                  value={ourPlayer1}
                  onChange={(e) => setOurPlayer1(e.target.value)}
                  placeholder="输入姓名"
                  maxLength={6}
                />
              </div>
              <div className="player-input">
                <label>玩家2</label>
                <input
                  type="text"
                  value={ourPlayer2}
                  onChange={(e) => setOurPlayer2(e.target.value)}
                  placeholder="输入姓名"
                  maxLength={6}
                />
              </div>
            </div>
            <div className="player-group their">
              <div className="player-group-title">🔴 对方</div>
              <div className="player-input">
                <label>玩家3</label>
                <input
                  type="text"
                  value={theirPlayer1}
                  onChange={(e) => setTheirPlayer1(e.target.value)}
                  placeholder="输入姓名"
                  maxLength={6}
                />
              </div>
              <div className="player-input">
                <label>玩家4</label>
                <input
                  type="text"
                  value={theirPlayer2}
                  onChange={(e) => setTheirPlayer2(e.target.value)}
                  placeholder="输入姓名"
                  maxLength={6}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="popup-buttons">
          <button className="btn btn-primary" onClick={handleSave}>确认</button>
          <button className="btn btn-secondary" onClick={onClose}>取消</button>
        </div>
      </div>
    </div>
  )
}