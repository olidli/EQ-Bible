// app.js - 情商宝典小程序核心逻辑

var items = []

// 加载知识库
function loadKnowledge() {
  // 优先结构化知识库
  try {
    var s = require('./data/knowledge_structured.js')
    var arr = null
    if (s && s.K && s.K.length > 0) arr = s.K
    else if (Array.isArray(s) && s.length > 0) arr = s
    if (arr) {
      items = arr
      console.log('[app] Loaded knowledge_structured:', items.length)
      return
    }
  } catch (e) {
    console.log('[app] knowledge_structured load failed:', e.message || e)
  }
  // 降级到普通知识库
  try {
    var s = require('./data/knowledge.js')
    var arr = null
    if (s && s.K && s.K.length > 0) arr = s.K
    else if (Array.isArray(s) && s.length > 0) arr = s
    if (arr) {
      items = arr
      console.log('[app] Loaded knowledge.js:', items.length)
    }
  } catch (e) {
    console.log('[app] knowledge.js failed:', e.message || e)
  }
}

loadKnowledge()

App({
  globalData: {
    items: items,
    totalItems: items.length,
    learnedSet: null,
    favSet: null
  },

  onLaunch: function() {
    var la = wx.getStorageSync('learnedItems') || []
    var fa = wx.getStorageSync('favItems') || []
    this.globalData.learnedSet = new Set(la)
    this.globalData.favSet = new Set(fa)
    if (!wx.getStorageSync('firstUseDate')) {
      wx.setStorageSync('firstUseDate', new Date().toISOString())
    }
    console.log('[app] Init, items:', items.length)
  },

  // 搜索
  search: function(kw, limit) {
    limit = limit || 50
    if (!kw) return []
    kw = kw.toLowerCase().trim()
    var self = this
    var r = this.globalData.items.filter(function(item) {
      var t = item.t || ''
      var tg = item.tg || []
      if (t.toLowerCase().indexOf(kw) !== -1) return true
      for (var i = 0; i < tg.length; i++) {
        if (tg[i].toLowerCase().indexOf(kw) !== -1) return true
      }
      return false
    })
    return r.slice(0, limit)
  },

  // 按标签搜索
  searchByTags: function(tags, limit) {
    limit = limit || 20
    var self = this
    return this.globalData.items.filter(function(item) {
      var tg = item.tg || []
      for (var i = 0; i < tg.length; i++) {
        for (var j = 0; j < tags.length; j++) {
          if (tg[i].indexOf(tags[j]) !== -1 || tags[j].indexOf(tg[i]) !== -1) return true
        }
      }
      return false
    }).slice(0, limit)
  },

  getById: function(id) {
    var self = this
    return this.globalData.items.find(function(item) {
      return item.id === String(id)
    })
  },

  getRandom: function(n) {
    n = n || 5
    var arr = [].concat(this.globalData.items)
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1))
      var tmp = arr[i]
      arr[i] = arr[j]
      arr[j] = tmp
    }
    return arr.slice(0, n)
  },

  toggleLearned: function(id) {
    var set = this.globalData.learnedSet
    if (set.has(id)) set.delete(id)
    else set.add(id)
    var a = []
    set.forEach(function(v) { a.push(v) })
    wx.setStorage({ key: 'learnedItems', data: a })
    return set.has(id)
  },

  toggleFav: function(id) {
    var set = this.globalData.favSet
    if (set.has(id)) set.delete(id)
    else set.add(id)
    var a = []
    set.forEach(function(v) { a.push(v) })
    wx.setStorage({ key: 'favItems', data: a })
    return set.has(id)
  },

  isLearned: function(id) {
    return this.globalData.learnedSet && this.globalData.learnedSet.has(id)
  },

  isFav: function(id) {
    return this.globalData.favSet && this.globalData.favSet.has(id)
  }
})
