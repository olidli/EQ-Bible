# -*- coding: utf-8 -*-
import json

with open(r'C:\Users\Administrator\Desktop\情商宝典项目\miniprogram\data\knowledge.js', 'rb') as f:
    raw = f.read()

text = raw.decode('utf-8')

# Find first title
start = text.find('"t":"') + 5
end = text.find('","', start)
title_bytes = text[start:end].encode('utf-8')

print('Title bytes:', title_bytes.hex())
print('As UTF-8:', title_bytes.decode('utf-8'))

# Try GBK
try:
    print('As GBK:', title_bytes.decode('gbk'))
except:
    print('GBK decode failed')

# Try Latin1
print('As Latin1:', title_bytes.decode('latin-1'))