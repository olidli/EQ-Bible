// pages/index/index.js
const app = getApp()
const { getTypeInfo, MODULE_TAGS, TOOL_META } = require('../../utils/constants')

// 统计各模块篇数
const calcModuleCounts = (items) => {
  const counts = {}
  Object.entries(MODULE_TAGS).forEach(([id, tags]) => {
    counts[id] = items.filter(item =>
      (item.tg || []).some(t => tags.some(tag => t.includes(tag) || tag.includes(t)))
    ).length
  })
  return counts
}

Page({
  data: { dailyItems: [], progress: 0, learnedCount: 0, totalCount: 0, moduleCounts: {}, toolCount: Object.keys(TOOL_META).length },

  onLoad() {
    const items = app.globalData.items || []
    this.setData({
      totalCount: app.globalData.totalItems,
      moduleCounts: calcModuleCounts(items),
    })
    this.loadDaily()
    this.loadProgress()
    wx.showShareMenu({ withShareTicket: true, menus: ['shareAppMessage', 'shareTimeline'] })
  },
  onShow() { this.loadProgress() },
  onPullDownRefresh() { this.loadDaily(); wx.stopPullDownRefresh() },

  loadDaily() {
    this.setData({
      dailyItems: app.getRandom(5).map(item => {
        const typeInfo = getTypeInfo(item.tp)
        return {
          id: item.id,
          title: item.t,
          type: item.tp,
          typeLabel: typeInfo.label,
          typeColor: typeInfo.color,
          tags: (item.tg || []).slice(0, 3)
        }
      })
    })
  },

  loadProgress() {
    const learned = wx.getStorageSync('learnedItems') || []
    const total = app.globalData.totalItems
    this.setData({
      learnedCount: learned.length,
      progress: total > 0 ? Math.round(learned.length / total * 100) : 0
    })
  },

  goSearch() { wx.navigateTo({ url: '/pages/search/search' }) },
  goDetail(e) { wx.navigateTo({ url: '/pages/detail/detail?id=' + e.currentTarget.dataset.id }) },
  goTools() { wx.switchTab({ url: '/pages/tools/tools' }) },
  goCategory(e) {
    const id = e.currentTarget.dataset.id
    app.globalData.categoryFilter = id
    wx.switchTab({ url: '/pages/category/category' })
  },
  openTool(e) { 
    const toolId = e.currentTarget.dataset.tool
    app.globalData.toolFilter = toolId
    wx.switchTab({ url: '/pages/tools/tools' })
  },
  goRecommend() { this.loadDaily() },
  // 跳转到情绪急救箱
  goEmotionFirstAid() {
    wx.navigateTo({ url: '/pages/emotion-first-aid/emotion-first-aid' })
  },
  // 跳转到社死模拟器游戏
  goGame() {
    wx.navigateTo({ url: '/pages/game/game' })
  },

  onShareAppMessage() {
    return {
      title: 'EQ情商宝典 · 每天5分钟，提升情商',
      path: '/pages/index/index',
      imageUrl: '/images/share_home.png'
    }
  },

  onShareTimeline() {
    return {
      title: 'EQ情商宝典 · 提升情商从这里开始',
      imageUrl: '/images/share_home.png'
    }
  },
})
