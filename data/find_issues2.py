import re

with open(r'C:\Users\Administrator\Desktop\情商宝典项目\miniprogram\data\knowledge_structured.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Find all key_chapters: [ ... ] patterns
# Looking for places where summary is followed by ] instead of }, ]

# Strategy: Find all "summary": "..." lines and check what follows
pattern = r'"summary":\s*"[^"]+"\s*\]'
matches = list(re.finditer(pattern, content))

print(f'Found {len(matches)} places where summary is directly followed by ]')
for m in matches:
    # Get context - 50 chars before and after
    start = max(0, m.start() - 50)
    end = min(len(content), m.end() + 30)
    context = content[start:end]
    # Show line number
    line_num = content[:m.start()].count('\n') + 1
    print(f'Line ~{line_num}: ...{context}...')