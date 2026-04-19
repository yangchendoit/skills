export default function StatsPage({ stats, onClearAll }) {
  const players = Object.entries(stats.players || {}).sort((a, b) => b[1].wins - a[1].wins)

  const handleClearAll = () => {
    if (stats.totalGames === 0) return
    if (confirm('确定清空所有统计数据？')) {
      onClearAll()
    }
  }

  return (
    <div className="page active">
      <div className="section">
        <div className="section-title">
          <span>📊 统计</span>
          {stats.totalGames > 0 && (
            <button className="clear-btn" onClick={handleClearAll}>清空</button>
          )}
        </div>
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-number">{stats.totalGames || 0}</div>
            <div className="stat-label">总局数</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{stats.rounds || 0}</div>
            <div className="stat-label">总轮数</div>
          </div>
        </div>
        <div className="player-stats-title">👤 玩家战绩</div>
        {players.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📊</div>
            <div style={{ fontSize: 18, marginTop: 'var(--space-md)' }}>暂无数据</div>
          </div>
        ) : (
          players.map(([name, data]) => (
            <div key={name} className="player-stat-item">
              <div className="player-stat-name">{name}</div>
              <div className="player-stat-info">{data.wins}胜 / {data.games}局 ({Math.round(data.wins / data.games * 100)}%)</div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}