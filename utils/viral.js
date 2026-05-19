/**
 * 裂变与留存机制工具集
 */

/**
 * 检查场景是否已解锁
 * @param {string} sceneId - 场景ID
 * @returns {boolean}
 */
function isSceneUnlocked(sceneId) {
  const unlocked = wx.getStorageSync('unlocked_scenes') || [];
  const freeScenes = ['scene_001', 'scene_002', 'scene_003', 'scene_004', 'scene_005'];

  if (freeScenes.includes(sceneId)) return true;
  return unlocked.includes(sceneId);
}

/**
 * 通过分享解锁场景
 * @param {string} shareType - 'share' | 'invite'
 * @returns {string[]} 新解锁的场景ID列表
 */
function unlockByShare(shareType) {
  const unlocked = wx.getStorageSync('unlocked_scenes') || [];
  const allScenes = ['scene_006', 'scene_007', 'scene_008', 'scene_009', 'scene_010'];
  const locked = allScenes.filter(id => !unlocked.includes(id));

  let newUnlocked = [];

  if (shareType === 'share') {
    // 分享一次解锁3个
    newUnlocked = locked.slice(0, 3);
  } else if (shareType === 'invite') {
    // 邀请新用户解锁5个
    newUnlocked = locked.slice(0, 5);
  }

  const updated = [...new Set([...unlocked, ...newUnlocked])];
  wx.setStorageSync('unlocked_scenes', updated);

  return newUnlocked;
}

/**
 * 记录每日打卡
 * @returns {object} { streak, isTodayDone }
 */
function recordDailyCheck() {
  const now = new Date();
  const today = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
  const lastDate = wx.getStorageSync('daily_last_date') || '';
  let streak = wx.getStorageSync('daily_streak') || 0;
  let isTodayDone = false;

  if (lastDate === today) {
    // 今天已经打过卡了
    isTodayDone = true;
  } else {
    // 检查是否连续
    const yesterday = new Date(now.getTime() - 86400000);
    const yesterdayStr = `${yesterday.getFullYear()}-${yesterday.getMonth() + 1}-${yesterday.getDate()}`;

    if (lastDate === yesterdayStr) {
      streak += 1;
    } else {
      streak = 1;
    }

    wx.setStorageSync('daily_last_date', today);
    wx.setStorageSync('daily_streak', streak);
    isTodayDone = true;
  }

  return { streak, isTodayDone };
}

/**
 * 获取徽章信息
 * @returns {object[]} 徽章列表
 */
function getBadges() {
  const streak = wx.getStorageSync('daily_streak') || 0;
  const history = wx.getStorageSync('game_history') || [];
  const playCount = history.length;

  const badges = [
    {
      id: 'first_play',
      name: '初出茅庐',
      emoji: '🌱',
      desc: '完成第一次情商挑战',
      unlocked: playCount >= 1
    },
    {
      id: 'streak_3',
      name: '坚持三天',
      emoji: '🔥',
      desc: '连续3天完成每日挑战',
      unlocked: streak >= 3
    },
    {
      id: 'streak_7',
      name: '情商修炼者',
      emoji: '🧘',
      desc: '连续7天完成每日挑战',
      unlocked: streak >= 7
    },
    {
      id: 'play_5',
      name: '社交达人',
      emoji: '🤝',
      desc: '完成5次情商挑战',
      unlocked: playCount >= 5
    },
    {
      id: 'score_80',
      name: '人间清醒',
      emoji: '😎',
      desc: '单次得分超过80分',
      unlocked: history.some(h => h.score >= 80)
    },
    {
      id: 'score_95',
      name: '社交天花板',
      emoji: '👑',
      desc: '单次得分超过95分',
      unlocked: history.some(h => h.score >= 95)
    }
  ];

  return badges;
}

/**
 * 保存分享记录（用于裂变追踪）
 * @param {string} shareType - 分享类型
 * @param {string} targetId - 目标场景ID
 */
function recordShare(shareType, targetId) {
  const shareHistory = wx.getStorageSync('share_history') || [];
  shareHistory.push({
    type: shareType,
    targetId,
    time: new Date().getTime()
  });
  wx.setStorageSync('share_history', shareHistory);

  // 如果是分享解锁类型，自动解锁
  if (shareType === 'result_share' || shareType === 'pk_share') {
    unlockByShare('share');
  }
}

module.exports = {
  isSceneUnlocked,
  unlockByShare,
  recordDailyCheck,
  getBadges,
  recordShare
};
