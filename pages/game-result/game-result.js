const eqCalc = require('../../utils/eq-calculator');
const viral = require('../../utils/viral');

Page({
  data: {
    score: 0,
    name: '',
    emoji: '',
    shareText: '',
    color: '#4ecdc4',
    totalScore: 0,
    sceneCount: 0,
    showUnlockHint: false,
    newUnlockCount: 0
  },

  onLoad(options) {
    const score = parseInt(options.score) || 0;
    const name = decodeURIComponent(options.name || '');
    const emoji = decodeURIComponent(options.emoji || '');
    const shareText = decodeURIComponent(options.shareText || '');
    const color = decodeURIComponent(options.color || '#4ecdc4');
    const totalScore = parseInt(options.totalScore) || 0;
    const sceneCount = parseInt(options.sceneCount) || 5;

    this.setData({ score, name, emoji, shareText, color, totalScore, sceneCount });

    // 等 canvas 渲染完再绘制
    setTimeout(() => this.drawShareCard(), 100);
  },

  // 绘制分享卡片（Canvas 2D API）
  drawShareCard() {
    const query = this.createSelectorQuery();
    query.select('#shareCard').fields({ node: true, size: true }).exec((res) => {
      if (!res[0] || !res[0].node) return;

      const canvas = res[0].node;
      const ctx = canvas.getContext('2d');
      const dpr = wx.getSystemInfoSync().pixelRatio;
      const cssW = 270;   // CSS 像素（屏幕宽度的一半）
      const cssH = 480;   // CSS 像素（按 9:16 比例）

      // 实际渲染尺寸 = CSS尺寸 × 设备像素比
      canvas.width = cssW * dpr;
      canvas.height = cssH * dpr;
      ctx.scale(dpr, dpr);

      const { score, name, emoji, shareText, color } = this.data;

      // 背景渐变
      const grd = ctx.createLinearGradient(0, 0, cssW, cssH);
      grd.addColorStop(0, '#1a1a2e');
      grd.addColorStop(1, '#16213e');
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, cssW, cssH);

      // 装饰圆
      ctx.beginPath();
      ctx.arc(cssW - 70, 70, 120, 0, 2 * Math.PI);
      ctx.fillStyle = 'rgba(78, 205, 196, 0.06)';
      ctx.fill();

      // Emoji（改用文字 emoji 无需特殊字体）
      ctx.font = 'bold 80px sans-serif';
      ctx.fillStyle = '#fff';
      ctx.textAlign = 'center';
      ctx.fillText(emoji, cssW / 2, 190);

      // 段位名称
      ctx.font = 'bold 38px sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(name, cssW / 2, 250);

      // 分数
      ctx.font = '28px sans-serif';
      ctx.fillStyle = '#8892b0';
      ctx.fillText(score + ' 分', cssW / 2, 295);

      // 分数条背景
      ctx.fillStyle = '#2a3a5a';
      ctx.fillRect(35, 315, cssW - 70, 8);

      // 分数条
      const barWidth = Math.max(4, (score / 100) * (cssW - 70));
      ctx.fillStyle = color;
      ctx.fillRect(35, 315, barWidth, 8);

      // 分享文案（自动换行）
      ctx.font = '22px sans-serif';
      ctx.fillStyle = '#a8b2d1';
      this.wrapText(ctx, shareText, cssW / 2, 370, cssW - 70, 36);

      // 底部文案
      ctx.font = '18px sans-serif';
      ctx.fillStyle = '#5a6380';
      ctx.fillText('长按识别小程序码 来测测你的情商段位', cssW / 2, 430);

      ctx.font = '20px sans-serif';
      ctx.fillStyle = '#4ecdc4';
      ctx.fillText('情商宝典·社交尴尬场景模拟器', cssW / 2, 460);
    });
  },

  // 自动换行文字
  wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const chars = text.split('');
    let line = '';
    let currentY = y;
    ctx.textAlign = 'center';
    for (let i = 0; i < chars.length; i++) {
      const testLine = line + chars[i];
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && i > 0) {
        ctx.fillText(line, x, currentY);
        line = chars[i];
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, currentY);
  },

  // 复制文案
  onCopyText() {
    wx.setClipboardData({
      data: this.data.shareText,
      success: () => {
        wx.showToast({ title: '已复制', icon: 'success' });
      }
    });
  },

  // 保存卡片
  onSaveCard() {
    const query = this.createSelectorQuery();
    query.select('#shareCard').fields({ node: true, size: true }).exec((res) => {
      if (!res[0] || !res[0].node) return;
      const canvas = res[0].node;
      wx.canvasToTempFilePath({
        canvas,
        success: (r) => {
          wx.saveImageToPhotosAlbum({
            filePath: r.tempFilePath,
            success: () => wx.showToast({ title: '已保存到相册', icon: 'success' }),
            fail: () => wx.showToast({ title: '请授权保存图片', icon: 'none' })
          });
        }
      });
    });
  },

  // PK挑战
  onPKChallenge() {
    const scenes = require('../../data/scenes');
    const randomScene = scenes[Math.floor(Math.random() * scenes.length)];
    wx.navigateTo({
      url: `/pages/game-play/game-play?mode=pk&pkSceneId=${randomScene.id}`
    });
  },

  // 再来一局
  onRetry() {
    wx.redirectTo({ url: '/pages/game/game' });
  },

  // 分享
  onShareAppMessage() {
    const viral = require('../../utils/viral');
    viral.recordShare('result_share', '');
    const unlocked = viral.unlockByShare('share');
    const unlockMsg = unlocked.length > 0 ? `（已解锁${unlocked.length}个新场景！）` : '';
    return {
      title: `我的情商段位是【${this.data.name}】${this.data.emoji}，你敢来挑战吗？`,
      path: '/pages/game/game',
      imageUrl: ''
    };
  }
});
