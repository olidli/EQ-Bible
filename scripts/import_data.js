/**
 * 数据导入脚本
 * 将情商宝典356项知识库内容导入微信云数据库
 * 
 * 使用方法：
 * 1. 登录微信公众平台 -> 开发 -> 云开发
 * 2. 打开云开发控制台 -> 数据库
 * 3. 创建集合：knowledge_base, user_progress
 * 4. 在云开发控制台的「更多」-> 「导入」中选择此脚本生成的JSON文件
 *    或者在本地用Node.js运行：node import_data.js
 */

const fs = require('fs');
const path = require('path');

// 读取标签数据库
function loadTagDatabase() {
  const filePath = path.join(__dirname, '..', '情商宝典标签数据库_fixed.json');
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (err) {
    console.error('读取标签数据库失败:', err.message);
    return null;
  }
}

// 转换数据格式
function transformData(tagDb) {
  if (!tagDb) return [];
  
  const items = [];
  
  for (const [key, item] of Object.entries(tagDb)) {
    items.push({
      _id: item.序号 ? String(item.序号) : key,
      serial: item.序号 || '',
      type: item.类型 || '资源',
      title: item.标题 || '',
      tags: item.标签 || [],
      desc: item.描述 || '',
      category: getCategory(item.标签 || []),
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }
  
  return items;
}

// 根据标签判断分类
function getCategory(tags) {
  const tagStr = tags.join('').toLowerCase();
  
  if (tagStr.includes('情绪')) return 'emotion';
  if (tagStr.includes('自我')) return 'self';
  if (tagStr.includes('性格')) return 'character';
  if (tagStr.includes('韧性') || tagStr.includes('抗压')) return 'resilience';
  if (tagStr.includes('职场') || tagStr.includes('领导') || tagStr.includes('沟通')) return 'workplace';
  if (tagStr.includes('咨询') || tagStr.includes('治疗') || tagStr.includes('诊断')) return 'counseling';
  if (tagStr.includes('教学') || tagStr.includes('培训')) return 'teaching';
  
  return 'other';
}

// 生成JSON Lines格式（适合微信云开发导入）
function generateJSONL(data) {
  return data.map(item => JSON.stringify(item)).join('\n');
}

// 生成完整JSON数组（适合微信云开发导入）
function generateJSON(data) {
  return JSON.stringify(data, null, 2);
}

// 主函数
function main() {
  console.log('🚀 情商宝典数据导入脚本');
  console.log('='.repeat(40));
  
  const tagDb = loadTagDatabase();
  if (!tagDb) {
    console.error('❌ 数据加载失败，退出');
    process.exit(1);
  }
  
  const items = transformData(tagDb);
  console.log(`📊 共转换 ${items.length} 条数据`);
  
  // 统计分类
  const categoryCount = {};
  items.forEach(item => {
    categoryCount[item.category] = (categoryCount[item.category] || 0) + 1;
  });
  console.log('\n📈 分类统计:');
  Object.entries(categoryCount).forEach(([cat, count]) => {
    console.log(`  ${cat}: ${count}条`);
  });
  
  // 统计类型
  const typeCount = {};
  items.forEach(item => {
    typeCount[item.type] = (typeCount[item.type] || 0) + 1;
  });
  console.log('\n📈 类型统计:');
  Object.entries(typeCount).forEach(([type, count]) => {
    console.log(`  ${type}: ${count}条`);
  });
  
  // 生成导出文件
  const outputDir = path.join(__dirname, '..', 'export');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  const jsonPath = path.join(outputDir, 'knowledge_base.json');
  fs.writeFileSync(jsonPath, generateJSON(items));
  console.log(`\n✅ 已导出JSON: ${jsonPath}`);
  
  const jsonlPath = path.join(outputDir, 'knowledge_base.jsonl');
  fs.writeFileSync(jsonlPath, generateJSONL(items));
  console.log(`✅ 已导出JSONL: ${jsonlPath}`);
  
  console.log('\n📋 导入说明:');
  console.log('1. 登录微信公众平台 -> 开发 -> 云开发');
  console.log('2. 创建集合「knowledge_base」（权限设置为「所有用户可读」）');
  console.log('3. 在集合页面点击「导入」，选择 knowledge_base.json');
  console.log('4. 导入格式选择「JSON数组」');
  console.log('5. 字段类型选择「自动」');
  
  console.log('\n✅ 数据准备完成！');
}

// 运行
main();
