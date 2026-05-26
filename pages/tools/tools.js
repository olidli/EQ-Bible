// pages/tools/tools.js
// 优化：统一使用 constants.js，移除所有硬编码常量

const app = getApp()
const {
  TOOL_META, CHARACTER_QUESTIONS, CHARACTER_TYPES,
  EMOTION_OPTIONS, GOAL_OPTIONS, DURATION_OPTIONS,
  REGULATION_STRATEGIES, REFLECTION_QUESTIONS, STRESS_QUESTIONS
} = require('../../utils/constants')

Page({
  data: {
    paramTool: '',
    currentTool: '',
    selectedTool: '',
    viewMode: 'list',
    toolList: Object.entries(TOOL_META).map(([id, meta]) => ({
      id, ...meta,
      color: [
        '#667eea', '#f5576c', '#f093fb', '#4facfe',
        '#67C23A', '#E6A23C', '#909399', '#764ba2',
        '#4ecdc4', '#ff6b6b', '#dda0dd', '#45b7d1'
      ][Object.keys(TOOL_META).indexOf(id) % 12]
    })),
    toolMeta: {},
    diary: { date: '', emotion: '', intensity: 5, trigger: '', coping: '' },
    emotionOptions: EMOTION_OPTIONS,
    diaryHistory: [],
    recognitionText: '',
    analysisResult: '',
    pathForm: { goal: '', duration: '', hoursPerWeek: 3 },
    goalOptions: GOAL_OPTIONS,
    durationOptions: DURATION_OPTIONS,
    generatedPath: null,
    regulationStrategies: REGULATION_STRATEGIES,
    reflectionQuestions: REFLECTION_QUESTIONS,
    reflectionAnswers: {},
    stressQuestions: STRESS_QUESTIONS,
    stressAnswers: {},
    stressResult: null,
    characterResult: null,
    characterQuestions: CHARACTER_QUESTIONS,
    characterAnswers: {},
    selectedRegulation: [],
    energyData: [],
    energyStats: null,
    energyDist: [],
  },

  onLoad(options) {
    const today = new Date()
    const dateStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`
    this.setData({
      'diary.date': dateStr,
      diaryHistory: wx.getStorageSync('diaryHistory') || []
    })
    if (options.tool) {
      this.setData({ paramTool: options.tool, currentTool: options.tool })
    }
  },

  onShow() {
    if (app.globalData.toolFilter) {
      const tool = app.globalData.toolFilter
      app.globalData.toolFilter = null
      this.setData({ paramTool: tool, currentTool: tool, selectedTool: tool, toolMeta: TOOL_META[tool] || {} })
    }
  },

  toggleView() {
    this.setData({ viewMode: this.data.viewMode === 'list' ? 'grid' : 'list' })
  },

  selectTool(e) {
    const id = e.currentTarget.dataset.id
    const tool = TOOL_META[id]
    
    // 如果有独立页面，则跳转
    if (tool && tool.page) {
      wx.navigateTo({ url: tool.page })
      return
    }
    
    this.setData({ currentTool: id, selectedTool: id, toolMeta: tool || {} })
    
    // 情绪能量图谱：加载数据
    if (id === 'emotion_energy') {
      this.loadEnergyChart()
    }
  },

  closeTool() {
    this.setData({ currentTool: '', selectedTool: '' })
  },

  selectEmotion(e) {
    this.setData({ 'diary.emotion': e.currentTarget.dataset.val })
  },

  setIntensity(e) {
    this.setData({ 'diary.intensity': e.detail.value })
  },

  setTrigger(e) {
    this.setData({ 'diary.trigger': e.detail.value })
  },

  setCoping(e) {
    this.setData({ 'diary.coping': e.detail.value })
  },

  saveDiary() {
    const d = this.data.diary
    if (!d.emotion) {
      wx.showToast({ title: '请选择情绪', icon: 'none' })
      return
    }
    const history = [d, ...this.data.diaryHistory].slice(0, 30)
    this.setData({ diaryHistory: history })
    wx.setStorageSync('diaryHistory', history)
    this.setData({ diary: { ...d, emotion: '', trigger: '', coping: '', intensity: 5 } })
    wx.showToast({ title: '保存成功', icon: 'success' })
  },

  setRecognitionText(e) {
    this.setData({ recognitionText: e.detail.value })
  },

  analyzeEmotion() {
    const text = this.data.recognitionText.trim()
    if (!text) {
      wx.showToast({ title: '请描述你的情绪', icon: 'none' })
      return
    }
    const emotionMap = [
      { pattern: /焦虑|担心|紧张|忐忑/, tag: '焦虑', searchKw: '焦虑 情绪管理', advice: '你目前可能处于轻度焦虑状态。' },
      { pattern: /愤怒|生气|恼火|火大/, tag: '愤怒', searchKw: '愤怒管理 情绪调节', advice: '你可能感到愤怒。' },
      { pattern: /悲伤|难过|伤心|失落/, tag: '悲伤', searchKw: '悲伤 情绪接纳', advice: '悲伤是一种正常的情绪。' },
      { pattern: /开心|高兴|快乐|愉快/, tag: '开心', searchKw: '积极情绪 感恩', advice: '积极的情绪状态！' },
      { pattern: /压力|紧张|疲惫/, tag: '压力', searchKw: '压力管理 放松', advice: '你可能感到压力较大。' },
    ]

    let detected = null
    for (const item of emotionMap) {
      if (item.pattern.test(text)) { detected = item; break }
    }

    let result = detected ? detected.advice : '感谢分享！你的情绪体验是真实的。'
    result += '\n\n💡 建议：\n1. 给这个情绪命名\n2. 接受它的存在\n3. 思考它想告诉你什么'

    if (detected) {
      const related = app.search(detected.searchKw, 3)
      if (related && related.length > 0) {
        result += '\n\n📚 推荐阅读：'
        related.slice(0, 3).forEach(item => {
          result += `\n• ${item.t}`
        })
      }
    }

    this.setData({ analysisResult: result })
  },

  selectGoal(e) {
    this.setData({ 'pathForm.goal': e.currentTarget.dataset.goal })
  },

  selectDuration(e) {
    this.setData({ 'pathForm.duration': e.currentTarget.dataset.dur })
  },

  setHours(e) {
    this.setData({ 'pathForm.hoursPerWeek': e.detail.value })
  },

  generatePath() {
    const { goal, duration, hoursPerWeek } = this.data.pathForm
    if (!goal || !duration) {
      wx.showToast({ title: '请选择目标和时间', icon: 'none' })
      return
    }
    const pathData = {
      goal,
      duration,
      hoursPerWeek,
      steps: [
        { title: '自我认知', desc: `了解自己在${goal}方面的现状和基础`, duration: '第1-2周' },
        { title: '基础知识', desc: '学习情商基础理论和核心概念', duration: '第3-4周' },
        { title: '技能练习', desc: '通过工具和案例进行实践练习', duration: '第5-8周' },
        { title: '深度应用', desc: '将所学应用到实际生活场景中', duration: '第9-12周' },
        { title: '持续提升', desc: '定期反思总结，建立持续成长习惯', duration: '长期' },
      ]
    }
    this.setData({ generatedPath: pathData })
  },

  savePath() {
    const path = this.data.generatedPath
    if (!path) return
    const saved = wx.getStorageSync('learningPaths') || []
    saved.unshift({ ...path, savedAt: new Date().toLocaleDateString() })
    wx.setStorageSync('learningPaths', saved.slice(0, 10))
    wx.showToast({ title: '路径已保存', icon: 'success' })
  },

  selectRegulation(e) {
    const name = e.currentTarget.dataset.name
    const selected = this.data.selectedRegulation || []
    const idx = selected.indexOf(name)
    if (idx > -1) selected.splice(idx, 1)
    else selected.push(name)
    this.setData({ selectedRegulation: selected })
  },

  applyRegulation() {
    if (!this.data.selectedRegulation.length) {
      wx.showToast({ title: '请选择调节策略', icon: 'none' })
      return
    }
    wx.showModal({
      title: '✅ 调节计划',
      content: `已选择 ${this.data.selectedRegulation.length} 个策略。建议每天练习至少一个，坚持21天形成习惯。`,
      showCancel: false
    })
  },

  setReflection(e) {
    const idx = e.currentTarget.dataset.idx
    const answers = { ...this.data.reflectionAnswers, [idx]: e.detail.value }
    this.setData({ reflectionAnswers: answers })
  },

  saveReflection() {
    const answers = this.data.reflectionAnswers
    const history = wx.getStorageSync('reflectionHistory') || []
    history.unshift({ date: new Date().toLocaleDateString(), answers })
    wx.setStorageSync('reflectionHistory', history.slice(0, 30))
    this.setData({ reflectionAnswers: {} })
    wx.showToast({ title: '反思已保存', icon: 'success' })
  },

  setStressAnswer(e) {
    const id = e.currentTarget.dataset.id
    const val = parseInt(e.detail.value)
    const answers = { ...this.data.stressAnswers, [id]: val }
    this.setData({ stressAnswers: answers })
  },

  calcStress() {
    const answers = this.data.stressAnswers
    if (Object.keys(answers).length < 6) {
      wx.showToast({ title: '请完成所有问题', icon: 'none' })
      return
    }
    const total = Object.values(answers).reduce((a, b) => a + b, 0)
    let level = '正常'
    let advice = '你的压力水平正常，继续保持良好的生活习惯。'
    if (total > 20) {
      level = '中度压力'
      advice = '建议学习压力管理技巧，必要时寻求专业支持。'
    } else if (total > 15) {
      level = '轻度压力'
      advice = '建议增加放松活动，保证睡眠，适当运动。'
    }
    this.setData({ stressResult: { total, level, advice } })
    const history = wx.getStorageSync('stressHistory') || []
    history.unshift({ date: new Date().toLocaleDateString(), score: total })
    wx.setStorageSync('stressHistory', history.slice(0, 20))
  },

  setCharacterAnswer(e) {
    const qid = e.currentTarget.dataset.q
    const val = parseInt(e.detail.value)
    const answers = { ...this.data.characterAnswers, [qid]: val }
    this.setData({ characterAnswers: answers })
  },

  calcCharacter() {
    const a = this.data.characterAnswers || {}
    const required = ['q1','q2','q3','q4','q5','q6','q7','q8','q9']
    const missing = required.filter(q => !a[q] && a[q] !== 0)
    if (missing.length > 0) {
      wx.showToast({ title: `请完成全部9道题（还差${missing.length}题）`, icon: 'none' })
      return
    }
    const eiScore = (parseInt(a.q1) + parseInt(a.q4) + parseInt(a.q7)) / 6
    const snScore = (parseInt(a.q2) + parseInt(a.q5) + parseInt(a.q8)) / 6
    const tfScore = (parseInt(a.q3) + parseInt(a.q6) + parseInt(a.q9)) / 6
    const eiKey = eiScore >= 0.5 ? 'I' : 'E'
    const snKey = snScore >= 0.5 ? 'N' : 'S'
    const tfKey = tfScore >= 0.5 ? 'F' : 'T'
    const typeKey = eiKey + '-' + snKey + '-' + tfKey
    const result = CHARACTER_TYPES[typeKey] || CHARACTER_TYPES['I-N-F']
    this.setData({ characterResult: result })
    const history = wx.getStorageSync('characterHistory') || []
    history.unshift({ date: new Date().toLocaleDateString(), type: result.name, typeKey })
    wx.setStorageSync('characterHistory', history.slice(0, 10))
  },

  goTest() {
    wx.switchTab({ url: '/pages/test/test' })
  },

  // 查看情绪日记完整统计
  goDiaryStats() {
    wx.navigateTo({ url: '/pages/diary/diary' })
  },

  // ===== 情绪能量图谱 =====
  EMOTION_COLORS: {
    '愉悦': '#43e97b', '快乐': '#43e97b', '开心': '#43e97b',
    '平静': '#4facfe', '满足': '#4facfe',
    '焦虑': '#ff9a44', '紧张': '#ff9a44', '担忧': '#ff9a44',
    '愤怒': '#f5576c',
    '悲伤': '#667eea', '难过': '#667eea', '低落': '#667eea',
    '恐惧': '#764ba2', '惊讶': '#f093fb', '无聊': '#909399',
  },

  getEmotionColor(emotion) {
    if (!emotion) return '#667eea'
    for (const key of Object.keys(this.EMOTION_COLORS)) {
      if (emotion.includes(key)) return this.EMOTION_COLORS[key]
    }
    return '#667eea'
  },

  loadEnergyChart() {
    const raw = wx.getStorageSync('diaryHistory') || []
    if (raw.length === 0) {
      this.setData({ energyData: [], energyStats: null })
      return
    }

    // 最近14条，按日期排序
    const sorted = [...raw].sort((a, b) => (a.date || '').localeCompare(b.date || '')).slice(-14)
    
    // 统计摘要
    const emotionCount = {}
    let totalIntensity = 0
    sorted.forEach(item => {
      const e = item.emotion || '未知'
      emotionCount[e] = (emotionCount[e] || 0) + 1
      totalIntensity += item.intensity || 5
    })
    const topEmotion = Object.keys(emotionCount).sort((a, b) => emotionCount[b] - emotionCount[a])[0] || '无'
    const avgIntensity = (totalIntensity / sorted.length).toFixed(1)
    const dates = [...new Set(sorted.map(i => (i.date || '').slice(0, 10)))].length

    // 构建图表数据
    const chartData = sorted.map(item => ({
      date: (item.date || '').slice(5, 10),
      fullDate: item.date || '',
      emotion: item.emotion || '未知',
      intensity: item.intensity || 5,
      color: this.getEmotionColor(item.emotion),
    }))

    // 情绪分布
    const distList = Object.entries(emotionCount)
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({
        name,
        count,
        color: this.getEmotionColor(name),
        percent: Math.round(count / sorted.length * 100),
      }))

    this.setData({
      energyData: chartData,
      energyStats: {
        total: sorted.length,
        dates,
        topEmotion,
        topEmotionCount: emotionCount[topEmotion] || 0,
        avgIntensity,
      },
      energyDist: distList,
    })
  },
})

