/**
 * 情商分数计算与段位判定工具
 */

// 情商段位配置（福格模型优化：每个段位都有自嘲幽默感，低段位也愿意分享）
const LEVELS = [
  { min: 0, max: 20, name: '社恐本恐', emoji: '🥲', shareText: '我选了最真实的那种尴尬，真实到想消失💀', color: '#8B8B8B' },
  { min: 21, max: 40, name: '话题终结者', emoji: '💀', shareText: '我把天聊死了，但死得很精彩🤣', color: '#CD853F' },
  { min: 41, max: 60, name: '佛系社交', emoji: '🧘', shareText: '我不是不会说话，我只是懒得说🧘', color: '#6B8E23' },
  { min: 61, max: 80, name: '人间清醒', emoji: '😎', shareText: '我一眼看穿你的套路，但我不说😎', color: '#4682B4' },
  { min: 81, max: 100, name: '社交天花板', emoji: '🔥', shareText: '全场社交我天花板，不服来战🔥', color: '#FF4500' }
];

/**
 * 根据总分计算情商段位
 * @param {number} totalScore - 总得分
 * @param {number} sceneCount - 场景数量
 * @returns {object} 段位信息
 */
function getLevel(totalScore, sceneCount) {
  // 将总分映射到0-100区间
  const maxPossible = sceneCount * 90; // 每题最高90分
  const minPossible = sceneCount * 10; // 每题最低10分
  const normalized = Math.round(((totalScore - minPossible) / (maxPossible - minPossible)) * 100);
  const score = Math.max(0, Math.min(100, normalized));

  const level = LEVELS.find(l => score >= l.min && score <= l.max) || LEVELS[0];

  return {
    score,
    name: level.name,
    emoji: level.emoji,
    shareText: level.shareText,
    color: level.color
  };
}

/**
 * 获取所有段位列表（用于展示）
 */
function getAllLevels() {
  return LEVELS;
}

/**
 * 计算单个场景的得分评价
 * @param {string} level - 'low' | 'mid' | 'high'
 * @returns {string} 评价文字
 */
function getOptionLabel(level) {
  const labels = {
    low: '低情商回复',
    mid: '中等情商回复',
    high: '高情商回复'
  };
  return labels[level] || '';
}

module.exports = {
  getLevel,
  getAllLevels,
  getOptionLabel,
  LEVELS
};
