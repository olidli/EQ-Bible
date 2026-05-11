# -*- coding: utf-8 -*-
import re
import json

# Read the file
with open(r'C:\Users\Administrator\Desktop\情商宝典项目\miniprogram\data\knowledge.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Find all title values
matches = re.findall(r'"t":\s*"([^"]+)"', content)
print('Sample titles (first 5):')
for m in matches[:5]:
    print(repr(m[:50]))

# Try to decode as GBK
with open(r'C:\Users\Administrator\Desktop\情商宝典项目\miniprogram\data\knowledge.js', 'rb') as f:
    raw = f.read()

# Check position 15-30 where title starts
print('\nRaw bytes around title:', raw[30:80])