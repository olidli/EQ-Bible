// pages/category/category.js - 知识库首页（六个分类平铺）
const app = getApp()
const { getTypeInfo, MODULE_NAMES } = require('../../utils/constants')
// 直接加载数据，不依赖 app.globalData 的加载时序
const _knowledgeItems = require('../../data/knowledge_structured.js')

const MODULE_DEFS = [
  { id: '自我认知',   emoji: '🧠', color: '#4ecdc4', bg: '#f0fffe', children: ['情商基础', '自我觉察', '性格与特质'] },
  { id: '情绪管理',   emoji: '😊', color: '#e84393', bg: '#fef0f7', children: ['情绪觉察', '情绪命名', '情绪调节', '情绪表达', '情绪溯源', '专项情绪'] },
  { id: '沟通表达',   emoji: '💬', color: '#3498db', bg: '#f0f8ff', children: ['基础沟通', '高难度沟通', '说服与影响'] },
  { id: '人际关系',   emoji: '🤝', color: '#6c5ce7', bg: '#f5f3ff', children: ['自我关系', '亲密关系', '群体关系'] },
  { id: '个人成长',   emoji: '🌱', color: '#00b894', bg: '#f0faf5', children: ['学习力', '习惯养成', '应用实践'] },
]

// 子目录关键词映射：用于 path 不匹配时的自动归位
const SUBDIR_KEYWORDS = {
  '自我认知': {
    '情商基础': ['情商', '智力', '模型', '框架'],
    '自我觉察': ['觉察', '认知', '意识', '内省', '元认知', '格式塔'],
    '性格与特质': ['性格', '特质', 'MBTI', '优势', '劣势']
  },
  '情绪管理': {
    '情绪觉察': ['觉察', '认知', '识别', '命名', '觉察'],
    '情绪命名': ['命名', '标签', '词汇'],
    '情绪调节': ['调节', '管理', '控制', '应对', '调节'],
    '情绪表达': ['表达', '倾诉', '沟通', '说出来'],
    '情绪溯源': ['溯源', '原因', '来源', '根因', '分析'],
    '专项情绪': ['焦虑', '压力', '愤怒', '抑郁', '嫉妒', '专项', '恐惧']
  },
  '沟通表达': {
    '基础沟通': ['基础', '倾听', '表达', '反馈', '提问', '聊天', '赞美', '感谢', '道歉', '沟通'],
    '高难度沟通': ['高难度', '冲突', '批评', '拒绝', '谈判', '尴尬', '敏感'],
    '说服与影响': ['说服', '影响', '演讲', '激励', '领导力', '非语言']
  },
  '人际关系': {
    '自我关系': ['自我', '独处', '内在', '自己'],
    '亲密关系': ['亲密', '恋爱', '伴侣', '夫妻', '家庭', '信任'],
    '群体关系': ['群体', '职场', '社交', '圈子', '团队']
  },
  '个人成长': {
    '学习力': ['学习', '认知', '思维', '知识', '阅读', '智力', '理解'],
    '习惯养成': ['习惯', '自律', '拖延', '时间管理', '养成'],
    '应用实践': ['实践', '应用', '勇气', '自信', '行动', '能量', '姿势']
  }
}

// 为每个模块定义默认子目录（兜底）
const DEFAULT_SUBDIR = {
  '自我认知': '自我觉察',
  '情绪管理': '情绪调节',
  '沟通表达': '基础沟通',
  '人际关系': '亲密关系',
  '个人成长': '学习力'
}

/** 根据 item 的 path/moduleName/t 自动归位到正确的子目录 */
function resolveGroupKey(item) {
  const p = item.path || ''
  const moduleName = item.moduleName || ''
  const title = item.t || ''

  // 1. 如果 path 格式正确，直接用
  if (p) {
    const parts = p.split('/')
    if (parts.length >= 2) {
      const mod = parts[0]
      const sub = parts[1]
      const def = MODULE_DEFS.find(d => d.id === mod)
      if (def && def.children.includes(sub)) {
        return mod + '/' + sub
      }
    }
  }

  // 2. path 不匹配或为空，根据 moduleName 和关键词匹配
  const def = MODULE_DEFS.find(d => d.id === moduleName)
  if (!def) return null

  const keywords = SUBDIR_KEYWORDS[moduleName]
  if (keywords) {
    // 尝试用 path 的第二级、title、description 匹配关键词
    const textToMatch = (p.split('/')[1] || '') + ' ' + title + ' ' + (item.description || '')
    for (const subDir of def.children) {
      const kwList = keywords[subDir] || []
      if (kwList.some(kw => textToMatch.includes(kw))) {
        return moduleName + '/' + subDir
      }
    }
  }

  // 3. 兜底：用默认子目录
  const fallback = DEFAULT_SUBDIR[moduleName]
  if (fallback && def.children.includes(fallback)) {
    return moduleName + '/' + fallback
  }

  // 4. 最后兜底：第一个子目录
  return moduleName + '/' + def.children[0]
}

Page({
  data: {
    modules: [],
    totalCount: 0,
    expandedPath: '',
    progress: 0,
    learnedCount: 0,
  },

  _cacheBySub: {},

  onLoad() {
    this.buildModules()
    this.loadProgress()
    wx.showShareMenu({ withShareTicket: true, menus: ['shareAppMessage', 'shareTimeline'] })
  },

  onShow() {
    // 刷新学习进度
    this.loadProgress()
    // 首页模块跳转：每次显示都检查
    const filterId = app.globalData && app.globalData.categoryFilter
    if (filterId) {
      app.globalData.categoryFilter = null
      this.jumpToModule(filterId)
      return
    }
    // 保持上次展开状态
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
      // 使用 resolveGroupKey 自动归位（支持空 path 或不匹配 path 的兜底）
      const groupKey = resolveGroupKey(item)
      if (!groupKey) return
      pathCount[groupKey] = (pathCount[groupKey] || 0) + 1
      if (!pathItems[groupKey]) pathItems[groupKey] = []
      pathItems[groupKey].push(item)
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

  /** 首页指定模块跳转：定位到对应模块，展开第一个子目录 */
  jumpToModule(filterId) {
    this.buildModules()
    const moduleName = MODULE_NAMES[filterId]
    if (!moduleName) return

    // 硬编码映射：首页 filterId -> 模块索引 mi
    const miMap = {
      'self_aware': 1,     // 自我认知
      'emotion': 2,        // 情绪管理
      'communication': 3,  // 沟通表达
      'relation': 4,       // 人际关系
      'growth': 5,         // 个人成长
    }
    const mi = miMap[filterId]
    if (mi === undefined) return

    const child = this.data.modules[mi] && this.data.modules[mi].children[0]
    if (child && child.count > 0) {
      this.expandChild(mi, 0, child.path)
    }

    setTimeout(() => {
      wx.pageScrollTo({ selector: '#mod-' + mi, offsetTop: -60, duration: 300 })
    }, 300)
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

  loadProgress: function () {
    var learned = wx.getStorageSync('learnedItems') || []
    var total = this.data.totalCount || 0
    this.setData({
      learnedCount: learned.length,
      progress: total > 0 ? Math.round(learned.length / total * 100) : 0
    })
  },

  onShareAppMessage() {
    return { title: '情商宝典 - 知识库', path: '/pages/category/category' }
  },
})
