// pages/tools/tools.js
// 优化：统一使用 constants.js，移除所有硬编码常量

const app = getApp()
const {
  TOOL_META, CHARACTER_QUESTIONS, CHARACTER_TYPES,
  EMOTION_OPTIONS, GOAL_OPTIONS, DURATION_OPTIONS,
  REGULATION_STRATEGIES, REFLECTION_QUESTIONS, STRESS_QUESTIONS
} = require('../../utils/constants')

// 价值观澄清 - 30个核心价值
const VALUE_OPTIONS = [
  { name: '创造', emoji: '🎨' },   { name: '安全', emoji: '🛡️' },
  { name: '友谊', emoji: '🤝' },   { name: '秩序', emoji: '📐' },
  { name: '健康', emoji: '💪' },   { name: '公平', emoji: '⚖️' },
  { name: '幽默', emoji: '😄' },   { name: '成就感', emoji: '🏆' },
  { name: '家庭', emoji: '👨‍👩‍👧‍👦' }, { name: '真理', emoji: '🔍' },
  { name: '美丽', emoji: '🌸' },   { name: '独立', emoji: '🌿' },
  { name: '责任', emoji: '📋' },   { name: '自由', emoji: '🕊️' },
  { name: '合作', emoji: '🤲' },   { name: '权力', emoji: '👑' },
  { name: '财富', emoji: '💰' },   { name: '尊重', emoji: '🙏' },
  { name: '成长', emoji: '🌱' },   { name: '传统', emoji: '🏮' },
  { name: '冒险', emoji: '🚀' },   { name: '爱情', emoji: '💕' },
  { name: '知识', emoji: '📚' },   { name: '同理心', emoji: '💗' },
  { name: '稳定', emoji: '🏠' },   { name: '诚信', emoji: '⭐' },
  { name: '自然', emoji: '🌳' },   { name: '智慧', emoji: '🧠' },
  { name: '信仰', emoji: '🕯️' },  { name: '挑战', emoji: '⛰️' },
]

