/**
 * 云函数入口文件
 * 情商宝典 - 微信云开发后端
 */

// 云函数入口
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

const db = cloud.database()

// 知识库搜索
exports.main = async (event, context) => {
  const { action, data } = event

  switch (action) {
    case 'search':
      return await searchKnowledge(data)
    case 'getDailyRecommend':
      return await getDailyRecommend(data)
    case 'recordProgress':
      return await recordProgress(data)
    case 'generateLearningPath':
      return await generateLearningPath(data)
    case 'analyzeEmotion':
      return await analyzeEmotion(data)
    case 'getStatistics':
      return await getStatistics(data)
    default:
      return { success: false, error: '未知操作' }
  }
}

// 知识库搜索
async function searchKnowledge(data) {
  const { keyword, type, page = 1, pageSize = 20 } = data
  try {
    let query = db.collection('knowledge_base')
    
    if (keyword) {
      query = query.where(db.command.or([
        { title: db.RegExp({ regexp: keyword, options: 'i' }) },
        { tags: db.RegExp({ regexp: keyword, options: 'i' }) },
        { desc: db.RegExp({ regexp: keyword, options: 'i' }) }
      ]))
    }
    
    if (type) {
      query = query.where({ type })
    }

    const result = await query
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .get()

    return { success: true, data: result.data, total: result.total }
  } catch (err) {
    return { success: false, error: err.message }
  }
}

// 每日推荐
async function getDailyRecommend(data) {
  const { count = 5 } = data
  try {
    // 获取总数
    const countResult = await db.collection('knowledge_base').count()
    const total = countResult.total
    
    if (total === 0) {
      return { success: true, data: [] }
    }

    // 随机获取
    const items = []
    const usedIndexes = new Set()
    
    for (let i = 0; i < count && i < total; i++) {
      let skip
      do {
        skip = Math.floor(Math.random() * total)
      } while (usedIndexes.has(skip))
      usedIndexes.add(skip)

      const result = await db.collection('knowledge_base').skip(skip).limit(1).get()
      if (result.data.length > 0) {
        items.push(result.data[0])
      }
    }

    return { success: true, data: items }
  } catch (err) {
    return { success: false, error: err.message }
  }
}

// 记录学习进度
async function recordProgress(data) {
  const { openid, itemId, action } = data
  try {
    const progressCol = db.collection('user_progress')
    
    // 查找用户进度记录
    const existing = await progressCol.where({ _openid: openid }).get()
    
    if (existing.data.length === 0) {
      // 新建记录
      await progressCol.add({
        data: {
          _openid: openid,
          learnedItems: [itemId],
          favoriteItems: [],
          learningPaths: [],
          createdAt: new Date(),
          updatedAt: new Date()
        }
      })
    } else {
      // 更新记录
      const record = existing.data[0]
      const learnedItems = record.learnedItems || []
      
      if (action === 'learn' && !learnedItems.includes(itemId)) {
        learnedItems.push(itemId)
      } else if (action === 'unlearn') {
        const idx = learnedItems.indexOf(itemId)
        if (idx > -1) learnedItems.splice(idx, 1)
      }

      await progressCol.doc(record._id).update({
        data: {
          learnedItems,
          updatedAt: new Date()
        }
      })
    }

    return { success: true }
  } catch (err) {
    return { success: false, error: err.message }
  }
}

