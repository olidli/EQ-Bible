const scenes = require('../../data/scenes');
const eqCalc = require('../../utils/eq-calculator');
const viral = require('../../utils/viral');

Page({
  data: {
    dailyScene: {},
    dailyDay: 1,
    streak: 0,
    playedCount: 0,
    avgScore: '--',
    bestLevel: '--',
    dailyPlayedCount: 0
  },

  onLoad() {
    this.loadDailyChallenge();
    this.loadStats();
    // 福格·Prompt：首次进入请求订阅消息权限
    this.requestSubscribe();
  },

  onShow() {
    this.loadStats();
  },

  // 福格·Prompt：订阅消息，每日推送提醒用户回来
  requestSubscribe() {
    const subscribed = wx.getStorageSync('daily_subscribed');
    if (!subscribed) {
      wx.requestSubscribeMessage({
        tmplIds: ['your_template_id'], // 需要在微信后台配置模板
        success: () => {
          wx.setStorageSync('daily_subscribed', true);
        },
        fail: () => {
          // 用户拒绝，不强制
        }
      });
    }
  },

  // 加载今日挑战
  loadDailyChallenge() {
    const now = new Date();
    const dayOfYear = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 86400000);
    const index = dayOfYear % scenes.length;
    const dailyScene = scenes[index];

    // 连续打卡天数
    const streak = viral.recordDailyCheck().streak || 0;

    // 模拟已挑战人数（实际可用云数据库统计）
    const dailyPlayedCount = (dayOfYear * 137 + 42) % 999 + 100;

    this.setData({
      dailyScene,
      dailyDay: dayOfYear,
      streak,
      dailyPlayedCount
    });
  },

  // 加载个人战绩
  loadStats() {
    const history = wx.getStorageSync('game_history') || [];
    const playedCount = history.length;
    let avgScore = '--';
    let bestLevel = '--';

    if (playedCount > 0) {
      const totalScores = history.map(h => h.score);
      const avg = Math.round(totalScores.reduce((a, b) => a + b, 0) / totalScores.length);
      avgScore = avg;

      const best = Math.max(...totalScores);
      const levelInfo = eqCalc.getLevel(best, 5);
      bestLevel = levelInfo.emoji + levelInfo.name;
    }

    this.setData({ playedCount, avgScore, bestLevel });
  },

  // 今日挑战
  onDailyChallenge() {
    const now = new Date();
    const dayOfYear = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 86400000);
    const index = dayOfYear % scenes.length;

    // 记录打卡
    viral.recordDailyCheck();

    wx.navigateTo({
      url: `/pages/game-play/game-play?mode=daily&sceneIndex=${index}`
    });
  },

  // 开始游戏
  onStartGame(e) {
    const category = e.currentTarget.dataset.category;
    const categoryScenes = scenes.filter(s => s.category === category);
    if (categoryScenes.length === 0) {
      wx.showToast({ title: '该分类暂无场景', icon: 'none' });
      return;
    }
    wx.navigateTo({
      url: `/pages/game-play/game-play?mode=category&category=${category}`
    });
  },

  // 排行榜
  goRank() {
    wx.navigateTo({
      url: '/pages/game-rank/game-rank'
    });
  },

  // 福格·Motivation：分享标题改为挑战式
  onShareAppMessage() {
    return {
      title: '你能活过几关？90%的人死在第3题🔥',
      path: '/pages/game/game',
      imageUrl: ''
    };
  }
});
