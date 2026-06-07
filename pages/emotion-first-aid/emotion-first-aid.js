// pages/emotion-first-aid/emotion-first-aid.js
const { FIRST_AID_EMOTIONS, FIRST_AID_TOOLS, FIRST_AID_GUIDANCE } = require('../../utils/constants')

Page({
  data: {
    // === 情绪识别 ===
    emotions: FIRST_AID_EMOTIONS,
    selectedEmotion: '',
    selectedEmotionLabel: '',
    intensity: 5,
    guidance: null,  // 当前情绪的引导语

    // === 工具状态 ===
    tools: Object.values(FIRST_AID_TOOLS),
    toolMap: FIRST_AID_TOOLS,  // 供 WXML 直接访问工具详情
    activeTool: '',  // '' | 'breathing' | 'grounding' | 'cognitive' | 'bodyScan' | 'mindfulness' | 'selfCompassion' | 'sensory'

    // === 应急联系人 ===
    showContacts: false,

    // === 步骤状态 ===
    currentStep: 1,  // 1: 情绪识别, 2: 选择工具, 3: 使用工具
  },

  onLoad() {
    // 启用分享功能
    wx.showShareMenu({ withShareTicket: true, menus: ['shareAppMessage', 'shareTimeline'] })
  },

  // ========== 情绪识别 ==========
  selectEmotion(e) {
    const emotion = e.currentTarget.dataset.emotion
    const value = e.currentTarget.dataset.value
    const guidance = FIRST_AID_GUIDANCE[value]
    this.setData({
      selectedEmotion: value,
      selectedEmotionLabel: emotion,
      guidance: guidance
    })
  },

  setIntensity(e) {
    this.setData({ intensity: e.detail.value })
  },

  // 确认情绪识别，进入选择工具步骤
  confirmEmotion() {
    if (!this.data.selectedEmotion) {
      wx.showToast({ title: '请先选择你的情绪', icon: 'none' })
      return
    }
    wx.vibrateShort({ type: 'medium' })
    this.setData({ currentStep: 2 })
  },

  // ========== 工具选择 ==========
  openTool(e) {
    const tool = e.currentTarget.dataset.tool
    this.setData({
      activeTool: tool,
      currentStep: 3
    })
  },

  closeTool() {
    this.setData({
      activeTool: '',
      currentStep: 2
    })
  },

  // 工具完成回调
  onToolFinished() {
    wx.showToast({ title: '太棒了！你做得很好 💪', icon: 'success', duration: 2000 })
    this.setData({
      activeTool: '',
      currentStep: 2
    })
  },

  // ========== 应急联系人 ==========
  toggleContacts() {
    this.setData({ showContacts: !this.data.showContacts })
  },

  // 联系人变更回调（供 emergency-contacts 组件调用）
  onContactsChanged() {
    // 联系人列表已通过组件内部更新，此处可添加额外逻辑
    console.log('联系人已变更')
  },

  // ========== 返回重选 ==========
  goBackToEmotions() {
    this.setData({ currentStep: 1 })
  },

  goBackToTools() {
    this.setData({
      activeTool: '',
      currentStep: 2
    })
  },

  // ========== 分享功能 ==========
  onShareAppMessage() {
    return {
      title: '情绪急救箱 | EQ情商宝典',
      path: '/pages/emotion-first-aid/emotion-first-aid',
    }
  },

  onShareTimeline() {
    return {
      title: '快速缓解负面情绪，试试这个情绪急救箱！',
    }
  },
})
