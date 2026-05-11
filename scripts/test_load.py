# -*- coding: utf-8 -*-
import json

with open(r'C:\Users\Administrator\Desktop\情商宝典项目\miniprogram\data\knowledge.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Verify JS format
if 'const K=' in content and 'module.exports={K}' in content:
    print('JS format OK')
    
    # Extract and parse JSON
    start = content.find('[')
    json_str = content[start:content.rfind(']')+1]
    data = json.loads(json_str)
    print(f'JSON items: {len(data)}')
    print(f'First item: {data[0]}')
else:
    print('Invalid JS format')
