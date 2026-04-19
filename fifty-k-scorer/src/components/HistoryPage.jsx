import { BOMB_LABELS } from '../utils/storage'

export default function HistoryPage({ history, searchTerm, onSearch, onDelete, onClearAll }) {
  const filtered = searchTerm
    ? history.filter(h =>
        h.ourTeam.players.some(p => p.toLowerCase().includes(searchTerm.toLowerCase())) ||
        h.theirTeam.players.some(p => p.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : history

  const toggleExpand = (e) => {
    if (e.target.classList.contains('delete-btn')) return
    e.currentTarget.classList.toggle('expanded')
  }

  const handleClearAll = () => {
    if (history.length === 0) return
    if (confirm('确定清空所有历史记录？')) {
      onClearAll()
    }
  }

  return (
    <div className="page active">
      <div className="section">
        <div className="section-title">
          <span>📜 游戏历史</span>
          {history.length > 0 && (
            <button className="clear-btn" onClick={handleClearAll}>清空</button>
          )}
        </div>
        <div className="search-box">
          <input
            type="text"
            placeholder="🔍 搜索玩家名..."
            value={searchTerm}
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">{searchTerm ? '🔍' : '📭'}</div>
            <div style={{ fontSize: 18, marginTop: 'var(--space-md)' }}>
              {searchTerm ? '没有找到' : '暂无记录'}
            </div>
          </div>
        ) : (
          filtered.map(game => {
            const emoji = game.winner === 'our' ? '🎉' : game.winner === 'their' ? '😔' : '🤝'
            const totalHands = game.totalHands || game.ourTeam.hands?.length || 1
            return (
              <div key={game.id} className="history-item" onClick={toggleExpand}>
                <div className="history-header">
                  <span>第{game.round}局 · {game.timestamp}</span>
                  <button className="delete-btn" onClick={(e) => { e.stopPropagation(); onDelete(game.id) }}>删除</button>
                </div>
                <div className="history-teams">{game.ourTeam.players.join(' & ')} vs {game.theirTeam.players.join(' & ')}</div>
                <div className={`history-result ${game.winner === 'our' ? 'history-winner' : ''}`}>
                  <span>{emoji} {game.winner === 'our' ? game.ourTeam.players.join(' & ') : game.winner === 'their' ? game.theirTeam.players.join(' & ') : '平局'} 胜{Math.abs(game.levelDiff)}级 ({totalHands}把)</span>
                  <span className="history-expand">▼</span>
                </div>
                <div className="history-detail">
                  <div className="history-detail-row"><span className="history-detail-label">总局数</span><span className="history-detail-value">第{game.round}局 · {totalHands}把</span></div>
                  <div className="history-detail-row"><span className="history-detail-label">总分对比</span><span className="history-detail-value">{game.ourTeam.totalScore}分 vs {game.theirTeam.totalScore}分</span></div>
                  <div className="history-detail-row"><span className="history-detail-label">级数对比</span><span className="history-detail-value">{game.ourTeam.level}级 vs {game.theirTeam.level}级</span></div>
                  {game.ourTeam.hands?.length > 0 && game.ourTeam.hands.map((h, i) => {
                    const th = game.theirTeam.hands[i]
                    const ourBombs = (h.bombs || []).map(b => <span key={b} className="history-bomb-tag">{BOMB_LABELS[b]}</span>)
                    const theirBombs = (th?.bombs || []).map(b => <span key={b} className="history-bomb-tag">{BOMB_LABELS[b]}</span>)
                    return (
                      <div key={i} style={{ background: 'rgba(0,0,0,0.2)', borderRadius: 4, padding: 6, marginBottom: 4 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}><span style={{ color: '#64748B' }}>第{i + 1}把</span><span><span style={{ color: 'var(--color-accent)' }}>+{h.totalScore}</span> vs <span style={{ color: 'var(--color-primary)' }}>+{th?.totalScore || 0}</span></span></div>
                        <div style={{ fontSize: 11, color: '#94A3B8' }}>基础:{h.baseScore} vs {th?.baseScore || 0} | 炸弹:{h.bombScore} vs {th?.bombScore || 0}</div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}