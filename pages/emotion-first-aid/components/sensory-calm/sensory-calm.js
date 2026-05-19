// components/sensory-calm/sensory-calm.js
Component({
  properties: {},

  data: {
    methods: [
      { type: '温度', instruction: '用冷水洗脸或握一个冰块', effect: '快速激活副交感神经', emoji: '🧊', selected: false },
      { type: '触感', instruction: '握住一个毛绒玩具或柔软的物品', effect: '提供安全感', emoji: '🧸', selected: false },
      { type: '视觉', instruction: '看一张让你感到平静的图片', effect: '转移注意力', emoji: '🖼️', selected: false },
      { type: '味觉', instruction: '慢慢品尝一颗糖果或喝一口温水', effect: '用味觉锚定当下', emoji: '🍬', selected: false },
    ],
    selectedMethod: null,
    isFinished: false,
  },

  methods: {
    // 选择方法
    selectMethod(e) {
      const index = e.currentTarget.dataset.index
      const methods = this.data.methods.map((m, i) => ({
        ...m,
        selected: i === index,
      }))
      this.setData({
        methods,
        selectedMethod: methods[index],
      })
      wx.vibrateShort({ type: 'light' })
    },

    // 确认完成
    finishMethod() {
      if (!this.data.selectedMethod) {
        wx.showToast({ title: '请先选择一种方法', icon: 'none' })
        return
      }
      wx.vibrateShort({ type: 'medium' })
      this.setData({ isFinished: true })
      this.triggerEvent('finished')
    },

    // 退出
    onExit() {
      this.triggerEvent('exit')
    },

    // 重新开始
    restart() {
      const methods = this.data.methods.map(m => ({ ...m, selected: false }))
      this.setData({
        methods,
        selectedMethod: null,
        isFinished: false,
      })
    },
  },
})
