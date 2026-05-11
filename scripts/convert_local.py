#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""Convert knowledge base to slim local data."""

import json
import os

SRC = os.path.join(os.path.dirname(__file__), '..', '..', '情商宝典标签数据库_fixed.json')
DST = os.path.join(os.path.dirname(__file__), '..', 'data', 'knowledge.js')

with open(SRC, 'r', encoding='utf-8') as f:
    data = json.load(f)

items = []
for key in sorted(data.keys(), key=lambda k: int(data[k].get('序号', 0))):
    val = data[key]
    title = val.get('标题', '')
    tags = val.get('标签', [])
    # Derive type from title keywords or tags
    item_type = '笔记'
    if 'PDF' in title or any('PDF' in t for t in tags):
        item_type = 'PDF'
    elif 'Word' in title or any('Word' in t for t in tags):
        item_type = 'Word'
    elif any('工具' in t for t in tags):
        item_type = '工具'
    elif any('案例' in t for t in tags):
        item_type = '案例'
    
    items.append({
        'id': str(val.get('序号', '')),
        't': title,
        'tp': item_type,
        'tg': tags[:5]  # max 5 tags
    })

# Compact JSON (no indent)
os.makedirs(os.path.dirname(DST), exist_ok=True)
js = 'const K=' + json.dumps(items, ensure_ascii=False, separators=(',', ':')) + ';'
with open(DST, 'w', encoding='utf-8') as f:
    f.write(js)

sz = os.path.getsize(DST)
print(f'{len(items)} items -> {sz} bytes ({sz/1024:.0f}KB)')
