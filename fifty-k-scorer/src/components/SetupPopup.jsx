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

  // 交换队伍
  const swapTeams = () => {
    const temp1 = ourPlayer1
    const temp2 = ourPlayer2
    setOurPlayer1(theirPlayer1)
    setOurPlayer2(theirPlayer2)
    setTheirPlayer1(temp1)
    setTheirPlayer2(temp2)
  }

  // 交换我方两个玩家
  const swapOurPlayers = () => {
    const temp = ourPlayer1
    setOurPlayer1(ourPlayer2)
    setOurPlayer2(temp)
  }

  // 交换对方两个玩家
  const swapTheirPlayers = () => {
    const temp = theirPlayer1
    setTheirPlayer1(theirPlayer2)
    setTheirPlayer2(temp)
  }

  // 交换玩家位置（指定两个玩家）
  const swapPlayers = (pos1, pos2) => {
    const positions = {
      our1: [ourPlayer1, setOurPlayer1],
      our2: [ourPlayer2, setOurPlayer2],
      their1: [theirPlayer1, setTheirPlayer1],
      their2: [theirPlayer2, setTheirPlayer2]
    }
    const [val1] = positions[pos1]
    const [val2, setVal2] = positions[pos2]
    const [, setVal1] = positions[pos1]
    setVal1(val2)
    setVal2(val1)
  }

  return (
    <div className="popup show" onClick={(e) => e.target.classList.contains('popup') && onClose()}>
      <div className="popup-content">
        <div className="popup-title">👥 设置玩家</div>
        <div className="player-setup">
          <div className="player-grid">
            <div className="player-group our">
              <div className="player-group-header">
                <span className="player-group-title">🟢 我方</span>
                <button className="swap-btn small" onClick={swapOurPlayers} title="交换位置">↕️</button>
              </div>
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
            <div className="swap-teams-container">
              <button className="swap-btn" onClick={swapTeams} title="交换队伍">⇄</button>
              <span className="swap-label">换队</span>
            </div>
            <div className="player-group their">
              <div className="player-group-header">
                <span className="player-group-title">🔴 对方</span>
                <button className="swap-btn small" onClick={swapTheirPlayers} title="交换位置">↕️</button>
              </div>
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