# -*- coding: utf-8 -*-
"""
知识库内容重组脚本
将 PDF/Word 文件引用转换为结构化阅读内容
"""
import json
import re

# 读取原始数据
with open(r'C:\Users\Administrator\Desktop\情商宝典项目\miniprogram\data\knowledge.js', 'r', encoding='utf-8') as f:
    content = f.read()

start = content.find('[')
json_str = content[start:content.rfind(']')+1]
data = json.loads(json_str)

print(f'原始数据: {len(data)} 条')

# 分析内容类型
pdf_items = []
word_items = []
note_items = []
other_items = []

for item in data:
    tp = item.get('tp', '')
    title = item.get('t', '')
    if 'PDF' in tp:
        pdf_items.append(item)
    elif 'Word' in tp:
        word_items.append(item)
    elif '笔记' in tp or tp == '笔记':
        note_items.append(item)
    else:
        other_items.append(item)

print(f'PDF书籍: {len(pdf_items)}')
print(f'Word文档: {len(word_items)}')
print(f'笔记: {len(note_items)}')
print(f'其他: {len(other_items)}')

# 提取主题分类
from collections import Counter
all_tags = []
for item in data:
    all_tags.extend(item.get('tg', []))
tag_counts = Counter(all_tags)

print('\n=== 主要主题分类 ===')
main_topics = []
for tag, count in tag_counts.most_common(20):
    if count >= 5 and tag not in ['学习资源', '知识库内容', '文档文件', '文本文件', 'Word文档', '笔记文件']:
        main_topics.append(tag)
        print(f'  {tag}: {count}')

# 创建新的结构化内容
# 将整本PDF拆分为章节/主题文章
structured_content = []

# 1. 从PDF标题中提取主题并创建文章
pdf_topics = {
    '情绪管理': [],
    '自我认知': [],
    '性格发展': [],
    '心理韧性': [],
    '职场发展': [],
    '人际关系': [],
    '领导力': [],
    '沟通技巧': []
}

for item in pdf_items:
    title = item.get('t', '')
    tags = item.get('tg', [])
    
    # 根据标签分类
    category = '其他'
    for tag in tags:
        if '情绪' in tag:
            category = '情绪管理'
            break
        elif '自我' in tag or '认知' in tag:
            category = '自我认知'
            break
        elif '性格' in tag:
            category = '性格发展'
            break
        elif '韧性' in tag or '压力' in tag:
            category = '心理韧性'
            break
        elif '职场' in tag or '职业' in tag:
            category = '职场发展'
            break
        elif '人际' in tag or '社交' in tag:
            category = '人际关系'
            break
        elif '领导' in tag:
            category = '领导力'
            break
        elif '沟通' in tag:
            category = '沟通技巧'
            break
    
    if category in pdf_topics:
        pdf_topics[category].append({
            'id': item['id'],
            'title': title,
            'original_type': 'PDF',
            'category': category
        })

print('\n=== PDF内容分类 ===')
for cat, items in pdf_topics.items():
    if items:
        print(f'{cat}: {len(items)} 本')

# 2. 将Word文档转换为文章条目
word_articles = []
for item in word_items[:50]:  # 先处理前50个
    title = item.get('t', '')
    # 清理标题
    clean_title = re.sub(r'^\d+\.\s*\[Word\]\s*\(NEW\)?\d*', '', title)
    clean_title = re.sub(r'\.docx?$', '', clean_title)
    clean_title = clean_title.strip()
    
    if clean_title and len(clean_title) > 3:
        word_articles.append({
            'id': item['id'],
            'title': clean_title,
            'original_type': 'Word',
            'tags': item.get('tg', [])
        })

print(f'\n可转换的Word文章: {len(word_articles)}')

# 3. 生成新的结构化数据格式
new_structure = {
    'metadata': {
        'total_original': len(data),
        'pdf_count': len(pdf_items),
        'word_count': len(word_items),
        'note_count': len(note_items),
        'categories': list(pdf_topics.keys())
    },
    'categories': {},
    'articles': []
}

# 为每个分类创建摘要文章
article_id = 1
for category, items in pdf_topics.items():
    if items:
        new_structure['categories'][category] = {
            'name': category,
            'book_count': len(items),
            'description': f'精选{len(items)}本{category}相关书籍的核心内容',
            'books': [{'id': b['id'], 'title': b['title']} for b in items[:5]]
        }
        
        # 为每本书创建一个导读文章
        for book in items[:3]:  # 每类取前3本
            article = {
                'id': str(article_id),
                'title': f"《{book['title'][:30]}》精华导读",
                'category': category,
                'type': 'book_summary',
                'original_id': book['id'],
                'content_type': 'structured',
                'estimated_read_time': '5-8分钟',
                'sections': [
                    {'title': '核心观点', 'content': '本书核心观点摘要...'},
                    {'title': '关键章节', 'content': '重点章节提炼...'},
                    {'title': '实践应用', 'content': '实际应用场景...'}
                ],
                'tags': [category, '书籍导读', '精华摘要']
            }
            new_structure['articles'].append(article)
            article_id += 1

# 添加Word文档转换的文章
for wa in word_articles[:30]:
    article = {
        'id': str(article_id),
        'title': wa['title'],
        'category': '综合',
        'type': 'article',
        'original_id': wa['id'],
        'content_type': 'structured',
        'estimated_read_time': '3-5分钟',
        'sections': [
            {'title': '内容概述', 'content': '文章主要内容...'},
            {'title': '要点提炼', 'content': '核心知识点...'},
            {'title': '行动建议', 'content': '实践指导...'}
        ],
        'tags': wa['tags'][:3] if wa['tags'] else ['情商', '自我提升']
    }
    new_structure['articles'].append(article)
    article_id += 1

print(f'\n生成结构化文章: {len(new_structure["articles"])} 篇')

# 保存分析结果
with open(r'C:\Users\Administrator\Desktop\情商宝典项目\miniprogram\scripts\content_analysis.json', 'w', encoding='utf-8') as f:
    json.dump(new_structure, f, ensure_ascii=False, indent=2)

print('\n✅ 分析完成，结果保存到 content_analysis.json')
print('\n建议的内容结构:')
print('- 按主题分类: 情绪管理、自我认知、性格发展、心理韧性、职场发展等')
print('- 每本PDF生成一篇精华导读（5-8分钟阅读）')
print('- Word文档转换为独立文章（3-5分钟阅读）')
print('- 统一格式: 核心观点 + 关键章节 + 实践应用')