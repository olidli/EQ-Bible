// utils/constants.js - 公共常量（原先 4 个文件各自定义，现统一到此）
// 使用方式：const { getTypeInfo, MODULE_TAGS, MODULE_NAMES } = require('../../utils/constants')

// ========== 内容类型标签 ==========
const TYPE_LABELS = {
  PDF: 'PDF',
  Word: '文档',
  Markdown: '指南',
  '工具': '工具',
  '案例': '案例',
  '笔记': '笔记',
  '微信公众号文章': '科普',
  '网页链接': '网页',
  '书籍摘要': '摘要',
  '文章': '文章',
  '技巧卡片': '技巧',
  '指南': '指南',
}

const TYPE_COLORS = {
  PDF: '#ff6b6b',
  Word: '#4ecdc4',
  Markdown: '#45b7d1',
  '工具': '#dda0dd',
  '案例': '#f7dc6f',
  '笔记': '#96ceb4',
  '微信公众号文章': '#f0a3e2',
  '网页链接': '#7bc96f',
  '书籍摘要': '#764ba2',
  '文章': '#667eea',
  '技巧卡片': '#4facfe',
  '指南': '#667eea',
}

/**
 * 根据类型获取标签和颜色
 * @param {string} tp 内容类型
 * @returns {{ label: string, color: string }}
 */
const getTypeInfo = (tp) => ({
  label: TYPE_LABELS[tp] || '资源',
  color: TYPE_COLORS[tp] || '#667eea',
})

// ========== 模块标签映射（原 TAG_MAP，从 category.js 统一到此）==========
const MODULE_NAMES = {
  self_aware:    '自我认知',
  emotion:       '情绪管理',
  communication: '沟通技巧',
  relation:      '人际关系',
  workplace:     '职场情商',
  psychology:    '心理学常识',
  growth:        '个人成长',
  parenting:     '亲子教育',
}

const MODULE_TAGS = {
  self_aware:    ['自我认知', '自我觉察', '自我理解', '自我效能', '性格密码', '内向者'],
  emotion:       ['情绪管理', '情绪调节', '情绪识别', '焦虑', '正念', '情绪边界', '情绪劳动'],
  communication: ['沟通技巧', '非暴力沟通', '倾听', '赞美', '批评', '冲突', '话术', '梅拉宾'],
  relation:      ['人际关系', '亲密关系', '社交商', '课题分离', '依恋', '人际边界', '故事'],
  workplace:     ['职场情商', '领导情商', '向上管理', '恢复力', '团队协作'],
  psychology:    ['心理学常识', '认知偏差', '共情', '心流', '人格障碍', '行为模型'],
  growth:        ['个人成长', '拖延', '习惯', '决策', '自我接纳', '成长型思维'],
  parenting:     ['亲子教育', '儿童情商', '积极教养', '家长情绪'],
}

// ========== 模块元数据（emoji + 描述，供 category 页面使用）==========
const MODULE_META = {
  self_aware:    { emoji: '🧠', desc: '深入了解自己的优势与动机' },
  emotion:       { emoji: '😊', desc: '学会识别、表达和调节情绪' },
  communication: { emoji: '💬', desc: '掌握高情商沟通的核心方法' },
  relation:      { emoji: '🤝', desc: '建立和维护健康的人际关系' },
  workplace:     { emoji: '💼', desc: '提升职场情商和领导力' },
  psychology:    { emoji: '📚', desc: '了解心理学基础知识与原理' },
  growth:        { emoji: '🌱', desc: '持续成长，成为更好的自己' },
  parenting:     { emoji: '👨‍👩‍👧', desc: '培养高情商孩子的科学方法' },
}

// ========== 模块推荐工具 ID 列表（供 category 页面使用）==========
const MODULE_TOOLS = {
  self_aware:    ['self_reflection'],
  emotion:       ['emotion_diary', 'emotion_recognition'],
  communication: [],
  relation:      [],
  workplace:     [],
  psychology:    [],
  growth:        ['character_test'],
  parenting:     [],
}

