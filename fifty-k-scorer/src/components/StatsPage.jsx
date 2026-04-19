export default function StatsPage({ stats, onClearAll }) {
  const players = Object.entries(stats.players || {}).sort((a, b) => b[1].wins - a[1].wins)
  const bombRanking = Object.entries(stats.players || {})
    .filter(([, data]) => data.bombs > 0)
    .sort((a, b) => b[1].bombScore - a[1].bombScore)

  const handleClearAll = () => {
    if (stats.totalGames === 0) return
    if (confirm('确定清空所有统计数据？')) {
      onClearAll()
    }
  }

  // 幽默称号生成
  const getBombTitle = (index, bombScore) => {
    if (bombScore >= 10000) return '💣 炸弹之神'
    if (bombScore >= 5000) return '🔥 炸弹大师'
    if (bombScore >= 2000) return '💥 爆破专家'
    if (bombScore >= 1000) return '🎯 炸弹好手'
    if (bombScore >= 500) return '🧨 小试牛刀'
    return '🎆 初出茅庐'
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

      {bombRanking.length > 0 && (
        <div className="section">
          <div className="section-title"><span>💣 炸弹榜</span></div>
          {bombRanking.map(([name, data], index) => (
            <div key={name} className="bomb-rank-item">
              <div className="bomb-rank-header">
                <span className="bomb-rank-name">
                  {index === 0 && '🥇 '}
                  {index === 1 && '🥈 '}
                  {index === 2 && '🥉 '}
                  {name}
                </span>
                <span className="bomb-rank-title">{getBombTitle(index, data.bombScore)}</span>
              </div>
              <div className="bomb-rank-stats">
                <span>投弹 {data.bombs} 颗</span>
                <span>总分 {data.bombScore}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}