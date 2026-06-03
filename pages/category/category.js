// pages/category/category.js - 知识库首页（六个分类平铺）
const app = getApp()
const { getTypeInfo } = require('../../utils/constants')
// 直接加载数据，不依赖 app.globalData 的加载时序
const _knowledgeItems = require('../../data/knowledge_structured.js')

const MODULE_DEFS = [
  { id: '情商基础',   emoji: '📚', color: '#f5a623', bg: '#fff8ed', children: ['什么是情商', '情绪的基本规律'] },
  { id: '自我认知',   emoji: '🧠', color: '#4ecdc4', bg: '#f0fffe', children: ['认识自己', '自信与价值', '自我激励'] },
  { id: '情绪管理',   emoji: '😊', color: '#e84393', bg: '#fef0f7', children: ['觉察与识别', '调节与释放', '情绪急救'] },
  { id: '沟通表达',   emoji: '💬', color: '#3498db', bg: '#f0f8ff', children: ['表达技巧', '倾听与共情', '识人术'] },
  { id: '人际关系',   emoji: '🤝', color: '#6c5ce7', bg: '#f5f3ff', children: ['社交技巧', '职场关系'] },
  { id: '个人成长',   emoji: '🌱', color: '#00b894', bg: '#f0faf5', children: ['阳光心态', '逆商与韧性', '快乐修炼', '专注与意志力'] },
]

Page({
  data: {
    modules: [],
    totalCount: 0,
    expandedPath: '',
  },

  _cacheBySub: {},

  onLoad() {
    this.buildModules()
    wx.showShareMenu({ withShareTicket: true, menus: ['shareAppMessage', 'shareTimeline'] })
  },

  onShow() {
    const oldPath = this.data.expandedPath
    this.buildModules()
    if (oldPath && this._cacheBySub[oldPath]) {
      this.restoreItems(oldPath)
    }
  },

  buildModules() {
    const items = _knowledgeItems || []
    const pathCount = {}
    const pathItems = {}
    items.forEach(item => {
      const p = item.path || ''
      if (!p) return
      pathCount[p] = (pathCount[p] || 0) + 1
      if (!pathItems[p]) pathItems[p] = []
      pathItems[p].push(item)
    })
    this._cacheBySub = pathItems

    const modules = MODULE_DEFS.map(def => {
      let totalCount = 0
      const children = def.children.map(name => {
        const path = def.id + '/' + name
        const count = pathCount[path] || 0
        totalCount += count
        return { name, path, count, expanded: false, expandedData: null }
      })
      return { id: def.id, emoji: def.emoji, color: def.color, bg: def.bg, totalCount, children }
    })

    const total = modules.reduce((sum, m) => sum + m.totalCount, 0)
    this.setData({ modules, totalCount: total })
  },

  toggleChild(e) {
    const mi = parseInt(e.currentTarget.dataset.mi)
    const ci = parseInt(e.currentTarget.dataset.ci)
    const child = this.data.modules[mi] && this.data.modules[mi].children[ci]
    if (!child) return
    const path = child.path

    if (this.data.expandedPath === path) {
      // 收起
      const modules = JSON.parse(JSON.stringify(this.data.modules))
      modules[mi].children[ci].expanded = false
      modules[mi].children[ci].expandedData = null
      this.setData({ modules, expandedPath: '' })
    } else {
      this.expandChild(mi, ci, path)
    }
  },

  expandChild(mi, ci, path) {
    const all = this._cacheBySub[path] || []
    const pageSize = 10
    const items = this.mapItems(all.slice(0, pageSize))
    const hasMore = all.length > pageSize

    // 深拷贝整个 modules，确保 setData 检测到变化
    const modules = JSON.parse(JSON.stringify(this.data.modules))

    // 收起之前展开的
    const oldPath = this.data.expandedPath
    if (oldPath) {
      for (const mod of modules) {
        for (const child of mod.children) {
          if (child.path === oldPath) {
            child.expanded = false
            child.expandedData = null
          }
        }
      }
    }

    // 展开目标
    modules[mi].children[ci].expanded = true
    modules[mi].children[ci].expandedData = { items, hasMore, showNoMore: items.length > 0 && !hasMore }

    this.setData({ modules, expandedPath: path })
  },

  loadMore(e) {
    const mi = parseInt(e.currentTarget.dataset.mi)
    const ci = parseInt(e.currentTarget.dataset.ci)
    const child = this.data.modules[mi] && this.data.modules[mi].children[ci]
    if (!child) return
    const path = child.path
    const all = this._cacheBySub[path] || []
    const currentItems = (child.expandedData && child.expandedData.items) || []
    const pageSize = 10
    const next = this.mapItems(all.slice(currentItems.length, currentItems.length + pageSize))
    const newItems = currentItems.concat(next)
    const hasMore = newItems.length < all.length

    const modules = JSON.parse(JSON.stringify(this.data.modules))
    modules[mi].children[ci].expandedData = {
      items: newItems,
      hasMore,
      showNoMore: newItems.length > 0 && !hasMore,
    }

    this.setData({ modules })
  },

  restoreItems(path) {
    let mi = -1, ci = -1
    this.data.modules.forEach((mod, i) => {
      mod.children.forEach((child, j) => {
        if (child.path === path) { mi = i; ci = j }
      })
    })
    if (mi < 0) return

    const all = this._cacheBySub[path] || []
    const pageSize = 10
    const items = this.mapItems(all.slice(0, pageSize))
    const hasMore = all.length > pageSize

    const modules = JSON.parse(JSON.stringify(this.data.modules))
    modules[mi].children[ci].expanded = true
    modules[mi].children[ci].expandedData = { items, hasMore, showNoMore: items.length > 0 && !hasMore }

    this.setData({ modules })
  },

  mapItems(items) {
    return items.map(item => {
      const info = getTypeInfo(item.tp)
      return {
        _id: item.id,
        title: item.t,
        description: (item.description || '').slice(0, 60),
        type: item.tp,
        typeLabel: info.label,
        typeColor: info.color,
        tags: (item.tg || []).slice(0, 3),
        readTime: (item.content || {}).read_time || '',
        hasLearned: app.isLearned ? app.isLearned(item.id) : false,
      }
    })
  },

  goDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({ url: '/pages/detail/detail?id=' + id })
  },

  onShareAppMessage() {
    return { title: '情商宝典 - 知识库', path: '/pages/category/category' }
  },
})