// ========== 工具元数据（供 index 和 tools 页面使用）==========
const TOOL_META = {
  emotion_diary:      { name: '情绪日记',     emoji: '📝', desc: '记录每日情绪变化和触发事件' },
  emotion_recognition: { name: '情绪识别',     emoji: '🎭', desc: '帮助你识别不同的情绪状态' },
  emotion_regulation:  { name: '情绪调节',     emoji: '⚙️', desc: '提供情绪调节的方法和策略' },
  emotion_energy:      { name: '情绪能量图谱', emoji: '📈', desc: '可视化情绪能量变化趋势' },
  self_reflection:     { name: '自我反思日记', emoji: '📝', desc: '深入自我探索和反思' },
  value_clarify:       { name: '价值观澄清练习', emoji: '💎', desc: '明确核心价值观' },
  ability_assess:      { name: '能力评估表',   emoji: '📊', desc: '评估个人能力优势' },
  goal_setting:        { name: '人生目标设定', emoji: '🎯', desc: '设定长期和短期目标' },
  character_test:      { name: '性格测试',     emoji: '🔍', desc: '了解自己的性格类型' },
  stress_assess:       { name: '压力评估',     emoji: '📊', desc: '评估当前压力水平' },
  learning_path:       { name: '学习路径生成', emoji: '🗺', desc: '根据目标生成个性化学习计划' },
}

// ========== 情绪选项（tools 页面情绪日记）==========
const EMOTION_OPTIONS = [
  { label: '开心', val: '开心', emoji: '😄' },
  { label: '平静', val: '平静', emoji: '😌' },
  { label: '焦虑', val: '焦虑', emoji: '😰' },
  { label: '愤怒', val: '愤怒', emoji: '😠' },
  { label: '悲伤', val: '悲伤', emoji: '😢' },
  { label: '恐惧', val: '恐惧', emoji: '😨' },
  { label: '惊讶', val: '惊讶', emoji: '😮' },
  { label: '无聊', val: '无聊', emoji: '😑' },
]

// ========== 学习目标选项 ==========
const GOAL_OPTIONS = ['提升情商', '职场晋升', '人际关系', '自我成长', '情绪管理', '沟通能力']

// ========== 学习时长选项 ==========
const DURATION_OPTIONS = ['1周', '2周', '1个月', '3个月', '半年', '1年']

// ========== 情绪调节策略 ==========
const REGULATION_STRATEGIES = [
  { name: '深呼吸练习', desc: '缓慢深呼吸4-7-8：吸气4秒，屏气7秒，呼气8秒', emoji: '🌬️' },
  { name: '渐进式肌肉放松', desc: '从头到脚依次收紧和放松肌肉群', emoji: '💪' },
  { name: '认知重构', desc: '换个角度看问题，寻找积极的一面', emoji: '🔄' },
  { name: '正念冥想', desc: '专注于当下，觉察而不评判', emoji: '🧘' },
  { name: '情绪表达', desc: '用"我感到..."句式表达情绪', emoji: '💬' },
  { name: '转移注意力', desc: '暂时离开情境，做些能放松的事', emoji: '🎯' },
]

// ========== 自我反思问题 ==========
const REFLECTION_QUESTIONS = [
  '今天最让我开心的是什么？',
  '今天我学到了什么新东西？',
  '我今天是如何处理困难的？',
  '我对他人产生了什么积极影响？',
  '如果重来，我会做得更好的是什么？',
  '我今天感恩的是什么？',
]

// ========== 压力评估问题 ==========
const STRESS_QUESTIONS = [
  { q: '最近是否经常感到疲惫？', id: 'tired' },
  { q: '是否难以集中注意力？', id: 'focus' },
  { q: '睡眠质量如何？', id: 'sleep' },
  { q: '是否容易烦躁或焦虑？', id: 'anxious' },
  { q: '是否感到时间不够用？', id: 'time' },
  { q: '是否缺乏动力？', id: 'motivation' },
]

// ========== 性格测试题目（9题，3维度 × 3题）==========
// 维度分组：q1/q4/q7=E/I外向内向 | q2/q5/q8=S/N分析直觉 | q3/q6/q9=T/F理性感性
const CHARACTER_QUESTIONS = [
  { id: 'q1', q: '在社交场合，你通常…', options: ['主动认识新朋友', '视情况而定', '等待别人来认识我'] },
  { id: 'q2', q: '你更关注…', options: ['实际经验和细节', '未来可能性和大局', '当下的感受'] },
  { id: 'q3', q: '做决定时，你更依赖…', options: ['逻辑和客观分析', '平衡逻辑与他人感受', '内心价值观和他人感受'] },
  { id: 'q4', q: '周末你更倾向于…', options: ['参加聚会或外出', '既可以独处也可以社交', '安静独处或少量深聊'] },
  { id: 'q5', q: '你描述一件事时，更常…', options: ['列举具体细节和事实', '先说结论再解释', '描述感受和印象'] },
  { id: 'q6', q: '看到别人难过，你第一反应是…', options: ['帮他分析问题原因', '陪着他，听他倾诉', '感同身受，情绪也被影响'] },
  { id: 'q7', q: '学习新知识，你更喜欢…', options: ['讨论和互动式学习', '边做边学', '独立思考和研究'] },
  { id: 'q8', q: '别人形容你，更可能用…', options: ['务实、靠谱', '有想法、脑洞大', '温暖、善解人意'] },
  { id: 'q9', q: '面对冲突，你的风格是…', options: ['直面问题，据理力争', '寻求双赢的妥协方案', '避免冲突，优先考虑关系'] },
]

