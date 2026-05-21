/**
 * 情商分数计算与段位判定工具
 */

// 情商段位配置（福格模型优化：每个段位都有自嘲幽默感，低段位也愿意分享）
// 每个段位提供4条随机文案，避免千篇一律
const LEVELS = [
  {
    min: 0, max: 20, name: '社恐本恐', emoji: '🥲', color: '#8B8B8B',
    shareTexts: [
      '我凭实力把天聊成了独角戏 🫡',
      '社交这块我算是拿捏了……拿捏得死死的 💀',
      '我的情商余额已欠费，请充值后再聊 📱',
      '别人社交靠嘴，我社交靠运气 🎲'
    ]
  },
  {
    min: 21, max: 40, name: '话题终结者', emoji: '💀', color: '#CD853F',
    shareTexts: [
      '我把天聊死了，但死得很精彩 🤣',
      '每句话都精准踩雷，这也算天赋吧 💣',
      '我能一秒把热聊变冷场，你行吗？🥶',
      '聊天记录翻出来全是我的尴尬名场面 📸'
    ]
  },
  {
    min: 41, max: 60, name: '佛系社交', emoji: '🧘', color: '#6B8E23',
    shareTexts: [
      '我不是不会说话，我只是懒得说 🧘',
      '勉强活着，全靠对方不嫌弃 😅',
      '社交嘛，随缘吧，缘到了自然会聊 🌊',
      '我的社交策略：不主动、不拒绝、但经常后悔 🤷'
    ]
  },
  {
    min: 61, max: 80, name: '人间清醒', emoji: '😎', color: '#4682B4',
    shareTexts: [
      '我一眼看穿你的套路，但我不说 😎',
      '高情商不是会说好话，是知道什么时候闭嘴 🤫',
      '社恐和社牛之间，我选择了社精 👀',
      '我不是情商高，是对方太配合 😏'
    ]
  },
  {
    min: 81, max: 100, name: '社交天花板', emoji: '🔥', color: '#FF4500',
    shareTexts: [
      '全场社交我天花板，不服来战 🔥',
      '我说话的时候，空气都变甜了 ✨',
      '社交界的天花板，就是我本人 🏆',
      '我能把社恐聊成社牛，信不信？💪'
    ]
  }
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

  // 随机选一条分享文案
  const shareText = level.shareTexts[Math.floor(Math.random() * level.shareTexts.length)];

  return {
    score,
    name: level.name,
    emoji: level.emoji,
    shareText,
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
