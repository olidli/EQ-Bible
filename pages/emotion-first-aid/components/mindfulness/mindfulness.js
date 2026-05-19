// components/mindfulness/mindfulness.js
Component({
  properties: {},

  data: {
    steps: [
      { instruction: '找一个舒适的姿势，背部挺直但放松', duration: 10 },
      { instruction: '轻轻闭上眼睛（或垂视前方）', duration: 5 },
      { instruction: '将注意力放在呼吸上', duration: 5 },
      { instruction: '吸气...（感受空气进入身体）', duration: 15 },
      { instruction: '呼气...（让所有紧张离开）', duration: 15 },
      { instruction: '继续呼吸，吸气...呼气...', duration: 60 },
      { instruction: '如果走神了，温柔地把注意力带回呼吸', duration: 30 },
      { instruction: '现在，慢慢睁开眼睛', duration: 5 },
    ],
    currentStep: 0,
    totalSteps: 8,
    isActive: false,
    completed: false,
    currentInstruction: '',
    remaining: 0,
  },

  lifetimes: {
    attached() {
      this.setData({
        totalSteps: this.data.steps.length,
      })
    },
    detached() {
      if (this._timer) {
        clearInterval(this._timer)
        this._timer = null
      }
    }
  },

  methods: {
    startMeditation() {
      this.setData({ isActive: true, completed: false, currentStep: 0 })
      this.runStep()
    },

    runStep() {
      const { currentStep, steps } = this.data
      if (currentStep >= steps.length) {
        this.finishMeditation()
        return
      }
      const step = steps[currentStep]
      this.setData({
        currentInstruction: step.instruction,
        remaining: step.duration,
      })

      if (this._timer) {
        clearInterval(this._timer)
      }
      this._timer = setInterval(() => {
        const newRemaining = this.data.remaining - 1
        if (newRemaining <= 0) {
          clearInterval(this._timer)
          this._timer = null
          this.setData({
            currentStep: this.data.currentStep + 1,
          })
          this.runStep()
        } else {
          this.setData({ remaining: newRemaining })
        }
      }, 1000)
    },

    finishMeditation() {
      this.setData({ isActive: false, completed: true })
      wx.vibrateShort({ type: 'medium' })
    },

    onFinish() {
      this.triggerEvent('finished')
    },

    onExit() {
      if (this._timer) {
        clearInterval(this._timer)
        this._timer = null
      }
      this.triggerEvent('exit')
    },

    restart() {
      this.setData({
        currentStep: 0,
        completed: false,
        isActive: false,
      })
    },
  },
})
