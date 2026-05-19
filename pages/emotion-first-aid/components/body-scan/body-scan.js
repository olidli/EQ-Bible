// components/body-scan/body-scan.js
Component({
  properties: {},

  data: {
    steps: [
      { part: '头部', instruction: '皱紧眉头，然后放松，感受额头的舒展', duration: 20 },
      { part: '眼部', instruction: '紧闭双眼，然后轻轻睁开', duration: 15 },
      { part: '下颌', instruction: '咬紧牙关，然后让下巴自然下垂', duration: 20 },
      { part: '颈部', instruction: '耸肩贴近耳朵，然后完全放下', duration: 20 },
      { part: '肩膀', instruction: '双肩向后绕圈，然后完全放松', duration: 20 },
      { part: '手臂', instruction: '握紧拳头，然后五指张开，彻底放松', duration: 20 },
      { part: '胸部', instruction: '深吸一口气，保持，然后缓慢呼出', duration: 30 },
      { part: '腹部', instruction: '收紧腹部，然后完全放松', duration: 20 },
      { part: '腿部', instruction: '双腿用力，然后让它们完全放松', duration: 30 },
      { part: '脚部', instruction: '脚趾蜷缩，然后完全伸展放松', duration: 20 },
    ],
    currentStep: 0,
    totalSteps: 10,
    isActive: false,
    completed: false,
    currentPart: '',
    currentInstruction: '',
    remaining: 0,
  },

  lifetimes: {
    attached() {
      this.setData({
        totalSteps: this.data.steps.length,
        currentStep: 0,
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
    startScan() {
      this.setData({ isActive: true, completed: false, currentStep: 0 })
      this.runStep()
    },

    runStep() {
      const { currentStep, steps } = this.data
      if (currentStep >= steps.length) {
        this.finishScan()
        return
      }
      const step = steps[currentStep]
      this.setData({
        currentPart: step.part,
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

    finishScan() {
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
