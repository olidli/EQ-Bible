// utils/constants.js - 公共常量（新增情绪急救箱相关常量）
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
  self_aware:    ['自我发展', '自我实现', '自我认知', '自我', '自我了解', 'MBTI', '性格分析', 'DISC', '自我效能', '成就动机', '班杜拉', '内向性格', '自我接纳', '能量管理', '性格优势', '自我分化', '独立人格', '鲍恩理论'],
  emotion:       ['情商', '情绪调节', '情绪命名', '情绪管理', '情绪觉察', '情绪健康', '心理调适', '焦虑管理', '压力调节', '专注力', '正念', '减压', '冥想', '职业倦怠', '情绪劳动', '情绪边界', '边界设定', '自我保护', '拒绝技巧', '情绪词汇', '萨提亚', '情感表达'],
  communication: ['人际沟通', '社交技巧', '表达技巧', '沟通技能', '沟通技巧', '非暴力沟通', '共情表达', '马歇尔·卢森堡', '倾听技巧', '人际理解', '沟通能力', '共情倾听', '反馈技巧', '赞美方法', '沟通艺术', '建设性批评', '分歧化解', '对话能力', '谈判技巧', '冲突管理', '说话技巧', '表达方式', '蔡康永', '非语言沟通', '肢体语言', '梅拉宾法则'],
  relation:      ['社交能力', '社交', '亲密关系', '人际关系', '依恋理论', '关系模式', '安全型依恋', '人际影响力', '戈尔曼', '社交商', '责任划分', '课题分离', '阿德勒心理学', '人际边界', '健康关系', '叙事能力', '影响力', '故事思维', '处世智慧', '情商实践', '社交策略'],
  workplace:     ['职场发展', '职业成长', '领导情商', '职场情商', '情商领导', '领导力', '管理能力', '团队激励', '向上管理', '领导关系', '职业发展', '职场沟通', '恢复力', '心理弹性', '抗逆力', '职场挫折', '组织行为', '情商团队', '团队协作', '团队建设', '职场话术', '危机沟通', '情绪劳动', '职业倦怠', '心理能量', '边界'],
  psychology:    ['心理学', '心理学常识', '决策陷阱', '思维误区', '认知偏差', '理性决策', '共情', '同理心', '情感连接', '心流', '最优体验', '工作状态', '福格模型', '行为设计', '习惯养成', '习惯改变', '神经症', '内心冲突', '霍妮', '自我理想', '心理防御', '多巴胺', '成瘾', '欲望驱动', '享乐适应', '神经科学', '积极心理学', 'PERMA', '幸福感', '心理幸福', '塞利格曼', '无意识', '弗洛伊德', '潜意识', '精神分析', '人性', '社会影响', '心理规律', '人际策略', 'TA沟通分析', '心理游戏', '伯恩', '沟通陷阱', '心理地位', '人生态度', '自我价值感', '网络心理学', '注意力经济', '数字素养'],
  growth:        ['个人成长', '情商发展', '阶段培养', '情绪教育', '成长路径', '行为设计', '福格模型', '习惯', '动机', '微习惯'],
  parenting:     ['儿童情商', '家庭教育', '情绪启蒙', '亲子关系'],
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

// ========== 情绪急救箱 - 核心情绪列表 ==========
const FIRST_AID_EMOTIONS = [
  { label: '焦虑', emoji: '😰', value: 'anxiety', color: '#ff9f43' },
  { label: '愤怒', emoji: '😠', value: 'anger', color: '#ee5a24' },
  { label: '悲伤', emoji: '😢', value: 'sadness', color: '#54a0ff' },
  { label: '恐惧', emoji: '😨', value: 'fear', color: '#9c88ff' },
  { label: '羞愧', emoji: '😳', value: 'shame', color: '#ff6b6b' },
  { label: '内疚', emoji: '😔', value: 'guilt', color: '#786fa6' },
]

