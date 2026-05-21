const scenes = require('../../data/scenes');
const eqCalc = require('../../utils/eq-calculator');

Page({
  data: {
    currentScene: null,
    currentIndex: 0,
    totalScenes: 5,
    progress: 0,
    selectedOption: -1,
    showFeedback: false,
    feedbackLevel: '',
    feedbackEmoji: '',
    feedbackLabel: '',
    feedbackText: '',
    selectedIndex: -1,
    scores: [],
    sceneList: [],
    isLast: false,
    levelLabels: {
      low: '低情商',
      mid: '中情商',
      high: '高情商'
    }
  },

  onLoad(options) {
    const mode = options.mode || 'category';
    const category = options.category || 'campus';
    const sceneIndex = options.sceneIndex ? parseInt(options.sceneIndex) : -1;
    const pkSceneId = options.pkSceneId || ''; // PK模式：好友分享的场景ID

    let sceneList = [];

    if (mode === 'pk' && pkSceneId) {
      // 福格·Prompt：好友PK模式，点进来直接玩同一场景
      const found = scenes.find(s => s.id === pkSceneId);
      sceneList = found ? [found] : [scenes[0]];
    } else if (mode === 'daily' && sceneIndex >= 0) {
      // 今日挑战模式：只玩1个场景
      sceneList = [scenes[sceneIndex]];
    } else {
      // 福格·Ability：首次体验只玩3题，降低门槛
      const isFirstTime = !wx.getStorageSync('game_history');
      const count = isFirstTime ? 3 : 5;
      const filtered = scenes.filter(s => s.category === category);
      sceneList = this.shuffleArray([...filtered]).slice(0, count);
      if (sceneList.length === 0) {
        sceneList = this.shuffleArray([...scenes]).slice(0, count);
      }
    }

    const totalScenes = sceneList.length;

    this.setData({
      sceneList,
      totalScenes,
      mode
    });

    this.loadScene(0);
  },

  // 加载场景
  loadScene(index) {
    const scene = this.data.sceneList[index];
    // 打乱选项顺序，防止正确答案固定位置泄露
    const shuffledOptions = this.shuffleArray([...scene.options]);
    const shuffledScene = { ...scene, options: shuffledOptions };
    const progress = ((index) / this.data.totalScenes) * 100;

    this.setData({
      currentScene: shuffledScene,
      currentIndex: index,
      progress,
      selectedOption: -1,
      showFeedback: false,
      selectedIndex: -1,
      isLast: index === this.data.totalScenes - 1
    });
  },

  // 选择选项
  onSelectOption(e) {
    if (this.data.showFeedback) return;

    const index = e.currentTarget.dataset.index;
    const option = this.data.currentScene.options[index];

    this.setData({
      selectedOption: index,
      selectedIndex: index,
      showFeedback: true,
      feedbackLevel: option.level,
      feedbackEmoji: option.level === 'high' ? '🎯' : option.level === 'mid' ? '🤔' : '😅',
      feedbackLabel: eqCalc.getOptionLabel(option.level),
      feedbackText: option.feedback
    });

    // 记录得分
    this.data.scores.push(option.score);
  },

  // 下一题
  onNext() {
    const nextIndex = this.data.currentIndex + 1;

    if (nextIndex >= this.data.totalScenes) {
      // 跳转结果页
      const totalScore = this.data.scores.reduce((a, b) => a + b, 0);
      const sceneCount = this.data.totalScenes;
      const levelInfo = eqCalc.getLevel(totalScore, sceneCount);

      // 收集翻车信息：找出得分最低的那一题
      const minScore = Math.min(...this.data.scores);
      const failIndex = this.data.scores.indexOf(minScore);
      const failScene = this.data.sceneList[failIndex];
      let failReason = '';
      if (failScene) {
        // 找到用户选的那个选项
        // scores里存的是每题得分，需要重新匹配
        const failOption = failScene.options.find(o => o.score === minScore) ||
                           failScene.options.find(o => o.level === 'low');
        if (failOption) {
          failReason = failOption.text;
        }
      }

      // 保存游戏记录
      const history = wx.getStorageSync('game_history') || [];
      history.push({
        score: levelInfo.score,
        name: levelInfo.name,
        totalScore,
        sceneCount,
        time: new Date().getTime()
      });
      wx.setStorageSync('game_history', history);

      wx.redirectTo({
        url: `/pages/game-result/game-result?score=${levelInfo.score}&name=${encodeURIComponent(levelInfo.name)}&emoji=${encodeURIComponent(levelInfo.emoji)}&shareText=${encodeURIComponent(levelInfo.shareText)}&color=${encodeURIComponent(levelInfo.color)}&totalScore=${totalScore}&sceneCount=${sceneCount}&failReason=${encodeURIComponent(failReason)}&failScene=${encodeURIComponent(failScene ? failScene.title : '')}`
      });
    } else {
      this.loadScene(nextIndex);
    }
  },

  // 打乱数组
  shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  },

  // 福格·Motivation+Prompt：分享标题从"测情商"改为挑战式，激发好友参与欲
  onShareAppMessage() {
    const scene = this.data.currentScene;
    const selectedIdx = this.data.selectedIndex;
    if (scene && selectedIdx >= 0) {
      const myChoice = ['A', 'B', 'C'][selectedIdx];
      return {
        title: `这道题我选了${myChoice}，你会选啥？👀`,
        path: `/pages/game-play/game-play?mode=pk&pkSceneId=${scene.id}`,
        imageUrl: ''
      };
    }
    return {
      title: '你能活过几关？90%的人死在第3题🔥',
      path: '/pages/game/game',
      imageUrl: ''
    };
  }
});
