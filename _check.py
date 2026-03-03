with open('health.html', 'r', encoding='utf-8') as f:
    content = f.read()

opens = content.count('<div')
closes = content.count('</div')
print(f'Open divs: {opens}, Close divs: {closes}, Diff: {opens - closes}')
print(f'diaryModal found: {"diaryModal" in content}')
print(f'diaryReviewModal found: {"diaryReviewModal" in content}')
print(f'display:flex wrapper: {"display:flex;justify-content:space-between" in content}')

# Find the calendar-section area
idx = content.find('calendar-section')
if idx >= 0:
    line_num = content[:idx].count('\n') + 1
    print(f'calendar-section at line: {line_num}')

# Check around the calendar-and-features closing
idx2 = content.find('calendar-and-features')
if idx2 >= 0:
    line_num2 = content[:idx2].count('\n') + 1
    print(f'calendar-and-features at line: {line_num2}')
