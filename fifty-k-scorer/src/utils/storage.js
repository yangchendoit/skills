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
export const calculateLevel = (totalScore) => Math.round(totalScore / 100);

export const calculateHandScore = (baseScore, bombs, tourBonus) => {
  const bombScore = bombs.reduce((sum, b) => sum + b, 0);
  return baseScore + bombScore + tourBonus;
};

export const determineWinner = (ourLevel, theirLevel, ourTotal, theirTotal) => {
  if (ourLevel > theirLevel) return 'our';
  if (theirLevel > ourLevel) return 'their';
  if (ourTotal > theirTotal) return 'our';
  if (theirTotal > ourTotal) return 'their';
  return 'draw';
};