// ========== 情绪急救箱 - 情绪引导语映射 ==========
const FIRST_AID_GUIDANCE = {
  anxiety: {
    title: '🌊 焦虑来袭时，先让身体安静下来',
    description: '试试先用呼吸把紧绷的身体松开，然后我们一起做接地练习',
    recommended: ['breathing', 'grounding'],
    tips: '焦虑常常让我们感到未来失控，通过呼吸和接地，可以把你带回当下'
  },
  anger: {
    title: '💢 愤怒是一种能量，让它流动起来',
    description: '先让身体冷静下来，然后把注意力转向内在感受',
    recommended: ['grounding', 'bodyScan'],
    tips: '愤怒背后往往藏着未被满足的需求'
  },
  sadness: {
    title: '🌧️ 悲伤是可以的，允许自己感受',
    description: '让自己慢慢平静下来，然后试着换个角度看看',
    recommended: ['breathing', 'selfCompassion'],
    tips: '悲伤是疗愈的信号，不要压抑它'
  },
  fear: {
    title: '⚡ 恐惧是大脑在保护你',
    description: '先做几个深呼吸，让身体放松，恐惧就没那么可怕了',
    recommended: ['breathing', 'grounding'],
    tips: '面对恐惧，最好的方式是靠近它而不是逃避'
  },
  shame: {
    title: '💜 羞愧是成长的信号',
    description: '试着理解自己的感受，然后用更温柔的方式对待自己',
    recommended: ['selfCompassion', 'cognitive'],
    tips: '羞愧是人性的一部分，每个人都会经历'
  },
  guilt: {
    title: '🔄 内疚告诉你什么对你重要',
    description: '承认自己的感受，然后想想如何弥补或成长',
    recommended: ['selfCompassion', 'cognitive'],
    tips: '从内疚中学习，而不是被它困住'
  }
}

