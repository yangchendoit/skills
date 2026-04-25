// 本地存储工具
export const storage = {
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  },
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('Storage error:', e);
    }
  },
  remove: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error('Storage error:', e);
    }
  }
};

// 常量
export const BOMB_LABELS = {
  200: '5张',
  500: '6张',
  1000: '7张',
  2000: '8张',
  5000: '9张',
  10000: '10张'
};

export const TOUR_BONUSES = {
  none: [0, 0],
  our12: [200, -200],
  our13: [100, -100],
  their12: [-200, 200],
  their13: [-100, 100]
};

// 计算工具函数
export const calculateLevel = (totalScore) => {
  // 每100分为1级，四舍五入
  // 对于负分，-50到-149为-1级，-150到-249为-2级，以此类推
  if (totalScore >= 0) {
    return Math.round(totalScore / 100);
  } else if (totalScore > -50) {
    // -49 到 0 的负分，四舍五入到 0 级
    return 0;
  } else {
    // -50 及以下的负分
    return Math.floor((totalScore + 49) / 100);
  }
};

export const calculateHandScore = (baseScore, bombs, tourBonus) => {
  const bombScore = bombs.reduce((sum, b) => sum + (b.score || b), 0);
  return baseScore + bombScore + tourBonus;
};

export const determineWinner = (ourLevel, theirLevel, ourTotal, theirTotal) => {
  if (ourLevel > theirLevel) return 'our';
  if (theirLevel > ourLevel) return 'their';
  if (ourTotal > theirTotal) return 'our';
  if (theirTotal > ourTotal) return 'their';
  return 'draw';
};

export const computeStatsFromHistory = (history) => {
  const players = {}
  let totalGames = 0
  let rounds = 0

  const ensurePlayer = (name) => {
    if (!players[name]) players[name] = { games: 0, wins: 0, bombs: 0, bombScore: 0, level: 0, maxLevel: 0, bombTypes: {} }
  }

  history.forEach(record => {
    totalGames++
    rounds = Math.max(rounds, record.round || 0)

    const ourPlayers = record.ourTeam.players
    const theirPlayers = record.theirTeam.players
    const winner = record.winner
    const levelDiff = Math.abs(record.levelDiff)
    const ourLevelChange = winner === 'our' ? levelDiff : winner === 'their' ? -levelDiff : 0

    ;[...ourPlayers, ...theirPlayers].forEach(name => {
      ensurePlayer(name)
      players[name].games++
      const isOur = ourPlayers.includes(name)
      if ((winner === 'our' && isOur) || (winner === 'their' && !isOur)) players[name].wins++
      const change = isOur ? ourLevelChange : -ourLevelChange
      players[name].level += change
      players[name].maxLevel = Math.max(players[name].maxLevel, players[name].level)
    })

    const countBombs = (hands) => hands.forEach(hand =>
      (hand.bombs || []).forEach(bomb => {
        const score = bomb.score || bomb
        const player = bomb.player
        if (player && players[player]) {
          players[player].bombs++
          players[player].bombScore += score
          players[player].bombTypes[score] = (players[player].bombTypes[score] || 0) + 1
        }
      })
    )
    countBombs(record.ourTeam.hands || [])
    countBombs(record.theirTeam.hands || [])
  })

  return { totalGames, rounds, players }
};