// pages/category/category.js
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
    pageSize: 20,
    hasMore: false,
  },

  // 模块内容缓存：{ [moduleId]: items[] }
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

  loadModule(id, forceReload = false) {
    const meta = MODULE_META[id] || {}

    // 构建 currentModule（供页面渲染模块标题/描述）
    this.setData({
      currentModule: {
        id,
        name: MODULE_NAMES[id] || id,
        emoji: meta.emoji || '📌',
        desc: meta.desc || '',
        tools: (MODULE_TOOLS[id] || []).map(tid => (TOOL_META[tid] || {}).name).filter(Boolean)
      },
      moduleTools: (MODULE_TOOLS[id] || []).map(tid => ({
        id: tid,
        ...(TOOL_META[tid] || {})
      }))
    })

    // 命中有效缓存（非空数组）才使用缓存
    if (!forceReload && this._cache[id] && this._cache[id].length > 0) {
      this.setData({ items: this._cache[id] })
      return
    }

    const tags = MODULE_TAGS[id] || []
    const allItems = app.globalData.items || []

    // 如果全局数据为空，强制从缓存或重新加载（避免初始化的时序问题）
    if (allItems.length === 0) {
      if (this._cache[id] && this._cache[id].length > 0) {
        this.setData({ items: this._cache[id] })
      }
      return
    }

    // 如果缓存是上次遗留的空数组（污染缓存），清除它并强制刷新
    if (this._cache[id] && this._cache[id].length === 0) {
      delete this._cache[id]
    }

    console.log('[category] loadModule("' + id + '") tags=' + JSON.stringify(tags) + ' totalItems=' + allItems.length)

    const items = allItems.filter(item =>
      (item.tg || []).some(t => tags.some(tag => t.includes(tag) || tag.includes(t)))
    ).map(item => {
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

    console.log('[category] matched ' + items.length + ' items for module "' + id + '"')
    this._cache[id] = items

    // 分页：只显示前 pageSize 条
    var pageSize = this.data.pageSize || 20
    var displayItems = items.slice(0, pageSize)
    this.setData({
      items: displayItems,
      hasMore: items.length > pageSize,
    })
  },

  loadMore() {
    var id = this.data.currentTab
    var allItems = this._cache[id] || []
    var currentCount = this.data.items.length
    var pageSize = this.data.pageSize || 20
    var newCount = Math.min(currentCount + pageSize, allItems.length)
    this.setData({
      items: allItems.slice(0, newCount),
      hasMore: newCount < allItems.length,
    })
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