// ========== 情绪急救箱 - 工具元数据 ==========
const FIRST_AID_TOOLS = {
  breathing: {
    id: 'breathing',
    name: '4-7-8 呼吸法',
    emoji: '🫁',
    desc: '通过特定的呼吸节奏快速平复情绪',
    duration: '1分钟',
    color: '#667eea',
    steps: [
      { phase: 'inhale', duration: 4, instruction: '用鼻子缓慢吸气' },
      { phase: 'hold', duration: 7, instruction: '屏住呼吸' },
      { phase: 'exhale', duration: 8, instruction: '用嘴巴缓慢呼气' },
    ]
  },
  grounding: {
    id: 'grounding',
    name: '5-4-3-2-1 接地术',
    emoji: '🎯',
    desc: '通过感官聚焦带你回到当下',
    duration: '2-3分钟',
    color: '#f093fb',
    steps: [
      { number: 5, sense: '看到', prompt: '说出你能看到的5样东西', placeholder: '例如：桌子、树木、杯子...' },
      { number: 4, sense: '触摸', prompt: '说出你能触摸到的4样东西', placeholder: '例如：衣服的质感、桌面的温度...' },
      { number: 3, sense: '听到', prompt: '说出你能听到的3样声音', placeholder: '例如：鸟叫声、车流声、空调声...' },
      { number: 2, sense: '闻到', prompt: '说出你能闻到的2样气味', placeholder: '例如：咖啡香、花香...' },
      { number: 1, sense: '尝到', prompt: '说出你能尝到的1样味道', placeholder: '例如：薄荷糖的清凉...' },
    ]
  },
  cognitive: {
    id: 'cognitive',
    name: '认知重评',
    emoji: '💭',
    desc: '换个角度看问题，调节负面情绪',
    duration: '2-3分钟',
    color: '#4ecdc4',
    questions: [
      { key: 'negative', question: '你现在在想什么？', placeholder: '描述你当前的负面想法...' },
      { key: 'evidence', question: '支持这个想法的证据是什么？', placeholder: '写下支持这个想法的事实...' },
      { key: 'alternative', question: '有其他可能的解释吗？', placeholder: '还有哪些可能的解释？' },
      { key: 'balanced', question: '现在，更平衡的想法是什么？', placeholder: '综合以上，你的感受是什么？' },
    ]
  },
  bodyScan: {
    id: 'bodyScan',
    name: '身体扫描',
    emoji: '🔍',
    desc: '渐进式肌肉放松，从头到脚释放紧张',
    duration: '3-5分钟',
    color: '#a29bfe',
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
    ]
  },
  mindfulness: {
    id: 'mindfulness',
    name: '正念冥想',
    emoji: '🧘',
    desc: '专注呼吸，回到当下',
    duration: '2-3分钟',
    color: '#74b9ff',
    steps: [
      { instruction: '找一个舒适的姿势，背部挺直但放松', duration: 10 },
      { instruction: '轻轻闭上眼睛（或垂视前方）', duration: 5 },
      { instruction: '将注意力放在呼吸上', duration: 5 },
      { instruction: '吸气...（感受空气进入身体）', duration: 15 },
      { instruction: '呼气...（让所有紧张离开）', duration: 15 },
      { instruction: '继续呼吸，吸气...呼气...', duration: 60 },
      { instruction: '如果走神了，温柔地把注意力带回呼吸', duration: 30 },
      { instruction: '现在，慢慢睁开眼睛', duration: 5 },
    ]
  },
  selfCompassion: {
    id: 'selfCompassion',
    name: '自我慈悲',
    emoji: '💗',
    desc: '用温柔的方式对待自己',
    duration: '2-3分钟',
    color: '#fd79a8',
    prompts: [
      { key: 'feel', prompt: '你现在正在经历什么？', placeholder: '描述你的感受...' },
      { key: 'common', prompt: '很多人都会经历类似的感受', placeholder: '这很正常...' },
      { key: 'kind', prompt: '对自己说一句话', placeholder: '我希望自己知道...' },
    ]
  },
  sensory: {
    id: 'sensory',
    name: '感官安抚',
    emoji: '🌸',
    desc: '用感官刺激快速平复情绪',
    duration: '1-2分钟',
    color: '#55efc4',
    methods: [
      { type: '温度', instruction: '用冷水洗脸或握一个冰块', effect: '快速激活副交感神经' },
      { type: '触感', instruction: '握住一个毛绒玩具或柔软的物品', effect: '提供安全感' },
      { type: '视觉', instruction: '看一张让你感到平静的图片', effect: '转移注意力' },
      { type: '味觉', instruction: '慢慢品尝一颗糖果或喝一口温水', effect: '用味觉锚定当下' },
    ]
  }
}

// ========== 情绪急救箱 - 分享配置 ==========
const FIRST_AID_SHARE = {
  title: '情绪急救箱 | EQ情商宝典',
  desc: '快速缓解负面情绪，4-7-8呼吸法、接地术、认知重评',
  path: '/pages/emotion-first-aid/emotion-first-aid',
  timelineTitle: '快速缓解负面情绪，试试这个情绪急救箱！'
}

module.exports = {
  TYPE_LABELS, TYPE_COLORS, getTypeInfo,
  MODULE_NAMES, MODULE_TAGS, MODULE_META, MODULE_TOOLS,
  TOOL_META,
  EMOTION_OPTIONS, GOAL_OPTIONS, DURATION_OPTIONS,
  REGULATION_STRATEGIES, REFLECTION_QUESTIONS,
  STRESS_QUESTIONS, CHARACTER_QUESTIONS, CHARACTER_TYPES,
  SEARCH_HOT_TAGS, SEARCH_TAG_COLORS,
  // 新增：情绪急救箱常量
  FIRST_AID_EMOTIONS,
  FIRST_AID_TOOLS,
  FIRST_AID_GUIDANCE,
  FIRST_AID_SHARE,
}
