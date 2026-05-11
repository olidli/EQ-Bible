# -*- coding: utf-8 -*-
"""
情商宝典数据导入 - 生成微信云数据库可导入的JSON文件
"""
import json
import os

# 源数据路径
SOURCE_FILE = r'C:\Users\Administrator\Desktop\情商宝典项目\情商宝典标签数据库_fixed.json'
OUTPUT_FILE = r'C:\Users\Administrator\Desktop\情商宝典项目\miniprogram\export\knowledge_base.json'

# 分类映射
def get_category(tags):
    tag_str = ''.join(tags)
    if any(k in tag_str for k in ['情绪', '情商']):
        return 'emotion'
    if any(k in tag_str for k in ['自我', '认知']):
        return 'self'
    if any(k in tag_str for k in ['性格', '人格']):
        return 'character'
    if any(k in tag_str for k in ['韧性', '抗压', '压力', '挫折']):
        return 'resilience'
    if any(k in tag_str for k in ['职场', '领导', '沟通', '协作', '职业']):
        return 'workplace'
    if any(k in tag_str for k in ['咨询', '治疗', '诊断', '评估']):
        return 'counseling'
    if any(k in tag_str for k in ['教学', '培训', '教育']):
        return 'teaching'
    return 'other'

# 模块名称映射
MODULE_NAMES = {
    'emotion': '情绪管理',
    'self': '自我认知',
    'character': '性格发展',
    'resilience': '心理韧性',
    'workplace': '职场发展',
    'counseling': '心理咨询',
    'teaching': '教学培训',
    'other': '其他资源',
}

def main():
    import sys
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
    
    print('🚀 情商宝典数据转换工具')
    print('=' * 40)
    
    # 读取源数据
    with open(SOURCE_FILE, 'r', encoding='utf-8') as f:
        raw_data = json.load(f)
    
    print(f'📊 源数据共 {len(raw_data)} 条')
    
    # 转换
    items = []
    for key, item in raw_data.items():
        # 跳过第一条（统计信息）
        if item.get('序号') == 1 and '总条目数' in item.get('标题', ''):
            continue
        
        tags = item.get('标签', [])
        category = get_category(tags)
        
        items.append({
            '_id': str(item.get('序号', '')),
            'serial': item.get('序号', 0),
            'type': item.get('类型', '资源'),
            'title': item.get('标题', ''),
            'tags': tags,
            'desc': item.get('描述', ''),
            'category': category,
            'moduleName': MODULE_NAMES.get(category, '其他资源'),
        })
    
    print(f'✅ 转换后共 {len(items)} 条（已跳过统计项）')
    
    # 分类统计
    cat_count = {}
    for item in items:
        cat = item['category']
        cat_count[cat] = cat_count.get(cat, 0) + 1
    
    print('\n📈 分类统计:')
    for cat, count in sorted(cat_count.items(), key=lambda x: -x[1]):
        print(f'  {MODULE_NAMES.get(cat, cat)}: {count}条')
    
    # 类型统计
    type_count = {}
    for item in items:
        t = item['type']
        type_count[t] = type_count.get(t, 0) + 1
    
    print('\n📈 类型统计:')
    for t, count in sorted(type_count.items(), key=lambda x: -x[1]):
        print(f'  {t}: {count}条')
    
    # 输出目录
    output_dir = os.path.dirname(OUTPUT_FILE)
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    
    # 写入JSON数组（微信云开发导入格式）
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(items, f, ensure_ascii=False, indent=2)
    
    file_size = os.path.getsize(OUTPUT_FILE)
    print(f'\n✅ 已生成导入文件: {OUTPUT_FILE}')
    print(f'📦 文件大小: {file_size / 1024:.1f} KB')
    
    # 也生成JSONL格式（备选）
    jsonl_path = OUTPUT_FILE.replace('.json', '.jsonl')
    with open(jsonl_path, 'w', encoding='utf-8') as f:
        for item in items:
            f.write(json.dumps(item, ensure_ascii=False) + '\n')
    
    print(f'✅ 已生成JSONL文件: {jsonl_path}')
    print('\n📋 导入说明:')
    print('1. 在云开发控制台 → 数据库 → 点击 knowledge_base 集合')
    print('2. 点击「导入」按钮')
    print('3. 选择 knowledge_base.json 文件')
    print('4. 格式选择「JSON数组」')
    print('5. 冲突处理选择「Insert」')
    print('6. 点击「导入」按钮')

if __name__ == '__main__':
    main()
