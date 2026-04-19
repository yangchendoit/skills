export default function SettlePopup({ result, players, onNewGame, onClose }) {
  const emoji = result.winner === 'our' ? '🎉' : result.winner === 'their' ? '😔' : '🤝'
  const title = result.winner === 'our' ? '🎉 我方获胜！' :
                result.winner === 'their' ? '😔 对方获胜' : '🤝 平局'
  const message = `${players.our.join(' & ')} ${result.winner === 'our' ? '胜' : result.winner === 'their' ? '负' : '平'} ${result.levelDiff}级 (${result.totalHands}把)`

  return (
    <div className="popup show" onClick={(e) => e.target.classList.contains('popup') && onClose()}>
      <div className="popup-content">
        <div className="popup-title">{title}</div>
        <div className="popup-message">{message}</div>
        <div className="popup-buttons">
          <button className="btn btn-success" onClick={() => onNewGame(true)}>新局(不变)</button>
          <button className="btn btn-primary" onClick={() => onNewGame(false)}>换队新局</button>
        </div>
      </div>
    </div>
  )
}