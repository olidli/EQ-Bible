// pages/search/search.js - 完善版
// 相比上一版本：
//   1. 修复 onLoad hasSearched 漏设问题
//   2. 修复 quickSearch 未清缓存问题
//   3. 新增「只看收藏」「只看已学」筛选
//   4. 修复 detail 跳转 URL（detail 已在分包）
//   5. 统一使用 constants.js
//   6. 支持 app.isFav / app.isLearned 筛选
//   7. 支持 profile「我的收藏」跳转时自动激活收藏筛选

const app = getApp()
const { getTypeInfo, SEARCH_HOT_TAGS, SEARCH_TAG_COLORS } = require('../../utils/constants')

const HOT_TAG_ITEMS = SEARCH_HOT_TAGS.map((tag, i) => ({
  text: tag,
  ...SEARCH_TAG_COLORS[i % SEARCH_TAG_COLORS.length]
}))

// 筛选器：增加「只看收藏」「只看已学」
const FILTERS = [
  { key: 'all',        label: '全部' },
  { key: 'article',    label: '文章' },
  { key: 'book',       label: '书籍摘要' },
  { key: 'card',       label: '技巧卡片' },
  { key: 'fav',        label: '我的收藏' },
  { key: 'learned',    label: '已学习' },
]

Page({
  data: {
    keyword: '',
    hotTags: HOT_TAG_ITEMS,
    hasSearched: false,
    results: [],
    currentFilter: 'all',
    filterLabel: '全部',
  },

  // 存储完整搜索结果（筛选时直接复用，不重新搜索）
  _allResults: [],

  onLoad(options) {
    // ✅ 接收来自 profile「我的收藏」跳转时的筛选信号
    const searchFilter = app.globalData.searchFilter
    if (searchFilter && searchFilter.onlyFav) {
      // 清空信号，避免回退再进入时重复触发
      app.globalData.searchFilter = null
      // 加载全量数据（不触发关键词过滤），直接展示收藏
      this._allResults = (app.globalData.items || []).map(item => {
        const ti = getTypeInfo(item.tp)
        return {
          _id: item.id, title: item.t, type: item.tp,
          typeLabel: ti.label, typeColor: ti.color, tags: item.tg || [],
          isLearned: app.isLearned(item.id), isFav: app.isFav(item.id),
        }
      })
      this.setData({
        keyword: '',
        currentFilter: 'fav',
        filterLabel: '我的收藏',
        hasSearched: true,
      })
      this.applyFilter('fav', '我的收藏')
      return
    }

    if (options.keyword) {
      this.setData({
        keyword: options.keyword,
        hasSearched: true,   // ✅ 修复：必须设 true，否则搜索结果区不会显示
      })
      this.doSearch()
    }
  },

  onInput(e) {
    this.setData({ keyword: e.detail.value })
  },

  // 回车 / 按钮搜索
  doSearch() {
    const kw = this.data.keyword.trim()
    if (!kw) {
      wx.showToast({ title: '请输入搜索词', icon: 'none' })
      return
    }

    // 搜索结果只映射一次，存到 _allResults
    this._allResults = app.search(kw, 50).map(item => {
      const ti = getTypeInfo(item.tp)
      return {
        _id: item.id,
        title: item.t,
        type: item.tp,
        typeLabel: ti.label,
        typeColor: ti.color,
        tags: item.tg || [],
        // ✅ 带上用户状态，用于结果页显示标记
        isLearned: app.isLearned(item.id),
        isFav: app.isFav(item.id),
      }
    })

    this.setData({
      hasSearched: true,
    })

    this.applyFilter('all', '全部')
  },

  // 点击热门标签
  quickSearch(e) {
    const kw = e.currentTarget.dataset.keyword
    // ✅ 切换关键词时清空缓存，避免残留上次结果
    this._allResults = []
    this.setData({
      keyword: kw,
      currentFilter: 'all',
      filterLabel: '全部',
      hasSearched: true,
    })
    this.doSearch()
  },

  // 点击 Tab 切换筛选（新方法，替代旧的 toggleFilter 循环）
  switchFilter(e) {
    const key = e.currentTarget.dataset.key
    const label = e.currentTarget.dataset.label
    this.setData({ currentFilter: key, filterLabel: label })
    if (this.data.hasSearched) {
      this.applyFilter(key, label)
    }
  },

  // 切换类型筛选（保留兼容性）
  toggleFilter() {
    const idx = FILTERS.findIndex(f => f.key === this.data.currentFilter)
    const next = (idx + 1) % FILTERS.length
    const nextFilter = FILTERS[next]
    this.setData({
      currentFilter: nextFilter.key,
      filterLabel: nextFilter.label,
    })
    if (this.data.hasSearched) {
      this.applyFilter(nextFilter.key, nextFilter.label)
    }
  },

  // 核心筛选逻辑：从缓存中筛选，不再重新搜索
  applyFilter(filterKey, filterLabel) {
    let results

    if (filterKey === 'all') {
      results = this._allResults
    } else if (filterKey === 'fav') {
      // 只看收藏
      results = this._allResults.filter(r => app.isFav(r._id))
    } else if (filterKey === 'learned') {
      // 只看已学习
      results = this._allResults.filter(r => app.isLearned(r._id))
    } else {
      // 按内容类型筛选
      const typeMap = {
        article: '文章',
        book: '书籍摘要',
        card: '技巧卡片',
      }
      const targetType = typeMap[filterKey]
      results = targetType
        ? this._allResults.filter(r => r.type === targetType)
        : this._allResults
    }

    this.setData({ results })
  },

  // 搜索结果点击 → 进入详情
  // app.json 分包配置：root="pages/detail", pages=["detail"]
  // 实际路径 = /pages/detail/detail
  goDetail(e) {
    wx.navigateTo({ url: `/pages/detail/detail?id=${e.currentTarget.dataset.id}` })
  },

  clearKeyword() {
    this._allResults = []
    this.setData({
      keyword: '',
      hasSearched: false,
      results: [],
      currentFilter: 'all',
      filterLabel: '全部',
    })
  },
})