// 打乱数组（Fisher-Yates）
function shuffleArray(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// 价值观 → 推荐关键词映射
const VALUE_KEYWORDS = {
  '家庭': ['家庭', '亲子', '父母', '亲情', '家人'],
  '健康': ['健康', '压力', '情绪', '身心'],
  '财富': ['职场', '职业', '工作', '财富'],
  '自由': ['自由', '独立', '自主', '自我'],
  '安全': ['安全感', '焦虑', '安全', '情绪管理'],
  '成就感': ['成就', '目标', '成长', '成功'],
  '友谊': ['友谊', '朋友', '人际', '社交'],
  '爱情': ['爱情', '亲密关系', '伴侣', '恋爱'],
  '知识': ['学习', '知识', '成长', '读书'],
  '创造': ['创造', '创意', '创新', '想象'],
  '诚信': ['诚信', '信任', '正直', '品格'],
  '责任': ['责任', '担当', '承诺', '靠谱'],
  '尊重': ['尊重', '礼貌', '沟通', '倾听'],
  '同理心': ['同理心', '共情', '倾听', '理解'],
  '合作': ['合作', '团队', '沟通', '协作'],
  '独立': ['独立', '自主', '自我', '成长'],
  '成长': ['成长', '进步', '学习', '提升'],
  '挑战': ['挑战', '突破', '勇气', '走出'],
  '稳定': ['稳定', '安全感', '情绪管理', '平静'],
  '自然': ['自然', '放松', '平静', '正念'],
  '信仰': ['信仰', '信念', '价值观', '意义'],
  '幽默': ['幽默', '轻松', '沟通', '乐观'],
  '美丽': ['美', '审美', '品质', '生活'],
  '真理': ['真理', '真实', '思考', '本质'],
  '智慧': ['智慧', '思考', '成长', '人生'],
  '公平': ['公平', '公正', '尊重', '原则'],
  '传统': ['传统', '家庭', '文化', '传承'],
  '冒险': ['冒险', '挑战', '勇气', '探索'],
  '秩序': ['秩序', '规则', '效率', '条理'],
  '权力': ['权力', '领导', '影响', '管理'],
}

// 在知识库中搜索与价值观相关的文章
function searchValueArticles(top3) {
  const items = getApp().globalData.items || []
  if (!items.length) return []
  const matched = new Set()
  const result = []
  // 遍历前三名价值观的关键词
  for (const value of top3) {
    const kws = VALUE_KEYWORDS[value] || [value]
    for (const item of items) {
      if (matched.has(item.id)) continue
      const searchText = (item.t + ' ' + (item.tg || []).join(' ') + ' ' + (item.moduleName || '')).toLowerCase()
      for (const kw of kws) {
        if (searchText.includes(kw.toLowerCase())) {
          matched.add(item.id)
          result.push({
            id: item.id,
            title: item.t,
            module: item.moduleName || '',
            tag: value,  // 匹配的价值观名称
          })
          break
        }
      }
    }
    if (result.length >= 6) break  // 最多推荐6条
  }
  return result.slice(0, 6)
}

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
    // 价值观澄清
    valueOptions: VALUE_OPTIONS,
    valueStep: 1,
    valueSelected: [],
    valueResult: null,
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
    
    // 价值观澄清：每次打开随机打乱选项顺序
    if (id === 'value_clarify') {
      this.setData({
        valueOptions: shuffleArray(VALUE_OPTIONS),
        valueStep: 1,
        valueSelected: [],
        valueResult: null,
      })
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

  // ===== 价值观澄清练习 =====
  toggleValue(e) {
    const name = e.currentTarget.dataset.name
    const selected = [...this.data.valueSelected]
    const idx = selected.indexOf(name)
    if (idx > -1) {
      selected.splice(idx, 1)
    } else {
      if (selected.length >= 10) {
        wx.showToast({ title: '最多选择10个价值观', icon: 'none' })
        return
      }
      selected.push(name)
    }
    this.setData({ valueSelected: selected })
  },

  nextValueStep() {
    if (this.data.valueStep === 1 && this.data.valueSelected.length < 3) {
      wx.showToast({ title: '请至少选择3个价值观', icon: 'none' })
      return
    }
    if (this.data.valueStep === 2 && this.data.valueSelected.length < 3) {
      this.setData({ valueStep: 1 })
      return
    }
    if (this.data.valueStep === 2) {
      this.generateValueAnalysis()
      return
    }
    this.setData({ valueStep: 2 })
  },

  moveValueUp(e) {
    const idx = e.currentTarget.dataset.idx
    if (idx === 0) return
    const s = [...this.data.valueSelected]
    ;[s[idx - 1], s[idx]] = [s[idx], s[idx - 1]]
    this.setData({ valueSelected: s })
  },

  moveValueDown(e) {
    const idx = e.currentTarget.dataset.idx
    const s = [...this.data.valueSelected]
    if (idx >= s.length - 1) return
    ;[s[idx], s[idx + 1]] = [s[idx + 1], s[idx]]
    this.setData({ valueSelected: s })
  },

  generateValueAnalysis() {
    const selected = this.data.valueSelected
    if (selected.length < 3) {
      wx.showToast({ title: '请至少选择3个价值观', icon: 'none' })
      return
    }
    const top3 = selected.slice(0, 3)
    const insightMap = {
      '家庭': '你把家庭放在首位，意味着亲密关系和归属感对你至关重要。', '健康': '你重视健康，说明你明白身体是一切的基础。',
      '财富': '你追求财富，说明你看重物质保障和生活品质。', '自由': '你渴望自由，说明你讨厌被束缚，向往自主掌控人生。',
      '安全': '你重视安全感，说明稳定和可预测的环境对你很重要。', '成就感': '你追求成就感，说明你享受通过努力达成目标的过程。',
      '友谊': '你重视友谊，说明真诚的人际连接是你幸福的重要来源。', '爱情': '你重视爱情，说明亲密的情感关系是你生命中的重要支柱。',
      '知识': '你追求知识，说明你相信学习和思考能带来成长。', '创造': '你有创造欲，说明你喜欢用新想法和新方式表达自己。',
      '诚信': '你重视诚信，说明正直和可信是你做人的底线。', '责任': '你有责任感，说明你是一个可靠、值得信赖的人。',
      '尊重': '你渴望尊重，说明你希望被公平对待，也愿意尊重他人。', '同理心': '你有很强的同理心，说明你能理解他人的感受和处境。',
      '合作': '你重视合作，说明你相信众人拾柴火焰高。', '独立': '你追求独立，说明你希望依靠自己的力量走自己的路。',
      '成长': '你重视成长，说明你相信终身学习和自我提升的价值。', '挑战': '你喜欢挑战，说明你渴望突破舒适圈、不断超越自己。',
      '稳定': '你追求稳定，说明有序和可预测的生活让你感到安心。', '自然': '你热爱自然，说明你在自然中找到平静和力量。',
      '信仰': '你有坚定的信仰，说明你有精神支柱和价值指引。', '幽默': '你有幽默感，说明你能用轻松的方式面对生活。',
      '美丽': '你追求美，说明你有敏锐的审美和对品质的追求。', '真理': '你追求真理，说明你渴望真实和深度理解。',
      '智慧': '你追求智慧，说明你不仅想要知识，更想理解生命的本质。', '公平': '你重视公平，说明正义和平等是你心中的准则。',
      '传统': '你尊重传统，说明你重视传承和文化根基。', '冒险': '你喜欢冒险，说明你享受未知带来的刺激和可能性。',
      '秩序': '你重视秩序，说明条理和规则让你的生活更高效。', '权力': '你追求权力，说明你渴望影响力和掌控力。',
    }
    const insights = top3.map(v => insightMap[v] || `${v}是你重要的价值取向。`)
    const result = {
      top1: top3[0], top2: top3[1], top3: top3[2],
      insights,
      summary: `你的核心价值是「${top3[0]}」、「${top3[1]}」和「${top3[2]}」。它反映了你内心真正在意什么、什么驱动你做决定。`,
      advice: '建议：\n1. 定期回顾你的核心价值，确保生活和工作与它们一致\n2. 在做重要决定时，用核心价值观作为衡量标准\n3. 如果感到迷茫，回到你的价值观清单上重新对齐',
      articles: searchValueArticles(top3),
    }
    this.setData({ valueResult: result, valueStep: 3 })
    // 保存历史
    const history = wx.getStorageSync('valueHistory') || []
    history.unshift({ date: new Date().toLocaleDateString(), top3, all: selected })
    wx.setStorageSync('valueHistory', history.slice(0, 10))
  },

  resetValue() {
    this.setData({ valueStep: 1, valueSelected: [], valueResult: null })
  },

  // 跳转知识详情
  goArticle(e) {
    const id = e.currentTarget.dataset.id
    if (id) {
      wx.navigateTo({ url: `/pages/detail/detail?id=${id}` })
    }
  },
})

