// pages/index/index.js
var app = getApp()
var constants = require('../../utils/constants')
var getTypeInfo = constants.getTypeInfo
var MODULE_TAGS = constants.MODULE_TAGS
var MODULE_NAMES = constants.MODULE_NAMES
var TOOL_META = constants.TOOL_META

// 每日金句库（200条情绪管理金句）
var DAILY_QUOTES = require('../../data/daily_quotes.js')

Page({
  data: {
    dailyItems: [],
    dailyCard: null,
    toolCount: Object.keys(TOOL_META).length
  },

  onLoad: function () {
    this.loadDaily()
    this.loadDailyCard()
    wx.showShareMenu({ withShareTicket: true, menus: ['shareAppMessage', 'shareTimeline'] })
  },

  onShow: function () {
    // do nothing
  },

  onPullDownRefresh: function () {
    this.loadDaily()
    this.loadDailyCard()
    wx.stopPullDownRefresh()
  },

  // 随机推荐 5 条
  loadDaily: function () {
    var self = this
    var items = (app.globalData && app.globalData.items) || []
    var randomItems = []
    var n = items.length
    var count = n < 5 ? n : 5
    for (var i = 0; i < count; i++) {
      var idx = Math.floor(Math.random() * n)
      var item = items[idx]
      if (!item) continue
      var typeInfo = getTypeInfo(item.tp)
      randomItems.push({
        id: item.id,
        title: item.t || '',
        type: item.tp || '',
        typeLabel: typeInfo ? typeInfo.label : '',
        typeColor: typeInfo ? typeInfo.color : '',
        tags: (item.tg || []).slice(0, 3)
      })
    }
    self.setData({ dailyItems: randomItems })
  },

  // 每日小课堂：基于日期的确定性推荐（从金句库中按日取）
  loadDailyCard: function () {
    var quotes = DAILY_QUOTES || []
    if (!quotes || quotes.length === 0) return

    // 一年中的第几天 → 确定性索引（同日全用户同一条）
    var now = new Date()
    var year = now.getFullYear()
    var start = new Date(year, 0, 0)
    var diff = now - start
    var oneDay = 1000 * 60 * 60 * 24
    var dayOfYear = Math.floor(diff / oneDay)
    var index = dayOfYear % quotes.length
    var entry = quotes[index]

    var month = now.getMonth() + 1
    var day = now.getDate()
    var monthStr = month < 10 ? '0' + month : '' + month
    var dayStr = day < 10 ? '0' + day : '' + day

    this.setData({
      dailyCard: {
        quote: entry.q || '',
        source: entry.s || '',
        month: monthStr,
        day: dayStr,
        no: index + 1,
        dayOfYear: dayOfYear
      }
    })
  },

  goSearch: function () {
    wx.navigateTo({ url: '/pages/search/search' })
  },

  goDetail: function (e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({ url: '/pages/detail/detail?id=' + id })
  },

  goTools: function () {
    wx.switchTab({ url: '/pages/tools/tools' })
  },

  goCategory: function (e) {
    var id = e.currentTarget.dataset.id
    app.globalData.categoryFilter = id || ''
    wx.switchTab({ url: '/pages/category/category' })
  },

  openTool: function (e) {
    var toolId = e.currentTarget.dataset.tool
    app.globalData.toolFilter = toolId || ''
    wx.switchTab({ url: '/pages/tools/tools' })
  },

  goRecommend: function () {
    this.loadDaily()
  },

  goEmotionFirstAid: function () {
    wx.navigateTo({ url: '/pages/emotion-first-aid/emotion-first-aid' })
  },

  goGame: function () {
    wx.navigateTo({ url: '/pages/game/game' })
  },

  onShareAppMessage: function () {
    return {
      title: 'EQ情商宝典 · 每天5分钟，提升情商',
      path: '/pages/index/index',
      imageUrl: '/images/share_home.png'
    }
  },

  onShareTimeline: function () {
    return {
      title: 'EQ情商宝典 · 提升情商从这里开始',
      imageUrl: '/images/share_home.png'
    }
  }
})
