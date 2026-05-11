import re

with open(r'C:\Users\Administrator\Desktop\情商宝典项目\miniprogram\data\knowledge_structured.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Find all places where "summary": "..." ] appears without closing }
# Pattern: "summary": "...] (should be "summary": "...", })
count = 0

# Use regex to find and replace
def fix_summary(match):
    global count
    text = match.group(0)
    # Replace "summary": "...] with "summary": "...", }
    # The pattern is: "summary": "SOMETHING"]
    # Should be: "summary": "SOMETHING"}, 
    new_text = text.rstrip().rstrip(']') + '"}' + ',\n        }'
    count += 1
    return new_text

# Find pattern: "summary": "..." followed by ] (and potentially whitespace and newlines before ]
# This is where summary text ends and then ] closes the array without } 
pattern = r'"summary":\s*"[^"]+"\s*\]'

new_content = re.sub(pattern, fix_summary, content)

print(f'Fixed {count} places')

with open(r'C:\Users\Administrator\Desktop\情商宝典项目\miniprogram\data\knowledge_structured.js', 'w', encoding='utf-8') as f:
    f.write(new_content)

print('File saved')