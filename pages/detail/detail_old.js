// pages/detail/detail.js
const app = getApp()
const TYPE_LABELS = { PDF: 'PDF', Word: '文档', Markdown: '指南', '工具': '工具', '案例': '案例', '笔记': '笔记', '微信公众号文章': '科普', '网页链接': '网页' }
const TYPE_COLORS = { PDF: '#ff6b6b', Word: '#4ecdc4', Markdown: '#45b7d1', '工具': '#dda0dd', '案例': '#f7dc6f', '笔记': '#96ceb4', '微信公众号文章': '#f0a3e2', '网页链接': '#7bc96f' }

Page({
  data: { loading: true, id: '', item: null, isLearned: false, isFav: false, relatedItems: [] },

  onLoad(options) {
    this.setData({ id: options.id || '' })
    this.loadDetail()
    this.checkStatus()
  },

  loadDetail() {
    const raw = app.getById(this.data.id)
    if (!raw) { this.setData({ loading: false }); wx.showToast({ title: '内容未找到', icon: 'none' }); return }
    this.setData({
      item: {
        _id: raw.id, title: raw.t, type: raw.tp, tags: raw.tg, serial: raw.id,
        typeLabel: TYPE_LABELS[raw.tp] || '资源',
        typeColor: TYPE_COLORS[raw.tp] || '#667eea',
        tagsStr: (raw.tg || []).join(' / ')
      },
      loading: false
    })
    wx.setNavigationBarTitle({ title: raw.t ? raw.t.slice(0, 15) : '详情' })
    this.loadRelated(raw)
  },

  loadRelated(item) {
    const tags = (item.tg || []).slice(0, 2)
    if (tags.length === 0) return
    this.setData({ relatedItems: app.searchByTags(tags, 5).filter(r => r.id !== this.data.id) })
  },

  checkStatus() {
    const learned = wx.getStorageSync('learnedItems') || []
    const favs = wx.getStorageSync('favItems') || []
    this.setData({ isLearned: learned.includes(this.data.id), isFav: favs.includes(this.data.id) })
  },

  markLearn() {
    const learned = wx.getStorageSync('learnedItems') || []
    const idx = learned.indexOf(this.data.id)
    if (idx > -1) { learned.splice(idx, 1); this.setData({ isLearned: false }); wx.showToast({ title: '已取消标记', icon: 'none' }) }
    else { learned.push(this.data.id); this.setData({ isLearned: true }); wx.showToast({ title: '已标记学习', icon: 'success' }) }
    wx.setStorageSync('learnedItems', learned)
  },

  toggleFav() {
    const favs = wx.getStorageSync('favItems') || []
    const idx = favs.indexOf(this.data.id)
    if (idx > -1) { favs.splice(idx, 1); this.setData({ isFav: false }); wx.showToast({ title: '已取消收藏', icon: 'none' }) }
    else { favs.push(this.data.id); this.setData({ isFav: true }); wx.showToast({ title: '已收藏', icon: 'success' }) }
    wx.setStorageSync('favItems', favs)
  },

  share() { wx.showShareMenu({ withShareTicket: true }) },
  goRelated(e) { wx.navigateTo({ url: '/pages/detail/detail?id=' + e.currentTarget.dataset.id }) }
})
