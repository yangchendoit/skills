import { BOMB_LABELS } from '../utils/storage'

const TOUR_LABEL = { '200': '我12游', '100': '我13游', '-200': '对12游', '-100': '对13游' }

function TeamScore({ hand, color }) {
  if (!hand) return <div style={{ color: '#555' }}>-</div>
  const bombs = (hand.bombs || []).map(b => BOMB_LABELS[b.score || b] || (b.score || b))
  const tour = hand.tourBonus ? TOUR_LABEL[String(hand.tourBonus)] : null
  return (
    <div>
      <div style={{ fontSize: '16px', fontWeight: 'bold', color }}>
        {hand.totalScore > 0 ? '+' : ''}{hand.totalScore}
      </div>
      <div style={{ fontSize: '11px', color: '#999', marginTop: '2px' }}>
        基础 {hand.baseScore > 0 ? '+' : ''}{hand.baseScore}
        {bombs.length > 0 && <span>　炸 {bombs.join(' ')}</span>}
        {tour && <span>　{tour}</span>}
      </div>
    </div>
  )
}

export default function SettlePopup({ result, players, hands, onNewGame, onClose }) {
  const title = result.winner === 'our' ? '🎉 我方获胜！' :
                result.winner === 'their' ? '😔 对方获胜' : '🤝 平局'
  const maxHands = Math.max((hands?.our?.length || 0), (hands?.their?.length || 0))

  return (
    <div className="popup show" onClick={(e) => e.target.classList.contains('popup') && onClose()}>
      <div className="popup-content" style={{ maxHeight: '85vh', overflowY: 'auto' }}>
        <div className="popup-title">{title}</div>

        {/* 总览 */}
        <div style={{ display: 'flex', justifyContent: 'space-around', margin: '12px 0', textAlign: 'center' }}>
          <div>
            <div style={{ fontSize: '12px', color: '#aaa' }}>{players.our.join(' & ')}</div>
            <div style={{ fontSize: '22px', fontWeight: 'bold' }}>{result.ourLevel}级</div>
            <div style={{ fontSize: '12px', color: '#aaa' }}>{result.ourTotal}分</div>
          </div>
          <div style={{ alignSelf: 'center', textAlign: 'center' }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: result.winner === 'our' ? '#4caf50' : result.winner === 'their' ? '#f44336' : '#aaa' }}>
              {result.winner === 'draw' ? '平' : (result.winner === 'our' ? '+' : '-') + result.levelDiff}
            </div>
            <div style={{ fontSize: '11px', color: '#666' }}>级差　{result.totalHands}把</div>
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#aaa' }}>{players.their.join(' & ')}</div>
            <div style={{ fontSize: '22px', fontWeight: 'bold' }}>{result.theirLevel}级</div>
            <div style={{ fontSize: '12px', color: '#aaa' }}>{result.theirTotal}分</div>
          </div>
        </div>

        {/* 逐把明细 */}
        {maxHands > 0 && (
          <div style={{ borderTop: '1px solid #333', paddingTop: '8px' }}>
            <div style={{ display: 'flex', fontSize: '11px', color: '#666', marginBottom: '4px', padding: '0 4px' }}>
              <div style={{ width: '24px' }}></div>
              <div style={{ flex: 1, textAlign: 'center' }}>我方</div>
              <div style={{ flex: 1, textAlign: 'center' }}>对方</div>
            </div>
            {Array.from({ length: maxHands }).map((_, i) => {
              const our = hands.our[i]
              const their = hands.their[i]
              const ourWin = (our?.totalScore || 0) > (their?.totalScore || 0)
              const theirWin = (their?.totalScore || 0) > (our?.totalScore || 0)
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', padding: '6px 4px', borderBottom: '1px solid #2a2a2a' }}>
                  <div style={{ width: '24px', fontSize: '11px', color: '#555', flexShrink: 0 }}>{i + 1}</div>
                  <div style={{ flex: 1, textAlign: 'center' }}>
                    <TeamScore hand={our} color={ourWin ? '#4caf50' : theirWin ? '#f44336' : '#ccc'} />
                  </div>
                  <div style={{ flex: 1, textAlign: 'center' }}>
                    <TeamScore hand={their} color={theirWin ? '#4caf50' : ourWin ? '#f44336' : '#ccc'} />
                  </div>
                </div>
              )
            })}
          </div>
        )}

        <div className="popup-buttons" style={{ marginTop: '12px' }}>
          <button className="btn btn-success" onClick={() => onNewGame(true)}>新局(不变)</button>
          <button className="btn btn-primary" onClick={() => onNewGame(false)}>换队新局</button>
        </div>
      </div>
    </div>
  )
}
