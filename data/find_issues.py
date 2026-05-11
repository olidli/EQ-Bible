import re

with open(r'C:\Users\Administrator\Desktop\情商宝典项目\miniprogram\data\knowledge_structured.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Find all key_chapters arrays - look for the pattern: summary "..." followed by ]
# That would be wrong - should be summary "..." }, followed by ]
pattern = r'"summary":\s*"[^"]+"\s*\]'
matches = list(re.finditer(pattern, content))
print(f'Found {len(matches)} places where summary directly ends with ]')

for m in matches[:10]:  # Show first 10
    start = max(0, m.start() - 50)
    end = min(len(content), m.end() + 50)
    print(f'...{content[start:end]}...')
    print('---')