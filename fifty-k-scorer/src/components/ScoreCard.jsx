export default function ScoreCard({ players, scores }) {
  return (
    <article className="score-card">
      <div className="team-grid">
        <div className="team our">
          <div className="team-name">我方</div>
          <div className="team-players">
            {players.our.filter(p => p).join(' & ') || '点击上方设置'}
          </div>
          <div className="score">{scores.ourTotal}分</div>
          <div className="level">
            <span className="level-badge">{scores.ourLevel}级</span>
          </div>
        </div>
        <div className="vs">VS</div>
        <div className="team their">
          <div className="team-name">对方</div>
          <div className="team-players">
            {players.their.filter(p => p).join(' & ') || '点击上方设置'}
          </div>
          <div className="score">{scores.theirTotal}分</div>
          <div className="level">
            <span className="level-badge">{scores.theirLevel}级</span>
          </div>
        </div>
      </div>
    </article>
  )
}