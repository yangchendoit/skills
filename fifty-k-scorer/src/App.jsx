import { useState, useEffect, useCallback } from 'react'
import { storage, BOMB_LABELS, TOUR_BONUSES, calculateLevel, calculateHandScore, determineWinner, computeStatsFromHistory } from './utils/storage'
import SetupPopup from './components/SetupPopup'
import SettlePopup from './components/SettlePopup'
import RulesPopup from './components/RulesPopup'
import ScoreCard from './components/ScoreCard'
import BombSection from './components/BombSection'
import HandList from './components/HandList'
import HistoryPage from './components/HistoryPage'
import StatsPage from './components/StatsPage'

const initialState = {
  ourTeam: { baseScore: 0, bombs: [], tourBonus: 0, players: ['', ''] },
  theirTeam: { baseScore: 0, bombs: [], tourBonus: 0, players: ['', ''] },
  roundNum: 1,
  handNum: 1,
  isSettled: false,
  accumulated: { our: { totalScore: 0, hands: [] }, their: { totalScore: 0, hands: [] } },
  tour: 'none'
}

export default function App() {
  const [gameData, setGameData] = useState(() => {
    const savedPlayers = storage.get('scoring_players')
    return {
      ...initialState,
      ourTeam: { ...initialState.ourTeam, players: savedPlayers?.our || ['', ''] },
      theirTeam: { ...initialState.theirTeam, players: savedPlayers?.their || ['', ''] }
    }
  })

  // 输入框显示值的字符串状态
  const [ourBaseInput, setOurBaseInput] = useState('')
  const [theirBaseInput, setTheirBaseInput] = useState('')

  const [currentPage, setCurrentPage] = useState('scoring')
  const [showSetup, setShowSetup] = useState(false)
  const [showSettle, setShowSettle] = useState(false)
  const [showRules, setShowRules] = useState(false)
  const [settleResult, setSettleResult] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [history, setHistory] = useState(() => storage.get('scoring_history', []))
  const stats = computeStatsFromHistory(history)

  // 计算当前分数
  const calculateScores = useCallback(() => {
    const ourHandScore = calculateHandScore(
      gameData.ourTeam.baseScore,
      gameData.ourTeam.bombs,
      gameData.ourTeam.tourBonus
    )
    const theirHandScore = calculateHandScore(
      gameData.theirTeam.baseScore,
      gameData.theirTeam.bombs,
      gameData.theirTeam.tourBonus
    )
    const ourTotal = gameData.accumulated.our.totalScore + ourHandScore
    const theirTotal = gameData.accumulated.their.totalScore + theirHandScore
    return {
      ourHandScore,
      theirHandScore,
      ourTotal,
      theirTotal,
      ourLevel: calculateLevel(ourTotal),
      theirLevel: calculateLevel(theirTotal)
    }
  }, [gameData])

  const scores = calculateScores()

  // 更新基础分（联动计算）
  const updateBaseScore = (team, value) => {
    // 只允许输入数字
    const numStr = value.replace(/[^0-9]/g, '')
    const numValue = parseInt(numStr) || 0
    const clampedValue = Math.max(0, Math.min(200, numValue))

    if (team === 'our') {
      setOurBaseInput(numStr)
      const theirBase = Math.max(0, Math.min(200, 200 - clampedValue))
      setTheirBaseInput(theirBase.toString())
      setGameData(prev => ({
        ...prev,
        ourTeam: { ...prev.ourTeam, baseScore: clampedValue },
        theirTeam: { ...prev.theirTeam, baseScore: theirBase }
      }))
    } else {
      setTheirBaseInput(numStr)
      const ourBase = Math.max(0, Math.min(200, 200 - clampedValue))
      setOurBaseInput(ourBase.toString())
      setGameData(prev => ({
        ...prev,
        theirTeam: { ...prev.theirTeam, baseScore: clampedValue },
        ourTeam: { ...prev.ourTeam, baseScore: ourBase }
      }))
    }
  }

  // 更新游次
  const updateTour = (tour) => {
    const [ourBonus, theirBonus] = TOUR_BONUSES[tour] || [0, 0]
    setGameData(prev => ({
      ...prev,
      tour,
      ourTeam: { ...prev.ourTeam, tourBonus: ourBonus },
      theirTeam: { ...prev.theirTeam, tourBonus: theirBonus }
    }))
  }

  // 炸弹操作
  const addBomb = (team, score) => {
    if (gameData.isSettled) { alert('本局已结算，请开始新局'); return }
    setGameData(prev => ({
      ...prev,
      [team === 'our' ? 'ourTeam' : 'theirTeam']: {
        ...prev[team === 'our' ? 'ourTeam' : 'theirTeam'],
        bombs: [...prev[team === 'our' ? 'ourTeam' : 'theirTeam'].bombs, score]
      }
    }))
  }

  const removeBomb = (team, index) => {
    setGameData(prev => {
      const teamKey = team === 'our' ? 'ourTeam' : 'theirTeam'
      const newBombs = [...prev[teamKey].bombs]
      newBombs.splice(index, 1)
      return { ...prev, [teamKey]: { ...prev[teamKey], bombs: newBombs } }
    })
  }

  const clearBombs = (team) => {
    if (!confirm('确定清空？')) return
    setGameData(prev => ({
      ...prev,
      [team === 'our' ? 'ourTeam' : 'theirTeam']: { ...prev[team === 'our' ? 'ourTeam' : 'theirTeam'], bombs: [] }
    }))
  }

  // 记录本把
  const recordHand = () => {
    if (gameData.isSettled) { alert('本局已结算，请开始新局'); return }
    if (scores.ourHandScore === 0 && scores.theirHandScore === 0) {
      alert('本把没有分数变化')
      return
    }

    const ourHand = {
      baseScore: gameData.ourTeam.baseScore,
      bombScore: gameData.ourTeam.bombs.reduce((s, b) => s + (b.score || b), 0),
      bombs: [...gameData.ourTeam.bombs],
      tourBonus: gameData.ourTeam.tourBonus,
      totalScore: scores.ourHandScore
    }
    const theirHand = {
      baseScore: gameData.theirTeam.baseScore,
      bombScore: gameData.theirTeam.bombs.reduce((s, b) => s + (b.score || b), 0),
      bombs: [...gameData.theirTeam.bombs],
      tourBonus: gameData.theirTeam.tourBonus,
      totalScore: scores.theirHandScore
    }

    setGameData(prev => ({
      ...prev,
      accumulated: {
        our: {
          totalScore: prev.accumulated.our.totalScore + scores.ourHandScore,
          hands: [...prev.accumulated.our.hands, ourHand]
        },
        their: {
          totalScore: prev.accumulated.their.totalScore + scores.theirHandScore,
          hands: [...prev.accumulated.their.hands, theirHand]
        }
      },
      handNum: prev.handNum + 1,
      ourTeam: { ...prev.ourTeam, baseScore: 0, bombs: [], tourBonus: 0 },
      theirTeam: { ...prev.theirTeam, baseScore: 0, bombs: [], tourBonus: 0 },
      tour: 'none'
    }))
    // 重置输入框
    setOurBaseInput('')
    setTheirBaseInput('')
  }

  // 结算本局
  const settleGame = () => {
    if (gameData.isSettled) { alert('本局已结算'); return }
    if (!gameData.ourTeam.players[0] || !gameData.ourTeam.players[1] ||
        !gameData.theirTeam.players[0] || !gameData.theirTeam.players[1]) {
      alert('请先设置所有玩家姓名')
      setShowSetup(true)
      return
    }

    // 计算含当前把的最终分数
    const hasCurrentHand = scores.ourHandScore > 0 || scores.theirHandScore > 0
    const finalOurTotal = scores.ourTotal + (hasCurrentHand ? scores.ourHandScore : 0)
    const finalTheirTotal = scores.theirTotal + (hasCurrentHand ? scores.theirHandScore : 0)
    const finalOurLevel = calculateLevel(finalOurTotal)
    const finalTheirLevel = calculateLevel(finalTheirTotal)
    const winner = determineWinner(finalOurLevel, finalTheirLevel, finalOurTotal, finalTheirTotal)

    // 构建最终hands列表（含当前把）
    const ourHands = [...gameData.accumulated.our.hands]
    const theirHands = [...gameData.accumulated.their.hands]
    if (hasCurrentHand) {
      ourHands.push({
        baseScore: gameData.ourTeam.baseScore,
        bombScore: gameData.ourTeam.bombs.reduce((s, b) => s + (b.score || b), 0),
        bombs: [...gameData.ourTeam.bombs],
        tourBonus: gameData.ourTeam.tourBonus,
        totalScore: scores.ourHandScore
      })
      theirHands.push({
        baseScore: gameData.theirTeam.baseScore,
        bombScore: gameData.theirTeam.bombs.reduce((s, b) => s + (b.score || b), 0),
        bombs: [...gameData.theirTeam.bombs],
        tourBonus: gameData.theirTeam.tourBonus,
        totalScore: scores.theirHandScore
      })
    }
    const totalHands = ourHands.length

    const newHistory = {
      id: Date.now(),
      timestamp: new Date().toLocaleString('zh-CN'),
      round: gameData.roundNum,
      totalHands,
      ourTeam: { players: [...gameData.ourTeam.players], totalScore: finalOurTotal, level: finalOurLevel, hands: ourHands },
      theirTeam: { players: [...gameData.theirTeam.players], totalScore: finalTheirTotal, level: finalTheirLevel, hands: theirHands },
      levelDiff: finalOurLevel - finalTheirLevel,
      winner
    }

    const updatedHistory = [newHistory, ...history].slice(0, 100)
    setHistory(updatedHistory)
    storage.set('scoring_history', updatedHistory)

    setSettleResult({
      winner,
      levelDiff: Math.abs(finalOurLevel - finalTheirLevel),
      ourTotal: finalOurTotal,
      theirTotal: finalTheirTotal,
      ourLevel: finalOurLevel,
      theirLevel: finalTheirLevel,
      totalHands,
      ourHands,
      theirHands
    })
    setShowSettle(true)
    setShowResult(true)
    setOurBaseInput('')
    setTheirBaseInput('')
    setGameData(prev => ({ ...prev, isSettled: true }))
  }

  // 新局
  const newGame = (keepTeams) => {
    if (!gameData.isSettled) { alert('请先结算当前局'); return }

    let newPlayers = {
      our: [...gameData.ourTeam.players],
      their: [...gameData.theirTeam.players]
    }
    if (!keepTeams) {
      // 交换一名玩家
      ;[newPlayers.our[0], newPlayers.their[0]] = [newPlayers.their[0], newPlayers.our[0]]
    }

    storage.set('scoring_players', newPlayers)

    setGameData({
      ...initialState,
      ourTeam: { ...initialState.ourTeam, players: newPlayers.our },
      theirTeam: { ...initialState.theirTeam, players: newPlayers.their },
      roundNum: gameData.roundNum + 1
    })
    // 重置输入框
    setOurBaseInput('')
    setTheirBaseInput('')
    setShowSettle(false)
    setShowResult(false)
    if (!keepTeams) setShowSetup(true)
  }

  // 重置当前把
  const resetHand = () => {
    if (!confirm('确定重置本把？')) return
    setGameData(prev => ({
      ...prev,
      ourTeam: { ...prev.ourTeam, baseScore: 0, bombs: [], tourBonus: 0 },
      theirTeam: { ...prev.theirTeam, baseScore: 0, bombs: [], tourBonus: 0 },
      tour: 'none'
    }))
    // 重置输入框
    setOurBaseInput('')
    setTheirBaseInput('')
  }

  // 保存玩家
  const savePlayers = (players) => {
    setGameData(prev => ({
      ...prev,
      ourTeam: { ...prev.ourTeam, players: players.our },
      theirTeam: { ...prev.theirTeam, players: players.their }
    }))
    storage.set('scoring_players', players)
    setShowSetup(false)
  }

  // 删除把手
  const removeHand = (index) => {
    setGameData(prev => {
      const ourHand = prev.accumulated.our.hands[index]
      const theirHand = prev.accumulated.their.hands[index]
      const newOurHands = [...prev.accumulated.our.hands]
      const newTheirHands = [...prev.accumulated.their.hands]
      newOurHands.splice(index, 1)
      newTheirHands.splice(index, 1)
      return {
        ...prev,
        accumulated: {
          our: { totalScore: prev.accumulated.our.totalScore - ourHand.totalScore, hands: newOurHands },
          their: { totalScore: prev.accumulated.their.totalScore - theirHand.totalScore, hands: newTheirHands }
        },
        handNum: prev.handNum - 1
      }
    })
  }

  return (
    <div className="container">
      <header className="header">
        <h1>⚔️ 五十K记分器 ⚔️</h1>
      </header>

      <main>
        {currentPage === 'scoring' && (
          <div className="page active">
            <div className="game-status">
              <span>第 <span className="round">{gameData.roundNum}</span> 局</span>
              <span>第 <span className="hand-num">{gameData.handNum}</span> 把</span>
              <span className={gameData.isSettled ? 'settled' : 'unsettled'}>
                {gameData.isSettled ? '已结算' : '未结算'}
              </span>
              <button className="setup-btn" onClick={() => setShowSetup(true)}>👥 设置玩家</button>
            </div>

            <ScoreCard
              players={{
                our: gameData.ourTeam.players,
                their: gameData.theirTeam.players
              }}
              scores={scores}
            />

            <HandList
              hands={{
                our: gameData.accumulated.our.hands,
                their: gameData.accumulated.their.hands
              }}
              onRemove={removeHand}
            />

            <section className="section">
              <div className="section-title">
                <span>🎯 基础分</span>
                <span style={{fontSize: '12px', color: '#64748B'}}>总分200，自动计算</span>
              </div>
              <div className="base-score-row">
                <div className="input-group">
                  <label>我方</label>
                  <input
                    type="number"
                    value={ourBaseInput}
                    onChange={(e) => updateBaseScore('our', e.target.value)}
                    min="0"
                    max="200"
                    placeholder="0"
                  />
                </div>
                <div className="input-group">
                  <label>对方</label>
                  <input
                    type="number"
                    value={theirBaseInput}
                    onChange={(e) => updateBaseScore('their', e.target.value)}
                    min="0"
                    max="200"
                    placeholder="0"
                  />
                </div>
              </div>
            </section>

            <section className="section">
              <div className="section-title">
                <span>💣 炸弹</span>
                <button className="help-btn" onClick={() => setShowRules(true)}>❓</button>
              </div>
              <div className="two-columns">
                <BombSection
                  team="our"
                  label="我方"
                  bombs={gameData.ourTeam.bombs}
                  players={gameData.ourTeam.players}
                  onAdd={addBomb}
                  onRemove={removeBomb}
                  onClear={clearBombs}
                  disabled={gameData.isSettled}
                />
                <BombSection
                  team="their"
                  label="对方"
                  bombs={gameData.theirTeam.bombs}
                  players={gameData.theirTeam.players}
                  onAdd={addBomb}
                  onRemove={removeBomb}
                  onClear={clearBombs}
                  disabled={gameData.isSettled}
                />
              </div>
            </section>

            <section className="section">
              <div className="section-title"><span>🎮 游次</span></div>
              <div className="tour-grid">
                {['none', 'our12', 'our13', 'their12', 'their13'].map(tour => (
                  <div key={tour} className="tour-option">
                    <input
                      type="radio"
                      id={`tour-${tour}`}
                      name="tour"
                      value={tour}
                      checked={gameData.tour === tour}
                      onChange={() => updateTour(tour)}
                    />
                    <label htmlFor={`tour-${tour}`}>
                      {tour === 'none' ? '无' :
                       tour === 'our12' ? '我方12游' :
                       tour === 'our13' ? '我方13游' :
                       tour === 'their12' ? '对方12游' : '对方13游'}
                    </label>
                  </div>
                ))}
              </div>
            </section>

            <div className="action-row">
              {scores.ourTotal >= 1000 || scores.theirTotal >= 1000 ? (
                <button className="btn btn-danger" onClick={settleGame}>结算本局</button>
              ) : (
                <button className="btn btn-success" onClick={recordHand}>记录本把</button>
              )}
              <button className="btn btn-secondary" onClick={resetHand}>重置本把</button>
            </div>

            {showResult && settleResult && (
              <div className="result-card" style={{ display: 'block' }}>
                <div className="result-emoji">
                  {settleResult.winner === 'our' ? '🎉' : settleResult.winner === 'their' ? '😔' : '🤝'}
                </div>
                <div className="result-title">
                  {settleResult.winner === 'our' ? '我方获胜！' :
                   settleResult.winner === 'their' ? '对方获胜' : '平局'}
                </div>
                <div className="result-detail">
                  级数差：{settleResult.levelDiff}级 | 我方{settleResult.ourLevel}级 vs 对方{settleResult.theirLevel}级 ({settleResult.totalHands}把)
                </div>
                <div className="result-players">
                  {gameData.ourTeam.players.join(' & ')} vs {gameData.theirTeam.players.join(' & ')}
                </div>
              </div>
            )}
          </div>
        )}

        {currentPage === 'history' && (
          <HistoryPage
            history={history}
            searchTerm={searchTerm}
            onSearch={setSearchTerm}
            onDelete={(id) => {
              const updated = history.filter(h => h.id !== id)
              setHistory(updated)
              storage.set('scoring_history', updated)
            }}
            onClearAll={() => {
              setHistory([])
              storage.remove('scoring_history')
            }}
          />
        )}

        {currentPage === 'stats' && (
          <StatsPage stats={stats} />
        )}
      </main>

      <nav className="nav">
        {['scoring', 'history', 'stats'].map(page => (
          <button
            key={page}
            className={`nav-btn ${currentPage === page ? 'active' : ''}`}
            data-page={page}
            onClick={() => setCurrentPage(page)}
          >
            {page === 'scoring' ? '记分' : page === 'history' ? '历史' : '统计'}
          </button>
        ))}
      </nav>

      {showSetup && (
        <SetupPopup
          players={{ our: gameData.ourTeam.players, their: gameData.theirTeam.players }}
          onSave={savePlayers}
          onClose={() => setShowSetup(false)}
        />
      )}

      {showSettle && settleResult && (
        <SettlePopup
          result={settleResult}
          players={{ our: gameData.ourTeam.players, their: gameData.theirTeam.players }}
          hands={{ our: settleResult.ourHands, their: settleResult.theirHands }}
          onNewGame={newGame}
          onClose={() => setShowSettle(false)}
        />
      )}

      {showRules && <RulesPopup onClose={() => setShowRules(false)} />}
    </div>
  )
}