// ========== 性格类型结果 ==========
const CHARACTER_TYPES = {
  'E-S-T': { name: '务实型', sub: 'ESTJ/ESTP', desc: '你是一个务实、行动力强的人。善于分析事实，追求效率和成果，适合需要执行力和管理能力的场景。', emoji: '💼' },
  'E-S-F': { name: '社交型', sub: 'ESFJ/ESFP', desc: '你热情开朗，乐于助人，善于与人合作。富有感染力，喜欢在团队中发挥影响力。', emoji: '🎉' },
  'E-N-T': { name: '领导型', sub: 'ENTJ/ENTP', desc: '你富有战略眼光，善于创新和解决问题。对新想法充满热情，适合需要前瞻性和创造力的领域。', emoji: '🚀' },
  'E-N-F': { name: '理想型', sub: 'ENFJ/ENFP', desc: '你充满热情和感染力，善于激励他人。富有想象力和同理心，是天生的沟通者和激励者。', emoji: '✨' },
  'I-S-T': { name: '专家型', sub: 'ISTJ/ISTP', desc: '你沉稳务实，注重细节和事实。善于独立思考和技术性问题解决，讲究实际效果。', emoji: '🔧' },
  'I-S-F': { name: '守护型', sub: 'ISFJ/ISFP', desc: '你温暖细腻，重视承诺和责任。善于照顾他人感受，在安静中给予强大的支持力量。', emoji: '🌿' },
  'I-N-T': { name: '洞察型', sub: 'INTJ/INTP', desc: '你思维深刻，喜欢独立探索。善于分析复杂问题，追求逻辑自洽和深度理解。', emoji: '🏔️' },
  'I-N-F': { name: '梦想家', sub: 'INFP/INFJ', desc: '你富有同理心和理想主义色彩。重视价值观和内在意义，善于理解和支持他人的内在世界。', emoji: '🌙' },
}

// ========== 搜索页热门标签 ==========
const SEARCH_HOT_TAGS = ['情绪管理', '自我认知', '沟通技巧', '情商', '心理学', '人际关系', '领导力', '性格分析', '认知偏差', '共情', '非暴力沟通', '正念冥想']

// ========== 热门标签颜色 ==========
const SEARCH_TAG_COLORS = [
  { bg: 'rgba(102,126,234,0.12)', color: '#667eea', border: 'rgba(102,126,234,0.2)' },
  { bg: 'rgba(240,147,251,0.12)', color: '#c55ed8', border: 'rgba(240,147,251,0.2)' },
  { bg: 'rgba(79,172,254,0.12)',  color: '#2980d4', border: 'rgba(79,172,254,0.2)' },
  { bg: 'rgba(245,87,108,0.12)',  color: '#d63653', border: 'rgba(245,87,108,0.2)' },
  { bg: 'rgba(67,233,123,0.12)',  color: '#1aab56', border: 'rgba(67,233,123,0.2)' },
  { bg: 'rgba(255,154,68,0.12)',  color: '#d4711a', border: 'rgba(255,154,68,0.2)' },
]

module.exports = {
  TYPE_LABELS, TYPE_COLORS, getTypeInfo,
  MODULE_NAMES, MODULE_TAGS, MODULE_META, MODULE_TOOLS,
  TOOL_META,
  EMOTION_OPTIONS, GOAL_OPTIONS, DURATION_OPTIONS,
  REGULATION_STRATEGIES, REFLECTION_QUESTIONS,
  STRESS_QUESTIONS, CHARACTER_QUESTIONS, CHARACTER_TYPES,
  SEARCH_HOT_TAGS, SEARCH_TAG_COLORS,
}
