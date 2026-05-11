// 云函数 - 搜索内容
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  const { keyword, page = 1, pageSize = 20, type, category } = event
  
  // 构建查询条件
  let query = {}
  
  if (keyword) {
    // 关键词搜索 - 标题或标签匹配
    query = _.or([
      { title: db.RegExp({ regexp: keyword, options: 'i' }) },
      { tags: db.RegExp({ regexp: keyword, options: 'i' }) },
      { summary: db.RegExp({ regexp: keyword, options: 'i' }) }
    ])
  }
  
  if (type) {
    query.type = type
  }
  
  if (category) {
    query.category = category
  }
  
  try {
    // 统计总数
    const countResult = await db.collection('contents').where(query).count()
    const total = countResult.total
    
    // 分页查询
    const skip = (page - 1) * pageSize
    const listResult = await db.collection('contents')
      .where(query)
      .orderBy('view_count', 'desc')
      .skip(skip)
      .limit(pageSize)
      .get()
    
    // 格式化结果
    const list = listResult.data.map(item => ({
      id: item._id,
      type: item.type || '未知',
      title: item.title,
      tags: item.tags || [],
      summary: item.summary || '',
      typeColor: getTypeColor(item.type)
    }))
    
    return {
      list,
      total,
      page,
      pageSize,
      hasMore: skip + list.length < total
    }
  } catch (err) {
    console.error('搜索失败:', err)
    return {
      list: [],
      total: 0,
      error: err.message
    }
  }
}

// 获取类型颜色
function getTypeColor(type) {
  const colors = {
    'PDF': '#E6A23C',
    '笔记': '#67C23A',
    '微信文章': '#409EFF',
    'PPT': '#F56C6C',
    'Word': '#909399',
    'Markdown': '#303133'
  }
  return colors[type] || '#909399'
}
