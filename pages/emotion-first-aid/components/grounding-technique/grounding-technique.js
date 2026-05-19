// components/grounding-technique/grounding-technique.js
Component({
  properties: {},

  data: {
    // 当前步骤索引 (0-4)
    currentStep: 0,
    // 是否完成
    isFinished: false,
    // 用户输入
    userInputs: ['', '', '', '', ''],
    // 步骤配置
    steps: [
      { number: 5, sense: '看到', prompt: '说出你能看到的5样东西', placeholder: '例如：桌子、树木、杯子、手机...', emoji: '👀' },
      { number: 4, sense: '触摸', prompt: '说出你能触摸到的4样东西', placeholder: '例如：衣服的质感、桌面的温度、手机的重量...', emoji: '✋' },
      { number: 3, sense: '听到', prompt: '说出你能听到的3样声音', placeholder: '例如：鸟叫声、车流声、空调声...', emoji: '👂' },
      { number: 2, sense: '闻到', prompt: '说出你能闻到的2样气味', placeholder: '例如：咖啡香、花香、书香...', emoji: '👃' },
      { number: 1, sense: '尝到', prompt: '说出你能尝到的1样味道', placeholder: '例如：薄荷糖的清凉、水的味道...', emoji: '👅' },
    ],
  },

  methods: {
    // 输入变化
    onInputChange(e) {
      const idx = this.data.currentStep
      const inputs = [...this.data.userInputs]
      inputs[idx] = e.detail.value
      this.setData({ userInputs: inputs })
    },

    // 下一步
    nextStep() {
      const currentInput = this.data.userInputs[this.data.currentStep]
      if (!currentInput.trim()) {
        wx.showToast({ title: '请先完成当前步骤', icon: 'none' })
        return
      }

      if (this.data.currentStep < 4) {
        // 提供触觉反馈
        wx.vibrateShort({ type: 'light' })
        this.setData({ currentStep: this.data.currentStep + 1 })
      } else {
        // 完成
        wx.vibrateShort({ type: 'medium' })
        this.setData({ isFinished: true })
        this.triggerEvent('finished')
      }
    },

    // 退出
    exit() {
      this.triggerEvent('exit')
    },

    // 重新开始
    restart() {
      this.setData({
        currentStep: 0,
        isFinished: false,
        userInputs: ['', '', '', '', ''],
      })
    },
  },
})
