// pages/diary/diary.js

// 根据情绪类型返回主题色
const EMOTION_COLORS = {
  '愉悦': '#43e97b',
  '快乐': '#43e97b',
  '开心': '#43e97b',
  '平静': '#4facfe',
  '满足': '#4facfe',
  '焦虑': '#ff9a44',
  '紧张': '#ff9a44',
  '担忧': '#ff9a44',
  '愤怒': '#f5576c',
  '委屈': '#f5576c',
  '悲伤': '#667eea',
  '难过': '#667eea',
  '低落': '#667eea',
}

function getAccentColor(emotion) {
  if (!emotion) return '#667eea'
  for (const key of Object.keys(EMOTION_COLORS)) {
    if (emotion.includes(key)) return EMOTION_COLORS[key]
  }
  return '#667eea'
}

function calcStreak(history) {
  if (!history || history.length === 0) return 0
  const dates = [...new Set(history.map(item => {
    const d = item.date || ''
    return d.slice(0, 10)
  }))].sort().reverse()
  if (dates.length === 0) return 0
  let streak = 1
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const latestDate = new Date(dates[0])
  const diffDays = Math.floor((today - latestDate) / 86400000)
  if (diffDays > 1) return 0
  for (let i = 1; i < dates.length; i++) {
    const prev = new Date(dates[i - 1])
    const curr = new Date(dates[i])
    const diff = Math.floor((prev - curr) / 86400000)
    if (diff === 1) streak++
    else break
  }
  return streak
}

Page({
  data: { diaryHistory: [], streakDays: 0, todayCount: 0 },

  onShow() {
    const raw = wx.getStorageSync('diaryHistory') || []
    const todayStr = new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-')
    const history = raw.map(item => ({
      ...item,
      accentColor: getAccentColor(item.emotion)
    }))
    const todayCount = history.filter(item => (item.date || '').startsWith(todayStr)).length
    this.setData({
      diaryHistory: history,
      streakDays: calcStreak(raw),
      todayCount
    })
  },

  goTools() {
    const app = getApp()
    app.globalData.toolFilter = 'emotion_diary'
    wx.switchTab({ url: '/pages/tools/tools' })
  }
})
