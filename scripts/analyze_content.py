# -*- coding: utf-8 -*-
import json

with open(r'C:\Users\Administrator\Desktop\情商宝典项目\miniprogram\data\knowledge.js', 'r', encoding='utf-8') as f:
    content = f.read()

start = content.find('[')
json_str = content[start:content.rfind(']')+1]
data = json.loads(json_str)

# Analyze content
print('=== 知识库内容分析 ===')
print(f'总条目: {len(data)}\n')

# Group by type
pdf_items = [d for d in data if 'PDF' in d.get('tp', '')]
word_items = [d for d in data if 'Word' in d.get('tp', '')]
note_items = [d for d in data if '笔记' in d.get('tp', '') or d.get('tp') == '笔记']
wechat_items = [d for d in data if '微信' in d.get('tp', '')]

print(f'PDF书籍: {len(pdf_items)}')
print(f'Word文档: {len(word_items)}')
print(f'笔记: {len(note_items)}')
print(f'微信公众号: {len(wechat_items)}')

# Show first few PDFs
print('\n=== PDF 书籍示例 (需要转换) ===')
for item in pdf_items[:8]:
    print(f'  [{item["id"]}] {item["t"][:60]}...')
    print(f'      标签: {item.get("tg", [])}')

# Show Word content
print('\n=== Word 文档示例 ===')
for item in word_items[:5]:
    print(f'  [{item["id"]}] {item["t"][:60]}')
    print(f'      标签: {item.get("tg", [])}')

# Analyze tags to understand topics
print('\n=== 热门标签 ===')
from collections import Counter
all_tags = []
for item in data:
    all_tags.extend(item.get('tg', []))
tag_counts = Counter(all_tags)
for tag, count in tag_counts.most_common(15):
    print(f'  {tag}: {count}')