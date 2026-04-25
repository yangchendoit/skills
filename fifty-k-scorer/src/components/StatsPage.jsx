import { useState } from 'react'
import { BOMB_LABELS } from '../utils/storage'

export default function StatsPage({ stats }) {
  const [expandedPlayer, setExpandedPlayer] = useState(null)
  const players = Object.entries(stats.players || {}).sort((a, b) => b[1].wins - a[1].wins)
  const bombRanking = Object.entries(stats.players || {})
    .filter(([, data]) => data.bombs > 0)
    .sort((a, b) => b[1].bombScore - a[1].bombScore)

  const togglePlayer = (name) => {
    setExpandedPlayer(expandedPlayer === name ? null : name)
  }

  // 根据胜率生成称号
  const getPlayerTitle = (winRate, games) => {
    if (games === 0) return '🐣 新手上路'
    if (winRate >= 80) return '👑 牌桌霸主'
    if (winRate >= 60) return '😎 常胜将军'
    if (winRate >= 50) return '🙂 胜多负少'
    if (winRate >= 40) return '😅 五五开选手'
    if (winRate >= 20) return '😬 陪跑专业户'
    return '💀 人形沙包'
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
          <span>🏆 江湖排行</span>
        </div>
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-number">{stats.totalGames || 0}</div>
            <div className="stat-label">血战场数</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{stats.rounds || 0}</div>
            <div className="stat-label">历经轮数</div>
          </div>
        </div>
        <div className="player-stats-title">⚔️ 各路英雄</div>
        {players.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🃏</div>
            <div style={{ fontSize: 18, marginTop: 'var(--space-md)' }}>还没人上过牌桌？</div>
          </div>
        ) : (
          players.map(([name, data]) => {
            const isExpanded = expandedPlayer === name
            const winRate = data.games > 0 ? Math.round(data.wins / data.games * 100) : 0
            return (
              <div key={name} className="player-stat-card">
                <div className="player-stat-header" onClick={() => togglePlayer(name)}>
                  <div className="player-stat-main">
                    <span className="player-name">{name}</span>
                    <span className="player-win-rate">{winRate}%</span>
                  </div>
                  <div className="player-stat-summary">
                    <span>{data.wins}胜{data.games - data.wins}负</span>
                    {data.level !== undefined && <span className="level-badge">{data.level >= 0 ? '+' : ''}{data.level}级</span>}
                  </div>
                  <div className="player-max-level">{getPlayerTitle(winRate, data.games)}</div>
                  <span className={`expand-icon ${isExpanded ? 'expanded' : ''}`}>▼</span>
                </div>
                {isExpanded && (
                  <div className="player-stat-detail">
                    <div className="detail-row">
                      <span>出场次数</span>
                      <span>{data.games}局</span>
                    </div>
                    <div className="detail-row">
                      <span>拿下几局</span>
                      <span>{data.wins}局</span>
                    </div>
                    <div className="detail-row">
                      <span>胜率</span>
                      <span>{winRate}%</span>
                    </div>
                    {data.level !== undefined && (
                      <div className="detail-row">
                        <span>累计涨跌</span>
                        <span className={data.level >= 0 ? 'text-accent' : 'text-red'}>{data.level >= 0 ? '+' : ''}{data.level}级</span>
                      </div>
                    )}
                    {data.maxLevel !== undefined && (
                      <div className="detail-row">
                        <span>巅峰时刻</span>
                        <span className="level-badge">+{data.maxLevel}级</span>
                      </div>
                    )}
                    {data.bombs > 0 && (
                      <>
                        <div className="detail-row">
                          <span>投弹次数</span>
                          <span>{data.bombs}颗 💣</span>
                        </div>
                        <div className="detail-row">
                          <span>炸出总分</span>
                          <span>{data.bombScore}分</span>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>

      {bombRanking.length > 0 && (
        <div className="section">
          <div className="section-title"><span>💣 炸弹狂人榜</span></div>
          {bombRanking.map(([name, data], index) => {
            const bombTypes = data.bombTypes || {}
            return (
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
                  <span>扔了 {data.bombs} 颗雷</span>
                  <span>炸出 {data.bombScore} 分</span>
                </div>
                {Object.keys(bombTypes).length > 0 && (
                  <div className="bomb-types-row">
                    {Object.entries(bombTypes).map(([score, count]) => (
                      <span key={score} className="bomb-type-tag">{BOMB_LABELS[score]}×{count}</span>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}