// components/cognitive-reappraisal/cognitive-reappraisal.js
Component({
  properties: {},

  data: {
    // 阶段：identify | reevaluate | finished
    stage: 'identify',
    // 当前问题索引 (0-3)
    currentQuestionIdx: 0,
    // 用户回答
    answers: {
      negative: '',
      evidence: '',
      alternative: '',
      balanced: '',
    },
    // 问题列表
    questions: [
      { key: 'negative', question: '你现在在想什么？', placeholder: '描述你当前的负面想法...', emoji: '💭' },
      { key: 'evidence', question: '支持这个想法的证据是什么？', placeholder: '写下支持这个想法的事实...', emoji: '📋' },
      { key: 'alternative', question: '有其他可能的解释吗？', placeholder: '还有哪些可能的解释？', emoji: '🔄' },
      { key: 'balanced', question: '现在，更平衡的想法是什么？', placeholder: '综合以上，你的感受是什么？', emoji: '⚖️' },
    ],
    // 是否完成
    isFinished: false,
  },

  methods: {
    // 输入变化
    onInputChange(e) {
      const key = this.data.questions[this.data.currentQuestionIdx].key
      const answers = { ...this.data.answers }
      answers[key] = e.detail.value
      this.setData({ answers })
    },

    // 下一步
    nextStep() {
      const currentAnswer = this.data.answers[this.data.questions[this.data.currentQuestionIdx].key]
      
      if (!currentAnswer.trim()) {
        wx.showToast({ title: '请先回答问题', icon: 'none' })
        return
      }

      if (this.data.currentQuestionIdx < 3) {
        wx.vibrateShort({ type: 'light' })
        this.setData({ currentQuestionIdx: this.data.currentQuestionIdx + 1 })
      } else {
        // 完成
        wx.vibrateShort({ type: 'medium' })
        this.setData({ 
          isFinished: true,
          stage: 'finished',
        })
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
        stage: 'identify',
        currentQuestionIdx: 0,
        answers: { negative: '', evidence: '', alternative: '', balanced: '' },
        isFinished: false,
      })
    },

    // 获取进度百分比
    getProgress() {
      return ((this.data.currentQuestionIdx + 1) / 4) * 100
    },
  },
})
