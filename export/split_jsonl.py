# -*- coding: utf-8 -*-
"""将356条数据拆分为JSONL格式小批次"""
import json
import os

INPUT_FILE = r'C:\Users\Administrator\Desktop\情商宝典项目\miniprogram\export\knowledge_base.json'
OUTPUT_DIR = r'C:\Users\Administrator\Desktop\情商宝典项目\miniprogram\export'

with open(INPUT_FILE, 'r', encoding='utf-8') as f:
    items = json.load(f)

total = len(items)
batch_size = 120

for i in range(0, total, batch_size):
    batch = items[i:i+batch_size]
    filename = f'batch_{i//batch_size + 1}_of_{(total+batch_size-1)//batch_size}.jsonl'
    filepath = os.path.join(OUTPUT_DIR, filename)
    with open(filepath, 'w', encoding='utf-8') as f:
        for item in batch:
            f.write(json.dumps(item, ensure_ascii=False) + '\n')
    print(f'已生成: {filename}，共 {len(batch)} 条')

print(f'共 {3} 个文件')
