// pages/profile/profile.js
const app = getApp()
const { MODULE_NAMES, MODULE_TAGS } = require('../../utils/constants')

Page({
  data: {
    userInfo: {},
    learnedCount: 0,
    favCount: 0,
    diaryCount: 0,
    progress: 0,
    moduleProgress: []
  },

  onShow() {
    this.loadUserData()
  },

  loadUserData() {
    const app = getApp()
    const learnedSet = app.globalData && app.globalData.learnedSet
    const favSet = app.globalData && app.globalData.favSet

    const learnedArr = learnedSet ? [...learnedSet] : (wx.getStorageSync('learnedItems') || [])
    const favArr = favSet ? [...favSet] : (wx.getStorageSync('favItems') || [])
    const diaryHistory = wx.getStorageSync('diaryHistory') || []

    if (!wx.getStorageSync('firstUseDate')) {
      wx.setStorageSync('firstUseDate', new Date().toISOString())
    }

    const progress = Math.round((learnedArr.length / 357) * 100)
    const items = app.globalData.items || []
    const learnedIds = learnedSet || new Set(learnedArr)

    const moduleProgress = Object.entries(MODULE_TAGS).map(([moduleId, tags]) => {
      const moduleItems = items.filter(item =>
        (item.tg || []).some(t => tags.some(tag => t.includes(tag) || tag.includes(t)))
      )
      const learnedModuleItems = moduleItems.filter(item => learnedIds.has(item.id))
      const pct = moduleItems.length > 0
        ? Math.round(learnedModuleItems.length / moduleItems.length * 100)
        : 0
      return {
        name: MODULE_NAMES[moduleId] || moduleId,
        pct,
        total: moduleItems.length,
        learned: learnedModuleItems.length
      }
    })

    this.setData({
      learnedCount: learnedArr.length,
      favCount: favArr.length,
      diaryCount: diaryHistory.length,
      progress,
      moduleProgress,
    })
  },

  goPage(e) {
    const page = e.currentTarget.dataset.page
    switch(page) {
      case 'favorites':
        app.globalData.searchFilter = { onlyFav: true }
        wx.navigateTo({ url: '/pages/search/search' })
        break
      case 'diary':
        app.globalData.toolFilter = 'emotion_diary'
        wx.switchTab({ url: '/pages/tools/tools' })
        break
      case 'paths':
        app.globalData.toolFilter = 'learning_path'
        wx.switchTab({ url: '/pages/tools/tools' })
        break
      case 'tests':
        wx.navigateTo({ url: '/pages/test/test' })
        break
      case 'progress':
        wx.navigateTo({ url: '/pages/record/record' })
        break
    }
  },

  goAbout() {
    wx.showModal({
      title: '关于EQ情商宝典',
      content: 'EQ情商宝典 - 357项知识库，涵盖心理学理论、情商专项、实用技能。\n\n目标：建设强大心理，保持内在平衡，掌控沟通艺术，冷静应对挑战，构建和谐关系，成就健康人生！',
      showCancel: false
    })
  },

  contact() {
    wx.showActionSheet({
      itemList: ['问卷反馈（推荐）', '复制开发者邮箱'],
      success(res) {
        if (res.tapIndex === 0) {
          wx.navigateTo({
            url: '/pages/privacy/privacy',
            fail() {
              wx.setClipboardData({
                data: 'https://wj.qq.com/s2/eq-bible-feedback',
                success() { wx.showToast({ title: '链接已复制，请在浏览器打开', icon: 'none' }) }
              })
            }
          })
          wx.setClipboardData({
            data: 'https://wj.qq.com/s2/eq-bible-feedback',
            success() {
              wx.showModal({
                title: '意见反馈',
                content: '问卷链接已复制到剪贴板，请在浏览器中打开填写。\n\n非常感谢您的反馈！',
                showCancel: false,
                confirmText: '好的'
              })
            }
          })
        } else if (res.tapIndex === 1) {
          wx.setClipboardData({
            data: 'eq.bible.feedback@gmail.com',
            success() { wx.showToast({ title: '邮箱已复制', icon: 'success' }) }
          })
        }
      }
    })
  },

  goPrivacy() {
    wx.navigateTo({ url: '/pages/privacy/privacy' })
  }
})
