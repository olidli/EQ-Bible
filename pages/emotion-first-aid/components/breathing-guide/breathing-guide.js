// components/breathing-guide/breathing-guide.js
Component({
  properties: {},

  data: {
    // 阶段状态：ready | inhale | hold | exhale | finished
    phase: 'ready',
    // 当前阶段倒计时
    countdown: 0,
    // 当前循环计数
    cycleCount: 1,
    // 总循环数（默认3个完整循环）
    totalCycles: 3,
    // 是否运行中
    isRunning: false,
    // 是否已完成
    isFinished: false,
    // 当前循环中的阶段索引 0=吸气, 1=屏气, 2=呼气
    phaseIndex: 0,
    // 阶段配置
    phases: [
      { name: 'inhale', duration: 4, label: '吸气', instruction: '用鼻子缓慢吸气...' },
      { name: 'hold', duration: 7, label: '屏气', instruction: '屏住呼吸...' },
      { name: 'exhale', duration: 8, label: '呼气', instruction: '用嘴巴缓慢呼气...' },
    ],
  },

  methods: {
    // 开始呼吸练习
    startBreathing() {
      if (this.data.isRunning) return

      this.setData({
        isRunning: true,
        isFinished: false,
        phase: 'inhale',
        phaseIndex: 0,
        countdown: 4,
        cycleCount: 1,
      })

      this.startTimer()
    },

    // 启动定时器
    startTimer() {
      this._timer = setInterval(() => {
        this.tick()
      }, 1000)
    },

    // 每秒触发
    tick() {
      let { phaseIndex, countdown, cycleCount, totalCycles, phases } = this.data

      countdown--

      if (countdown === 0) {
        // 切换到下一阶段
        phaseIndex++

        if (phaseIndex >= phases.length) {
          // 一个完整循环结束
          cycleCount++
          phaseIndex = 0

          if (cycleCount > totalCycles) {
            // 全部循环完成
            this.finishBreathing()
            return
          }
        }

        const nextPhase = phases[phaseIndex]
        this.setData({
          phase: nextPhase.name,
          phaseIndex: phaseIndex,
          countdown: nextPhase.duration,
          cycleCount: cycleCount,
        })
      } else {
        this.setData({ countdown: countdown })
      }
    },

    // 停止呼吸练习
    stopBreathing() {
      if (this._timer) {
        clearInterval(this._timer)
        this._timer = null
      }
      this.setData({ isRunning: false })
    },

    // 完成练习
    finishBreathing() {
      this.stopBreathing()
      this.setData({
        isFinished: true,
        isRunning: false,
        phase: 'finished',
      })
      this.triggerEvent('finished')
    },

    // 退出
    exit() {
      this.stopBreathing()
      this.triggerEvent('exit')
    },

    // 重新开始
    restart() {
      this.setData({
        phase: 'ready',
        isFinished: false,
        cycleCount: 1,
        phaseIndex: 0,
      })
    },
  },

  detached() {
    if (this._timer) {
      clearInterval(this._timer)
      this._timer = null
    }
  },
})
