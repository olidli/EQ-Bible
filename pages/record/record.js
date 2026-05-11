// pages/record/record.js
const app = getApp()
const { getTypeInfo } = require('../../utils/constants')

Page({
  data: {
    learnedList: [],
  },

  onShow() {
    this.loadLearned()
  },

  loadLearned() {
    const learnedSet = app.globalData && app.globalData.learnedSet
    const learnedArr = learnedSet ? [...learnedSet] : (wx.getStorageSync('learnedItems') || [])
    const items = app.globalData.items || []

    const learnedList = learnedArr.map(id => {
      const item = items.find(it => it.id === id)
      if (!item) return null
      const ti = getTypeInfo(item.tp)
      return {
        id: item.id,
        title: item.t || '未知标题',
        typeLabel: ti.label,
        typeColor: ti.color,
      }
    }).filter(Boolean)

    this.setData({ learnedList })
  },

  goDetail(e) {
    wx.navigateTo({ url: '/pages/detail/detail?id=' + e.currentTarget.dataset.id })
  },

  clearRecords() {
    wx.showModal({
      title: '确认清空',
      content: '确定要清空所有学习记录吗？此操作不可撤销。',
      success: (res) => {
        if (res.confirm) {
          if (app.globalData && app.globalData.learnedSet) {
            app.globalData.learnedSet.clear()
          }
          wx.removeStorageSync('learnedItems')
          this.setData({ learnedList: [] })
          wx.showToast({ title: '已清空', icon: 'success' })
        }
      }
    })
  },
})
