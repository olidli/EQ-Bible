// 云函数 - 获取随机推荐内容
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  try {
    // 获取总数
    const countResult = await db.collection('contents').count()
    const total = countResult.total
    
    // 随机选择一个
    const randomSkip = Math.floor(Math.random() * total)
    
    const result = await db.collection('contents')
      .skip(randomSkip)
      .limit(1)
      .get()
    
    if (result.data.length > 0) {
      const item = result.data[0]
      return {
        id: item._id,
        type: item.type || '未知',
        title: item.title,
        tags: (item.tags || []).slice(0, 3),
        summary: item.summary || '点击查看详情'
      }
    }
    
    // 如果没有数据，返回默认推荐
    return {
      id: 'default',
      type: '推荐',
      title: '情商：为什么情商比智商更重要',
      tags: ['情商理论', '心理学'],
      summary: '丹尼尔·戈尔曼经典著作，揭开情商的奥秘'
    }
  } catch (err) {
    console.error('获取推荐失败:', err)
    // 返回默认推荐
    return {
      id: 'default',
      type: '推荐',
      title: '开始你的情商学习之旅',
      tags: ['推荐'],
      summary: '探索知识库，发现更多精彩内容'
    }
  }
}
