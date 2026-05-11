// pages/detail/detail_optimized.js - 优化版 detail.js
// 主要优化：
//   1. 标记学习/收藏改为调用 app.toggleLearned / app.toggleFav（内存操作）
//   2. 添加 onShareAppMessage / onShareTimeline 分享配置
//   3. 使用 constants.js 统一常量

const app = getApp()
const { getTypeInfo } = require('../../utils/constants')

Page({
  data: {
    loading: true,
    id: '',
    item: null,
    isLearned: false,
    isFav: false,
    relatedItems: [],
    contentType: '',
    showSource: false,
  },

  onLoad(options) {
    this.setData({ id: options.id || '' })
    this.loadDetail()
    this.checkStatus()
  },

  loadDetail() {
    const raw = app.getById(this.data.id)
    if (!raw) {
      this.setData({ loading: false })
      wx.showToast({ title: '内容未找到', icon: 'none' })
      return
    }

    const content = raw.content || {}
    const contentType = content.type || ''
    const ti = getTypeInfo(raw.tp)

    this.setData({
      item: {
        _id: raw.id,
        title: raw.t,
        type: raw.tp,
        tags: raw.tg || [],
        serial: raw.id,
        typeLabel: ti.label,
        typeColor: ti.color,
        tagsStr: (raw.tg || []).join(' / '),
        content: content,
        contentType: contentType,
        readTime: content.read_time || '',
        difficulty: content.difficulty || '',
        originalFile: content.original_file || '',
      },
      contentType: contentType,
      loading: false,
    })

    wx.setNavigationBarTitle({ title: raw.t ? raw.t.slice(0, 15) : '详情' })
    this.loadRelated(raw)
  },

  loadRelated(item) {
    const tags = (item.tg || [])
    if (tags.length === 0) return

    const allItems = app.globalData.items || []
    const id = this.data.id
    const titleWords = (item.t || '').split(/[\s,，。、；;！!?？]+/).filter(Boolean)

    // 按相似度评分排序
    const scored = allItems
      .filter(it => it.id !== id)
      .map(it => {
        const itTags = it.tg || []
        const tagOverlap = tags.filter(t =>
          itTags.some(itT => itT.includes(t) || t.includes(itT))
        ).length
        const itTitleWords = (it.t || '').split(/[\s,，。、；;！!?？]+/).filter(Boolean)
        const titleOverlap = titleWords.filter(w =>
          itTitleWords.some(itW => itW.includes(w) || w.includes(itW))
        ).length
        const score = tagOverlap * 10 + titleOverlap
        return { ...it, score }
      })
      .filter(it => it.score > 0)
      .sort((a, b) => b.score - a.score)

    // 从 top 10 随机抽 5 条，增加多样性
    const top = scored.slice(0, 10)
    const selected = []
    const pool = [...top]
    while (selected.length < 5 && pool.length > 0) {
      const idx = Math.floor(Math.random() * pool.length)
      selected.push(pool.splice(idx, 1)[0])
    }

    this.setData({
      relatedItems: selected.map(r => ({ id: r.id, title: r.t }))
    })
  },

  // ✅ 直接从 globalData 内存读取，不再调用 getStorageSync
  checkStatus() {
    this.setData({
      isLearned: app.isLearned(this.data.id),
      isFav: app.isFav(this.data.id),
    })
  },

  // ✅ 使用 app.toggleLearned，内存操作 + 异步写盘
  markLearn() {
    const isLearned = app.toggleLearned(this.data.id)
    this.setData({ isLearned })
    wx.showToast({ title: isLearned ? '已标记学习' : '已取消标记', icon: isLearned ? 'success' : 'none' })
  },

  toggleFav() {
    const isFav = app.toggleFav(this.data.id)
    this.setData({ isFav })
    wx.showToast({ title: isFav ? '已收藏' : '已取消收藏', icon: isFav ? 'success' : 'none' })
  },

  share() {
    wx.showShareMenu({ withShareTicket: true, menus: ['shareAppMessage', 'shareTimeline'] })
  },

  // ✅ 新增：微信好友分享配置
  onShareAppMessage() {
    const { item } = this.data
    return {
      title: item?.title || 'EQ情商宝典 · 精选知识',
      path: `/pages/detail/detail?id=${this.data.id}`,
      // imageUrl: 'https://your-cdn.com/share-cover.png', // 可配置封面图
    }
  },

  // ✅ 新增：朋友圈分享配置
  onShareTimeline() {
    const { item } = this.data
    return {
      title: item?.title || 'EQ情商宝典 · 提升情商从这里开始',
      query: `id=${this.data.id}`,
    }
  },

  goRelated(e) {
    wx.navigateTo({ url: '/pages/detail/detail?id=' + e.currentTarget.dataset.id })
  },

  toggleSource() {
    this.setData({ showSource: !this.data.showSource })
  },
})
