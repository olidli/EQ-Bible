import re

with open(r'C:\Users\Administrator\Desktop\情商宝典项目\miniprogram\data\knowledge_structured.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Extract K array
match = re.search(r'const K = \[(.*)\];', content, re.DOTALL)
if match:
    json_str = '[' + match.group(1) + ']'
    
    # Find position 51209 and show the exact content around it
    pos = 51209
    start = max(0, pos - 100)
    end = min(len(json_str), pos + 50)
    
    # Get the exact lines
    lines_before = json_str[:pos].split('\n')
    current_line = len(lines_before)
    
    print(f'Error around line {current_line}, char {pos - len(json_str[:pos].rstrip())} in the extracted JSON')
    print('---Around error:')
    print(repr(json_str[start:end]))