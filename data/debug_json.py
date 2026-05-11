import re
import json

with open(r'C:\Users\Administrator\Desktop\情商宝典项目\miniprogram\data\knowledge_structured.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Extract K array
match = re.search(r'const K = \[(.*)\];', content, re.DOTALL)
if match:
    json_str = '[' + match.group(1) + ']'
    try:
        data = json.loads(json_str)
        print(f'Success! Parsed {len(data)} articles')
    except json.JSONDecodeError as e:
        print(f'Error at position {e.pos}: {e.msg}')
        # Show context around error position
        start = max(0, e.pos - 100)
        end = min(len(json_str), e.pos + 100)
        print('Context:')
        print(json_str[start:end])
        print('---')
        # Show line number
        lines = json_str[:e.pos].count('\n')
        print(f'Line: {lines + 1}')