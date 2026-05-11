# Test load knowledge_structured.js
import sys
sys.path.insert(0, r'C:\Users\Administrator\Desktop\情商宝典项目\miniprogram\data')

# Simple syntax check
with open(r'C:\Users\Administrator\Desktop\情商宝典项目\miniprogram\data\knowledge_structured.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Extract K array
import re
match = re.search(r'const K = \[(.*)\];', content, re.DOTALL)
if match:
    print(f'Found K array, length: {len(match.group(1))} chars')
    
    # Try to parse as JSON (without the const K = part)
    json_str = '[' + match.group(1) + ']'
    import json
    try:
        data = json.loads(json_str)
        print(f'Success! Parsed {len(data)} articles')
    except json.JSONDecodeError as e:
        print(f'JSON error: {e}')
else:
    print('K array not found')