// 生成学习路径
async function generateLearningPath(data) {
  const { goal, duration, hoursPerWeek = 3 } = data
  
  // 基于目标定义学习路径
  const pathTemplates = {
    '提升情商': {
      steps: [
        { title: '自我认知', desc: '了解自己的情绪模式和行为倾向', duration: '2周', resources: ['自我认知工具', '性格测试'] },
        { title: '情绪识别', desc: '学会识别和命名不同的情绪', duration: '2周', resources: ['情绪识别工具', '情绪日记'] },
        { title: '情绪调节', desc: '掌握情绪调节的核心策略', duration: '3周', resources: ['情绪调节工具', '情绪管理案例库'] },
        { title: '人际沟通', desc: '提升沟通中的情商表现', duration: '3周', resources: ['职场沟通工具', '沟通案例库'] },
        { title: '持续实践', desc: '将情商应用到日常生活', duration: '长期', resources: ['综合练习'] },
      ]
    },
    '职场晋升': {
      steps: [
        { title: '职场认知', desc: '了解职场情商的重要性', duration: '1周', resources: ['职场情商文章'] },
        { title: '沟通技能', desc: '提升职场沟通能力', duration: '3周', resources: ['职场沟通工具', '沟通案例库'] },
        { title: '领导力基础', desc: '培养领导力情商', duration: '4周', resources: ['领导力发展工具'] },
        { title: '团队协作', desc: '提升团队情商管理', duration: '3周', resources: ['团队协作工具'] },
        { title: '职业规划', desc: '制定职业发展计划', duration: '2周', resources: ['职业规划工具'] },
      ]
    },
    '人际关系': {
      steps: [
        { title: '关系认知', desc: '了解人际关系的本质', duration: '2周', resources: ['社会心理学知识'] },
        { title: '沟通技巧', desc: '掌握有效沟通方法', duration: '3周', resources: ['沟通工具', '沟通案例'] },
        { title: '冲突处理', desc: '学会处理人际冲突', duration: '2周', resources: ['冲突处理案例'] },
        { title: '关系维护', desc: '建立和维护良好关系', duration: '3周', resources: ['关系维护工具'] },
      ]
    },
    '自我成长': {
      steps: [
        { title: '自我探索', desc: '深入了解自己', duration: '3周', resources: ['自我认知工具'] },
        { title: '性格发展', desc: '认识并发展性格优势', duration: '4周', resources: ['性格发展工具'] },
        { title: '心理韧性', desc: '增强心理韧性', duration: '3周', resources: ['心理韧性工具'] },
        { title: '目标设定', desc: '明确人生方向', duration: '2周', resources: ['目标设定工具'] },
      ]
    }
  }

  const template = pathTemplates[goal] || pathTemplates['提升情商']
  
  return {
    success: true,
    data: {
      goal,
      duration,
      hoursPerWeek,
      totalHours: durationHours(duration, hoursPerWeek),
      steps: template.steps
    }
  }
}

// 计算总学习时长
function durationHours(duration, hoursPerWeek) {
  const weekMap = { '1周': 1, '2周': 2, '1个月': 4, '3个月': 12, '半年': 26, '1年': 52 }
  const weeks = weekMap[duration] || 4
  return weeks * hoursPerWeek
}

// 情绪分析（简化版，完整版可接入AI）
async function analyzeEmotion(data) {
  const { text } = data
  
  const emotionPatterns = {
    '焦虑': { patterns: ['焦虑', '担心', '紧张', '不安', '害怕', '惶恐'], suggestion: '深呼吸、列出担忧清单、寻求支持' },
    '愤怒': { patterns: ['生气', '愤怒', '恼火', '气愤', '火大'], suggestion: '离开现场、深呼吸、用"我感到..."表达' },
    '悲伤': { patterns: ['悲伤', '难过', '伤心', '沮丧', '失落'], suggestion: '允许感受悲伤、倾诉、做一些小确幸的事' },
    '开心': { patterns: ['开心', '高兴', '快乐', '愉悦', '兴奋'], suggestion: '记录开心的原因，与让你开心的人相处' },
    '平静': { patterns: ['平静', '淡定', '从容', '安宁'], suggestion: '保持这种状态，享受当下' },
  }

  let detected = '未识别'
  let suggestion = '关注自己的情绪变化，给它命名并接受它'
  
  for (const [emotion, info] of Object.entries(emotionPatterns)) {
    if (info.patterns.some(p => text.includes(p))) {
      detected = emotion
      suggestion = info.suggestion
      break
    }
  }

  return {
    success: true,
    data: {
      detectedEmotion: detected,
      suggestion,
      tip: '情绪是信使，了解它想告诉你什么'
    }
  }
}

// 获取统计数据
async function getStatistics(data) {
  const { openid } = data
  try {
    const countResult = await db.collection('knowledge_base').count()
    const progressResult = await db.collection('user_progress').where({ _openid: openid }).get()
    
    var learnedItems = 0;
    var favoriteItems = 0;
    if (progressResult.data.length > 0) {
      learnedItems = (progressResult.data[0].learnedItems || []).length;
      favoriteItems = (progressResult.data[0].favoriteItems || []).length;
    }
    
    return {
      success: true,
      data: {
        totalItems: countResult.total,
        learnedItems: learnedItems,
        favoriteItems: favoriteItems
      }
    }
  } catch (err) {
    return { success: false, error: err.message }
  }
}
