const db = wx.cloud ? wx.cloud.database() : null;

Page({
  data: {
    topList: [],
    rankList: [],
    myRank: 0,
    myScore: 0,
    myLevelName: ''
  },

  onLoad() {
    this.loadRankData();
  },

  onShow() {
    this.loadRankData();
  },

  // 加载排行榜数据
  loadRankData() {
    // 尝试从云数据库获取
    if (db) {
      this.loadFromCloud();
    } else {
      // 降级：从本地存储获取
      this.loadFromLocal();
    }
  },

  // 从云数据库加载
  loadFromCloud() {
    db.collection('eq_rank')
      .orderBy('score', 'desc')
      .limit(50)
      .get()
      .then(res => {
        this.processRankData(res.data);
      })
      .catch(() => {
        this.loadFromLocal();
      });
  },

  // 从本地存储加载（降级方案）
  loadFromLocal() {
    const history = wx.getStorageSync('game_history') || [];
    if (history.length > 0) {
      const latest = history[history.length - 1];
      this.setData({
        rankList: [{
          nickName: '我',
          score: latest.score || 0,
          levelName: latest.name || ''
        }],
        topList: [{
          nickName: '我',
          score: latest.score || 0,
          levelName: latest.name || ''
        }],
        myRank: 1,
        myScore: latest.score || 0,
        myLevelName: latest.name || ''
      });
    }
  },

  // 处理排行数据
  processRankData(data) {
    const rankList = data.map((item, index) => ({
      ...item,
      _rankIndex: index
    }));

    const topList = rankList.slice(0, 3);

    // 找自己的排名
    const userInfo = wx.getStorageSync('user_info') || {};
    const myItem = rankList.find(item => item.openid === userInfo.openid);
    const myRank = myItem ? rankList.indexOf(myItem) + 1 : 0;
    const myScore = myItem ? myItem.score : 0;
    const myLevelName = myItem ? myItem.levelName : '';

    this.setData({
      topList,
      rankList,
      myRank,
      myScore,
      myLevelName
    });
  },

  goPlay() {
    wx.navigateTo({
      url: '/pages/game/game'
    });
  },

  onShareAppMessage() {
    return {
      title: '情商排行榜来了，看看你排第几🔥',
      path: '/pages/game-rank/game-rank',
      imageUrl: ''
    };
  }
});
