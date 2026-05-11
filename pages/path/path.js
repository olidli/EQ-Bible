// pages/path/path.js
Page({
  data: { savedPaths: [] },
  onShow() {
    this.setData({ savedPaths: wx.getStorageSync('savedPaths') || [] })
  },
  goTools() {
    const app = getApp()
    app.globalData.toolFilter = 'learning_path'
    wx.switchTab({ url: '/pages/tools/tools' })
  }
})