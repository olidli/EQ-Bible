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
    failReason: '',
    failScene: '',
    category: 'campus',
    levelRange: '',
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
    const failReason = decodeURIComponent(options.failReason || '');
    const failScene = decodeURIComponent(options.failScene || '');
    const category = decodeURIComponent(options.category || 'campus');

    // 计算段位区间描述
    const levelRange = this.getLevelRange(score);

    this.setData({ score, name, emoji, shareText, color, totalScore, sceneCount, failReason, failScene, category, levelRange });

    // 等 canvas 渲染完再绘制
    setTimeout(() => this.drawShareCard(), 150);
  },

  // 根据分数返回段位区间描述
  getLevelRange(score) {
    if (score <= 20) return '0-20 · 社恐本恐';
    if (score <= 40) return '21-40 · 话题终结者';
    if (score <= 60) return '41-60 · 佛系社交';
    if (score <= 80) return '61-80 · 人间清醒';
    return '81-100 · 社交天花板';
  },

  // 绘制分享卡片（Canvas 2D API）—— 重制版
  drawShareCard() {
    const query = this.createSelectorQuery();
    query.select('#shareCard').fields({ node: true, size: true }).exec((res) => {
      if (!res[0] || !res[0].node) return;

      const canvas = res[0].node;
      const ctx = canvas.getContext('2d');
      const dpr = wx.getSystemInfoSync().pixelRatio;
      const cssW = 280;
      const cssH = 420;

      canvas.width = cssW * dpr;
      canvas.height = cssH * dpr;
      ctx.scale(dpr, dpr);

      const { score, name, emoji, shareText, color, levelRange, failScene } = this.data;

      // === 1. 背景 ===
      const grd = ctx.createLinearGradient(0, 0, cssW, cssH);
      grd.addColorStop(0, '#1a1a2e');
      grd.addColorStop(1, '#16213e');
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, cssW, cssH);

      // === 2. 装饰圆 ===
      ctx.beginPath();
      ctx.arc(cssW - 40, 50, 120, 0, 2 * Math.PI);
      ctx.fillStyle = 'rgba(78, 205, 196, 0.06)';
      ctx.fill();

      ctx.textAlign = 'center';

      // === 3. 段位名称 ===
      ctx.font = 'bold 32px sans-serif';
      ctx.fillStyle = color;
      ctx.fillText(name, cssW / 2, 120);

      // === 4. 分数 ===
      const scoreStr = score + '';
      ctx.font = 'bold 52px sans-serif';
      ctx.fillStyle = '#ffffff';
      const scoreW = ctx.measureText(scoreStr).width;
      ctx.fillText(scoreStr, cssW / 2 - 16, 185);

      ctx.font = '18px sans-serif';
      ctx.fillStyle = '#8892b0';
      ctx.fillText('分', cssW / 2 + 28, 185);

      // === 5. 段位区间 ===
      ctx.font = '14px sans-serif';
      ctx.fillStyle = '#5a6380';
      ctx.fillText(levelRange, cssW / 2, 218);

      // === 6. 分数条 ===
      const barX = 30;
      const barY = 240;
      const barW = cssW - 60;
      const barH = 8;

      ctx.fillStyle = '#2a3a5a';
      this.roundRect(ctx, barX, barY, barW, barH, 4);
      ctx.fill();

      const barGrd = ctx.createLinearGradient(barX, barY, barX + barW, barY);
      barGrd.addColorStop(0, '#4ecdc4');
      barGrd.addColorStop(1, color);
      const fillW = Math.max(10, (score / 100) * barW);
      ctx.fillStyle = barGrd;
      this.roundRect(ctx, barX, barY, fillW, barH, 4);
      ctx.fill();

      // === 7. 翻车场景 ===
      if (failScene) {
        ctx.font = '14px sans-serif';
        ctx.fillStyle = '#e94560';
        ctx.fillText('翻车场景', cssW / 2, 280);

        ctx.font = '13px sans-serif';
        ctx.fillStyle = '#a8b2d1';
        this.wrapText(ctx, failScene, cssW / 2, 300, cssW - 40, 20);
      }

      // === 8. 分享文案（去 emoji） ===
      const cleanText = shareText.replace(/[\u{1F300}-\u{1F9FF}]/gu, '').trim();
      const textStartY = failScene ? 350 : 295;
      ctx.font = '16px sans-serif';
      ctx.fillStyle = '#e6f1ff';
      this.wrapText(ctx, '"' + cleanText + '"', cssW / 2, textStartY, cssW - 40, 22);

      // === 9. 底部品牌 ===
      ctx.font = '13px sans-serif';
      ctx.fillStyle = '#4ecdc4';
      ctx.fillText('情商宝典 · 社死模拟器', cssW / 2, 400);
    });
  },

  // 绘制圆角矩形
  roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.arcTo(x + w, y, x + w, y + r, r);
    ctx.lineTo(x + w, y + h - r);
    ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
    ctx.lineTo(x + r, y + h);
    ctx.arcTo(x, y + h, x, y + h - r, r);
    ctx.lineTo(x, y + r);
    ctx.arcTo(x, y, x + r, y, r);
    ctx.closePath();
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

  // 再刷一次（同分类重玩）
  onRetry() {
    wx.redirectTo({
      url: `/pages/game-play/game-play?mode=category&category=${this.data.category}`
    });
  },

  // 换个场景挑战（跳到分类选择页）
  onChangeScene() {
    wx.redirectTo({ url: '/pages/game/game' });
  },

  // PK挑战
  onPKChallenge() {
    const scenes = require('../../data/scenes');
    const randomScene = scenes[Math.floor(Math.random() * scenes.length)];
    wx.redirectTo({
      url: `/pages/game-play/game-play?mode=pk&pkSceneId=${randomScene.id}`
    });
  },

  // 分享
  onShareAppMessage() {
    const viral = require('../../utils/viral');
    viral.recordShare('result_share', '');
    const unlocked = viral.unlockByShare('share');
    return {
      title: `我的情商段位是【${this.data.name}】${this.data.emoji}，你敢来挑战吗？`,
      path: '/pages/game/game',
      imageUrl: ''
    };
  }
});
