// pages/category/category.js
const app = getApp()
const {
  getTypeInfo, MODULE_TAGS,
  MODULE_NAMES, MODULE_META, MODULE_TOOLS,
  TOOL_META
} = require('../../utils/constants')

// 树状目录定义（与 data 中的 path 对应）
const TREE_STRUCT = [
  { id: '情商基础',   emoji: '📚', children: ['什么是情商', '情绪的基本规律', '情商可培养'] },
  { id: '自我认知',   emoji: '🧠', children: ['认识自己', '自信与价值', '自我激励'] },
  { id: '情绪管理',   emoji: '😊', children: ['觉察与识别', '调节与释放', '情绪急救'] },
  { id: '沟通表达',   emoji: '💬', children: ['表达技巧', '倾听与共情', '识人术'] },
  { id: '人际关系',   emoji: '🤝', children: ['社交技巧', '亲密关系', '职场关系'] },
  { id: '个人成长',   emoji: '🌱', children: ['专注与意志力', '逆商与韧性', '阳光心态', '快乐修炼'] },
]

Page({
  data: {
    // 树状导航
    treeTabs: TREE_STRUCT.map(t => ({ ...t, expanded: false, count: 0 })),
    currentTreeTab: '情绪管理',
    // 二级目录列表
    subCategories: [],
    currentSub: '',
    // 内容列表
    items: [],
    itemCount: 0,
    pageSize: 20,
    hasMore: false,
    // 工具推荐
    moduleTools: [],
    moduleEmoji: '',
  },

  // 缓存：按 path 缓存条目
  _cacheBySub: {},
  _cacheByTop: {},

  onLoad(options) {
    this.buildTree()
    const defaultTop = options.top || '情绪管理'
    this.setData({ currentTreeTab: defaultTop })
    this.expandTopTab(defaultTop)
    wx.showShareMenu({ withShareTicket: true, menus: ['shareAppMessage', 'shareTimeline'] })
  },

  onShow() {
    // 重新构建树（数据可能更新）
    this.buildTree()
    if (this.data.currentSub) {
      this.loadItems(this.data.currentSub)
    }
  },

  // 从全局数据构建树状结构
  buildTree() {
    const items = app.globalData.items || []
    // 按 path 统计
    const pathCount = {}
    const pathItems = {}
    items.forEach(item => {
      const p = item.path || ''
      if (!p) return
      pathCount[p] = (pathCount[p] || 0) + 1
      if (!pathItems[p]) pathItems[p] = []
      pathItems[p].push(item)
    })

    // 更新 treeTabs 的 count
    const treeTabs = TREE_STRUCT.map(t => {
      let count = 0
      t.children.forEach(child => {
        const path = t.id + '/' + child
        count += pathCount[path] || 0
      })
      return { ...t, expanded: false, count }
    })

    // 更新子目录列表
    this._cacheBySub = pathItems
    this._cacheByTop = {}
    TREE_STRUCT.forEach(t => {
      let all = []
      t.children.forEach(child => {
        const path = t.id + '/' + child
        const items = pathItems[path] || []
        all = all.concat(items)
      })
      this._cacheByTop[t.id] = all
    })

    this.setData({ treeTabs })
  },

  // 展开/收起一级标签
  toggleTopTab(e) {
    const id = e.currentTarget.dataset.id
    if (this.data.currentTreeTab === id) {
      // 点击同一个：切换展开/收起
      const expanded = !this.data.treeTabs.find(t => t.id === id).expanded
      const treeTabs = this.data.treeTabs.map(t =>
        t.id === id ? { ...t, expanded } : { ...t, expanded: false }
      )
      this.setData({ treeTabs, currentSub: '', items: [], itemCount: 0, hasMore: false })
    } else {
      this.expandTopTab(id)
    }
  },

  expandTopTab(id) {
    const treeTabs = this.data.treeTabs.map(t => ({
      ...t,
      expanded: t.id === id,
    }))

    // 构建二级目录
    const top = TREE_STRUCT.find(t => t.id === id)
    const subList = (top ? top.children : []).map(child => {
      const path = id + '/' + child
      return {
        name: child,
        path,
        count: (this._cacheBySub[path] || []).length,
        isActive: false,
      }
    })

    this.setData({
      treeTabs,
      currentTreeTab: id,
      subCategories: subList,
      currentSub: '',
      items: [],
      itemCount: 0,
      hasMore: false,
    })
  },

  // 选择二级目录
  selectSub(e) {
    const { path } = e.currentTarget.dataset
    this.setData({
      currentSub: path,
      subCategories: this.data.subCategories.map(s => ({
        ...s,
        isActive: s.path === path,
      })),
    })
    this.loadItems(path)
  },

  // 加载某路径的条目
  loadItems(path) {
    const all = this._cacheBySub[path] || []
    const mapped = all.map(item => {
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

    this.setData({
      items: mapped.slice(0, this.data.pageSize),
      itemCount: all.length,
      hasMore: all.length > this.data.pageSize,
    })
  },

  loadMore() {
    const path = this.data.currentSub
    const all = this._cacheBySub[path] || []
    const current = this.data.items.length
    const next = all.slice(current, current + this.data.pageSize).map(item => {
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
    this.setData({
      items: [...this.data.items, ...next],
      hasMore: this.data.items.length + next.length < all.length,
    })
  },

  goDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({ url: '/pages/detail/detail?id=' + id })
  },

  openTool(e) {
    const tool = e.currentTarget.dataset.tool
    if (tool) {
      app.globalData.toolFilter = tool
      wx.switchTab({ url: '/pages/tools/tools' })
    }
  },

  onShareAppMessage() {
    return { title: '情商宝典 - 知识库', path: '/pages/category/category' }
  },
})
