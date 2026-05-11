# -*- coding: utf-8 -*-
"""将356条数据拆分为JSON Lines格式小批次，保存为.json文件供云开发导入"""
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
    # 保存为 .json 文件，但内容是 JSON Lines 格式（一行一个对象）
    filename = f'batch_{i//batch_size + 1}_of_{(total+batch_size-1)//batch_size}.json'
    filepath = os.path.join(OUTPUT_DIR, filename)
    with open(filepath, 'w', encoding='utf-8') as f:
        for item in batch:
            f.write(json.dumps(item, ensure_ascii=False) + '\n')
    print(f'已生成: {filename}，共 {len(batch)} 条')

print('共 3 个文件（.json文件，内容为JSON Lines格式）')
