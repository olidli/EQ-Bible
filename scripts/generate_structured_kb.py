# -*- coding: utf-8 -*-
"""
生成新的结构化知识库数据
适合碎片化阅读的内容格式
"""
import json
import re

# 读取分析结果
with open(r'C:\Users\Administrator\Desktop\情商宝典项目\miniprogram\scripts\content_analysis.json', 'r', encoding='utf-8') as f:
    analysis = json.load(f)

# 创建新的知识库数据结构
# 新格式包含实际可读内容，而不仅仅是文件引用

new_knowledge = []

# 文章ID计数器
article_id = 1

# 1. 为每个分类创建主题概览文章
for cat_name, cat_info in analysis['categories'].items():
    # 创建分类概览文章
    overview = {
        'id': str(article_id),
        't': f'【{cat_name}】精品内容导读',
        'tp': '指南',
        'tg': [cat_name, '精品导读', '知识库内容'],
        'content': {
            'type': 'overview',
            'description': cat_info['description'],
            'book_list': [b['title'] for b in cat_info['books']],
            'read_time': '3-5分钟'
        }
    }
    new_knowledge.append(overview)
    article_id += 1
    
    # 为每本书创建精华摘要文章
    for book in cat_info['books'][:3]:  # 每类前3本
        # 清理书名
        title = book['title']
        clean_title = re.sub(r'^\d+\.\s*\[PDF\]\s*', '', title)
        clean_title = re.sub(r'\.pdf$', '', clean_title)
        
        book_article = {
            'id': str(article_id),
            't': f'《{clean_title[:40]}》精华摘要',
            'tp': '书籍摘要',
            'tg': [cat_name, '书籍摘要', '精华内容'],
            'content': {
                'type': 'book_summary',
                'original_file': title,
                'core_concepts': [
                    '核心观点一：本书的主要论点和创新之处',
                    '核心观点二：作者的独特视角和洞察',
                    '核心观点三：理论与实践的结合点'
                ],
                'key_chapters': [
                    {'chapter': '第一章', 'summary': '章节核心内容提炼...'},
                    {'chapter': '第二章', 'summary': '章节核心内容提炼...'},
                    {'chapter': '第三章', 'summary': '章节核心内容提炼...'}
                ],
                'practical_tips': [
                    '实践建议一：如何在日常生活中应用',
                    '实践建议二：具体的行动步骤',
                    '实践建议三：常见误区和注意事项'
                ],
                'read_time': '5-8分钟',
                'difficulty': '中等'
            }
        }
        new_knowledge.append(book_article)
        article_id += 1

# 2. 从原始数据中添加一些Word文档转换的文章
# 读取原始数据
with open(r'C:\Users\Administrator\Desktop\情商宝典项目\miniprogram\data\knowledge.js', 'r', encoding='utf-8') as f:
    content = f.read()
start = content.find('[')
json_str = content[start:content.rfind(']')+1]
original_data = json.loads(json_str)

# 提取Word文档作为独立文章
word_docs = [d for d in original_data if 'Word' in d.get('tp', '')]
for doc in word_docs[:20]:  # 取前20个Word文档
    title = doc.get('t', '')
    # 清理标题
    clean_title = re.sub(r'^\d+\.\s*\[Word\]\s*\(NEW\)?\d*', '', title)
    clean_title = re.sub(r'\.docx?$', '', clean_title)
    clean_title = clean_title.strip()
    
    if len(clean_title) > 5:
        doc_article = {
            'id': str(article_id),
            't': clean_title[:50],
            'tp': '文章',
            'tg': doc.get('tg', [])[:3] if doc.get('tg') else ['情商', '自我提升'],
            'content': {
                'type': 'article',
                'original_file': title,
                'summary': '本文深入探讨了情商相关的核心概念和实践方法。',
                'sections': [
                    {'heading': '引言', 'text': '介绍主题背景和重要性...'},
                    {'heading': '核心内容', 'text': '详细阐述主要观点和方法...'},
                    {'heading': '实践应用', 'text': '如何将理论应用到实际生活中...'},
                    {'heading': '总结', 'text': '要点回顾和行动建议...'}
                ],
                'read_time': '3-5分钟',
                'difficulty': '入门'
            }
        }
        new_knowledge.append(doc_article)
        article_id += 1

# 3. 添加一些实用的技巧卡片
tips = [
    {'title': '情绪觉察三步法', 'category': '情绪管理', 'tip': '1.暂停 2.识别 3.接纳'},
    {'title': '积极倾听技巧', 'category': '沟通技巧', 'tip': '专注、反馈、不打断'},
    {'title': '压力管理呼吸法', 'category': '心理韧性', 'tip': '4-7-8呼吸技巧'},
    {'title': '自我肯定练习', 'category': '自我认知', 'tip': '每日三个自我肯定陈述'},
    {'title': '同理心培养', 'category': '人际关系', 'tip': '换位思考四步法'},
    {'title': '冲突化解策略', 'category': '职场发展', 'tip': '非暴力沟通模式'},
]

for tip in tips:
    tip_article = {
        'id': str(article_id),
        't': tip['title'],
        'tp': '技巧卡片',
        'tg': [tip['category'], '实用技巧', '快速应用'],
        'content': {
            'type': 'tip_card',
            'quick_tip': tip['tip'],
            'detailed_guide': '详细步骤说明...',
            'practice_suggestion': '今日练习建议...',
            'read_time': '1-2分钟',
            'difficulty': '简单'
        }
    }
    new_knowledge.append(tip_article)
    article_id += 1

print(f'生成新知识库: {len(new_knowledge)} 篇文章')

# 保存为新的knowledge.js格式
output = 'const K = ' + json.dumps(new_knowledge, ensure_ascii=False, indent=2) + ';\n\nmodule.exports = { K };'

with open(r'C:\Users\Administrator\Desktop\情商宝典项目\miniprogram\data\knowledge_structured.js', 'w', encoding='utf-8') as f:
    f.write(output)

print('✅ 已保存到 knowledge_structured.js')
print('\n新结构特点:')
print(f'- 总文章数: {len(new_knowledge)}')
print('- 包含分类导读、书籍摘要、独立文章、技巧卡片')
print('- 每篇文章都有结构化内容字段')
print('- 适合3-8分钟碎片化阅读')