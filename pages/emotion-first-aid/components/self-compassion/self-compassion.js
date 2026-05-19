// components/self-compassion/self-compassion.js
Component({
  properties: {},

  data: {
    // 当前步骤索引 (0-2)
    currentStep: 0,
    // 用户回答
    answers: {
      feel: '',
      common: '',
      kind: '',
    },
    // 提示列表
    prompts: [
      { key: 'feel', prompt: '你现在正在经历什么？', placeholder: '描述你的感受...', emoji: '🫂' },
      { key: 'common', prompt: '很多人都会经历类似的感受', placeholder: '这很正常...', emoji: '🤝' },
      { key: 'kind', prompt: '对自己说一句话', placeholder: '我希望自己知道...', emoji: '💝' },
    ],
    // 是否完成
    isFinished: false,
  },

  methods: {
    // 输入变化
    onInputChange(e) {
      const key = this.data.prompts[this.data.currentStep].key
      const answers = { ...this.data.answers }
      answers[key] = e.detail.value
      this.setData({ answers })
    },

    // 下一步
    nextStep() {
      const currentAnswer = this.data.answers[this.data.prompts[this.data.currentStep].key]

      if (!currentAnswer.trim()) {
        wx.showToast({ title: '请先回答问题', icon: 'none' })
        return
      }

      if (this.data.currentStep < 2) {
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
    onExit() {
      this.triggerEvent('exit')
    },

    // 重新开始
    restart() {
      this.setData({
        currentStep: 0,
        answers: { feel: '', common: '', kind: '' },
        isFinished: false,
      })
    },
  },
})
