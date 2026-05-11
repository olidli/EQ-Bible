// pages/test/test.js
const QUESTIONS = [
  { id: 1, text: '当别人批评你时，你的第一反应通常是？', options: ['感到愤怒并反驳', '感到难过但沉默', '冷静思考对方说得对不对', '无所谓，不在意'], scores: [1, 2, 4, 3] },
  { id: 2, text: '你能否准确说出自己此刻的情绪？', options: ['能，很清楚', '大概知道', '不太确定', '完全不清楚'], scores: [4, 3, 2, 1] },
  { id: 3, text: '面对压力时，你通常会？', options: ['容易崩溃', '感到焦虑但能撑住', '能冷静分析应对', '完全不受影响'], scores: [1, 2, 4, 3] },
  { id: 4, text: '当朋友向你倾诉烦恼时，你会？', options: ['不知如何回应', '给出建议', '认真倾听并表示理解', '转移话题'], scores: [1, 3, 4, 2] },
  { id: 5, text: '在团队合作中，你更倾向于？', options: ['独自完成任务', '听从安排', '积极沟通协调', '回避合作'], scores: [2, 3, 4, 1] },
  { id: 6, text: '当你和他人发生冲突时，你会？', options: ['坚持己见不让步', '沉默回避', '尝试理解对方立场', '立刻妥协'], scores: [1, 2, 4, 3] },
  { id: 7, text: '你对自己优缺点的了解程度？', options: ['非常了解', '比较了解', '了解一些', '不太了解'], scores: [4, 3, 2, 1] },
  { id: 8, text: '遇到挫折后，你通常多久能恢复？', options: ['很长时间', '需要几天', '很快就能调整', '几乎不受影响'], scores: [1, 2, 4, 3] },
  { id: 9, text: '你能否感知到他人的情绪变化？', options: ['很难察觉', '偶尔能感觉到', '大多数时候能感觉到', '非常敏锐'], scores: [1, 2, 3, 4] },
  { id: 10, text: '你对未来的态度是？', options: ['经常担忧', '有些迷茫', '有明确方向', '充满信心'], scores: [1, 2, 3, 4] },
]

const LEVELS = [
  { min: 0, max: 15, level: '情商新手', emoji: '🌱', desc: '你的情商有较大提升空间。建议从情绪识别开始学习，逐步提升自我觉察能力。', advice: '推荐学习：情绪识别、情绪日记' },
  { min: 16, max: 25, level: '情商进阶者', emoji: '🌿', desc: '你具备基本的情商能力，但在某些方面还需要加强。', advice: '推荐学习：情绪调节、自我反思' },
  { min: 26, max: 35, level: '情商达人', emoji: '🌳', desc: '你的情商水平较高，能较好地理解和管理自己与他人的情绪。', advice: '推荐学习：沟通技巧、领导力情商' },
  { min: 36, max: 40, level: '情商大师', emoji: '🏆', desc: '你拥有出色的情商能力！继续保持，并帮助身边的人一起成长。', advice: '推荐：深度学习心理学、成为情商教练' },
]

Page({
  data: {
    questions: QUESTIONS,
    currentIndex: 0,
    answers: [],
    currentQuestion: QUESTIONS[0],
    totalQuestions: QUESTIONS.length,
    finished: false,
    result: null,
    selectedOption: -1,
  },

  onLoad() {
    this.setData({ currentQuestion: QUESTIONS[0] })
  },

  selectOption(e) {
    const idx = e.currentTarget.dataset.index
    this.setData({ selectedOption: idx })
  },

  nextQuestion() {
    if (this.data.selectedOption < 0) {
      wx.showToast({ title: '请选择一个选项', icon: 'none' })
      return
    }
    const answers = [...this.data.answers, this.data.selectedOption]
    const nextIndex = this.data.currentIndex + 1

    if (nextIndex >= QUESTIONS.length) {
      this.calcResult(answers)
      return
    }

    this.setData({
      answers,
      currentIndex: nextIndex,
      currentQuestion: QUESTIONS[nextIndex],
      selectedOption: -1,
    })
  },

  calcResult(answers) {
    let total = 0
    answers.forEach((ans, i) => {
      total += QUESTIONS[i].scores[ans] || 0
    })
    const result = LEVELS.find(l => total >= l.min && total <= l.max) || LEVELS[0]
    result.score = total
    this.setData({ finished: true, result })
    // 保存测试结果
    const history = wx.getStorageSync('testHistory') || []
    history.unshift({ date: new Date().toLocaleDateString(), score: total, level: result.level })
    wx.setStorageSync('testHistory', history.slice(0, 20))
  },

  restart() {
    this.setData({
      currentIndex: 0,
      answers: [],
      currentQuestion: QUESTIONS[0],
      finished: false,
      result: null,
      selectedOption: -1,
    })
  },

  goBack() {
    wx.navigateBack({ delta: 1 })
  }
})
