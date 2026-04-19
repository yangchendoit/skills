import { useState } from 'react'

export default function SetupPopup({ players, onSave, onClose }) {
  const [playerValues, setPlayerValues] = useState([
    players.our[0] || '',
    players.our[1] || '',
    players.their[0] || '',
    players.their[1] || ''
  ])
  const [selectedIndex, setSelectedIndex] = useState(null)

  const handleChange = (index, value) => {
    const newValues = [...playerValues]
    newValues[index] = value
    setPlayerValues(newValues)
  }

  const handleSlotClick = (index) => {
    if (selectedIndex === null) {
      // 第一次点击，选中
      setSelectedIndex(index)
    } else if (selectedIndex === index) {
      // 点击已选中的，取消选中
      setSelectedIndex(null)
    } else {
      // 第二次点击，交换
      const newValues = [...playerValues]
      const temp = newValues[selectedIndex]
      newValues[selectedIndex] = newValues[index]
      newValues[index] = temp
      setPlayerValues(newValues)
      setSelectedIndex(null)
    }
  }

  const handleSave = () => {
    onSave({
      our: [playerValues[0].trim(), playerValues[1].trim()],
      their: [playerValues[2].trim(), playerValues[3].trim()]
    })
  }

  const getSlotClass = (index, team) => {
    let classes = 'player-slot ' + team
    if (selectedIndex === index) classes += ' selected'
    return classes
  }

  return (
    <div className="popup show" onClick={(e) => e.target.classList.contains('popup') && onClose()}>
      <div className="popup-content setup-popup">
        <div className="popup-title">👥 设置玩家</div>
        <p className="setup-hint">点击选择玩家，再点击另一个玩家交换位置</p>
        <div className="setup-content">
          <div className="setup-teams-label">
            <span className="team-label our">我方</span>
            <span className="team-label their">对方</span>
          </div>
          <div className="player-row">
            <div className={getSlotClass(0, 'our')} onClick={() => handleSlotClick(0)}>
              <span className="slot-index">1</span>
              <input
                type="text"
                value={playerValues[0]}
                onChange={(e) => handleChange(0, e.target.value)}
                onClick={(e) => e.stopPropagation()}
                placeholder="玩家名"
                maxLength={6}
              />
            </div>
            <div className={getSlotClass(2, 'their')} onClick={() => handleSlotClick(2)}>
              <span className="slot-index">3</span>
              <input
                type="text"
                value={playerValues[2]}
                onChange={(e) => handleChange(2, e.target.value)}
                onClick={(e) => e.stopPropagation()}
                placeholder="玩家名"
                maxLength={6}
              />
            </div>
          </div>
          <div className="player-row">
            <div className={getSlotClass(1, 'our')} onClick={() => handleSlotClick(1)}>
              <span className="slot-index">2</span>
              <input
                type="text"
                value={playerValues[1]}
                onChange={(e) => handleChange(1, e.target.value)}
                onClick={(e) => e.stopPropagation()}
                placeholder="玩家名"
                maxLength={6}
              />
            </div>
            <div className={getSlotClass(3, 'their')} onClick={() => handleSlotClick(3)}>
              <span className="slot-index">4</span>
              <input
                type="text"
                value={playerValues[3]}
                onChange={(e) => handleChange(3, e.target.value)}
                onClick={(e) => e.stopPropagation()}
                placeholder="玩家名"
                maxLength={6}
              />
            </div>
          </div>
        </div>
        <div className="popup-buttons">
          <button className="btn btn-secondary" onClick={onClose}>取消</button>
          <button className="btn btn-primary" onClick={handleSave}>确认</button>
        </div>
      </div>
    </div>
  )
}