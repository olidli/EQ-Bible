// pages/category/category.js
// 优化：统一使用 constants.js，移除硬编码的 MODULES / TOOL_CARDS

const app = getApp()
const {
  getTypeInfo, MODULE_TAGS,
  MODULE_NAMES, MODULE_META, MODULE_TOOLS,
  TOOL_META
} = require('../../utils/constants')

Page({
  data: {
    categories: Object.entries(MODULE_NAMES).map(([id, name]) => ({
      id,
      name,
      emoji: (MODULE_META[id] || {}).emoji || '📌'
    })),
    currentTab: 'emotion',
    currentModule: null,
    moduleTools: [],
    items: [],
  },

  // ✅ 模块内容缓存：{ [moduleId]: items[] }
  _cache: {},

  onLoad(options) {
    const id = options.id || app.globalData.categoryFilter || 'emotion'
    this.setData({ currentTab: id })
    this.loadModule(id)
    wx.showShareMenu({ withShareTicket: true, menus: ['shareAppMessage', 'shareTimeline'] })
  },

  onShow() {
    if (app.globalData.categoryFilter) {
      const id = app.globalData.categoryFilter
      app.globalData.categoryFilter = null
      this.setData({ currentTab: id })
      this.loadModule(id)
    }
  },

  switchTab(e) {
    const id = e.currentTarget.dataset.id
    this.setData({ currentTab: id })
    this.loadModule(id)
  },

  loadModule(id) {
    const meta = MODULE_META[id] || {}

    // 构建 currentModule（供页面渲染模块标题/描述）
    this.setData({
      currentModule: {
        id,
        name: MODULE_NAMES[id] || id,
        emoji: meta.emoji || '📌',
        desc: meta.desc || '',
        // 工具名称列表（用于展示"包含工具：xx、yy"）
        tools: (MODULE_TOOLS[id] || []).map(tid => (TOOL_META[tid] || {}).name).filter(Boolean)
      },
      // 工具卡片列表（供页面渲染可点击的工具卡片）
      moduleTools: (MODULE_TOOLS[id] || []).map(tid => ({
        id: tid,
        ...(TOOL_META[tid] || {})
      }))
    })

    // ✅ 命中缓存直接渲染
    if (this._cache[id]) {
      this.setData({ items: this._cache[id] })
      return
    }

    const tags = MODULE_TAGS[id] || []
    const items = app.searchByTags(tags, 20).map(item => {
      const ti = getTypeInfo(item.tp)
      return {
        _id: item.id,
        title: item.t,
        type: item.tp,
        typeLabel: ti.label,
        typeColor: ti.color,
        tags: (item.tg || []).slice(0, 4),
      }
    })

    // ✅ 写入缓存
    this._cache[id] = items
    this.setData({ items })
  },

  openTool(e) {
    app.globalData.toolFilter = e.currentTarget.dataset.tool
    wx.switchTab({ url: '/pages/tools/tools' })
  },

  goDetail(e) {
    wx.navigateTo({ url: '/pages/detail/detail?id=' + e.currentTarget.dataset.id })
  },

  onShareAppMessage() {
    const mod = this.data.currentModule
    return {
      title: mod ? `EQ情商宝典 · ${mod.name}` : 'EQ情商宝典 · 知识库',
      path: `/pages/category/category?id=${this.data.currentTab}`,
    }
  },

  onShareTimeline() {
    const mod = this.data.currentModule
    return {
      title: mod ? `EQ情商宝典 · ${mod.name}` : 'EQ情商宝典 · 提升情商从这里开始',
      query: `id=${this.data.currentTab}`,
    }
  },
})
