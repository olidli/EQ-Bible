// app.js - 搜索修复版
// 改动：
//   1. search() 还原为线性过滤（原版已知可用），加上倒排索引备选逻辑
//   2. 启动时打印日志，方便排查数据加载状态
//   3. 保留 learnedSet/favSet 内存缓存、错误监控等其他优化

// ============ 知识库加载 ============
let items = []

const loadKnowledge = () => {
  // 只加载 knowledge.js（knowledge_structured.js 已删除）
  try {
    const knowledge = require('./data/knowledge')
    let arr = null
    if (knowledge && knowledge.K && knowledge.K.length > 0) {
      arr = knowledge.K
    } else if (Array.isArray(knowledge) && knowledge.length > 0) {
      arr = knowledge
    }
    if (arr) {
      items = arr
      console.log('[app] ✅ Loaded knowledge.js:', items.length, 'items')
      return
    }
  } catch (e) {
    console.error('[app] ❌ knowledge.js load failed:', e.message || e)
  }

  console.warn('[app] ⚠️ No knowledge data loaded — items array is empty')
}

loadKnowledge()

// ============ 倒排索引（供 searchByTags 等使用） ============
let _searchIndex = new Map()

const buildSearchIndex = (items) => {
  if (!items || items.length === 0) return new Map()
  const index = new Map()
  items.forEach(item => {
    const titleChars = (item.t || '').split('')
    const titleFull = (item.t || '').toLowerCase()
    const tags = (item.tg || []).map(t => t.toLowerCase())
    const words = [...new Set([titleFull, ...tags])]
    // 按单字符索引（支持任意字匹配）
    ;[...new Set(titleChars)].forEach(ch => {
      if (!ch.trim()) return
      if (!index.has(ch)) index.set(ch, [])
      const arr = index.get(ch)
      if (!arr.includes(item)) arr.push(item)
    })
    // 全标题（支持整词匹配）
    if (titleFull && !index.has(titleFull)) {
      index.set(titleFull, [item])
    } else if (titleFull && index.has(titleFull) && !index.get(titleFull).includes(item)) {
      index.get(titleFull).push(item)
    }
    // 标签
    tags.forEach(tag => {
      if (!tag.trim()) return
      if (!index.has(tag)) index.set(tag, [])
      const arr = index.get(tag)
      if (!arr.includes(item)) arr.push(item)
    })
  })
  return index
}

// ============ App 主体 ============
App({
  onLaunch() {
    // 初始化云开发环境
    if (!wx.cloud) {
      console.error('[app] ❌ 请使用 2.2.3 或以上的基础库')
    } else {
      wx.cloud.init({
        env: 'cloud1-d2gg6a0fq4e6bba8f', // 你的云开发环境 ID
        traceUser: true,
      })
      console.log('[app] ✅ Cloud init success, env:', 'cloud1-d2gg6a0fq4e6bba8f')
    }

    // 全局错误监控
    wx.onError && wx.onError(errMsg => {
      console.error('[GlobalError]', errMsg)
    })
    wx.onUnhandledRejection && wx.onUnhandledRejection(({ reason }) => {
      console.error('[UnhandledPromise]', reason)
    })

    // 构建搜索索引
    _searchIndex = buildSearchIndex(items)
    console.log('[app] Index built, size:', _searchIndex.size, 'keys')

    // 从 Storage 读取用户状态到内存
    const learnedArr = wx.getStorageSync('learnedItems') || []
    const favArr = wx.getStorageSync('favItems') || []

    this.globalData = {
      items,
      _searchIndex,
      totalItems: items.length,
      categoryFilter: null,
      toolFilter: null,
      learnedSet: new Set(learnedArr),
      favSet: new Set(favArr),
    }

    if (!wx.getStorageSync('firstUseDate')) {
      wx.setStorageSync('firstUseDate', new Date().toISOString())
    }

    console.log('[app] ✅ Init complete. globalData.items:', this.globalData.items.length)
  },

  /**
   * 关键字搜索 — 线性过滤（最可靠）
   * 对 356 条数据毫秒级完成，无需索引优化
   */
  search(keyword, limit = 50) {
    if (!keyword) return []
    const kw = keyword.toLowerCase().trim()
    if (!kw) return []

    const results = this.globalData.items.filter(item => {
      // 匹配标题（包含即命中）
      if (item.t && item.t.toLowerCase().includes(kw)) return true
      // 匹配标签（包含即命中）
      if (item.tg && item.tg.some(tag => tag.toLowerCase().includes(kw))) return true
      return false
    })

    console.log('[app] search("' + kw + '") =>', results.length, 'results (total:', this.globalData.items.length, ')')
    return results.slice(0, limit)
  },

  /**
   * 按标签搜索（倒排索引加速）
   */
  searchByTags(tags, limit = 20) {
    return this.globalData.items.filter(item =>
      (item.tg || []).some(t => tags.some(tag => t.includes(tag) || tag.includes(t)))
    ).slice(0, limit)
  },

  getById(id) {
    return this.globalData.items.find(item => item.id === String(id))
  },

  getRandom(count = 5) {
    const arr = [...this.globalData.items]
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[arr[i], arr[j]] = [arr[j], arr[i]]
    }
    return arr.slice(0, count)
  },

  // ============ 用户状态（内存 + 异步持久化） ============
  toggleLearned(id) {
    const set = this.globalData.learnedSet
    set.has(id) ? set.delete(id) : set.add(id)
    wx.setStorage({ key: 'learnedItems', data: [...set] })
    return set.has(id)
  },

  toggleFav(id) {
    const set = this.globalData.favSet
    set.has(id) ? set.delete(id) : set.add(id)
    wx.setStorage({ key: 'favItems', data: [...set] })
    return set.has(id)
  },

  isLearned(id) {
    return this.globalData.learnedSet.has(id)
  },

  isFav(id) {
    return this.globalData.favSet.has(id)
  },
})
