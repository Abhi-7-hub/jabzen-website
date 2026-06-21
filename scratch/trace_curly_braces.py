# Detailed curly brace tracing script
with open("script.js", "r") as f:
    content = f.read()

lines = content.splitlines()
stack = []
in_string = False
string_char = None
in_comment = False
in_block_comment = False

for idx, line in enumerate(lines):
    line_num = idx + 1
    col = 0
    in_comment = False
    
    while col < len(line):
        char = line[col]
        # Block comments
        if not in_string and not in_comment and not in_block_comment and col+1 < len(line) and line[col:col+2] == "/*":
            in_block_comment = True
            col += 2
            continue
        if in_block_comment and col+1 < len(line) and line[col:col+2] == "*/":
            in_block_comment = False
            col += 2
            continue
        if in_block_comment:
            col += 1
            continue
            
        # Line comments
        if not in_string and not in_block_comment and col+1 < len(line) and line[col:col+2] == "//":
            break # comment to end of line
            
        # Strings
        if char in ["'", '"', '`']:
            if not in_string:
                in_string = True
                string_char = char
            elif string_char == char:
                # Check backslash escape
                escaped = False
                back_idx = col - 1
                while back_idx >= 0 and line[back_idx] == "\\":
                    escaped = not escaped
                    back_idx -= 1
                if not escaped:
                    in_string = False
                    string_char = None
                    
        # Check braces
        if not in_string:
            if char == "{":
                stack.append((line_num, col, line.strip()))
            elif char == "}":
                if not stack:
                    print(f"Excess closing brace at Line {line_num}, col {col}: {line.strip()}")
                else:
                    open_line, open_col, open_text = stack.pop()
                    # Print matches of functions or classes to help trace
                    if any(kw in open_text for kw in ["function", "=>", "class"]):
                        # Let's check stack depth
                        pass
        col += 1

print(f"Stack size at end: {len(stack)}")
if stack:
    print("Unclosed braces details:")
    for s in stack:
        print(f"  Line {s[0]}, Col {s[1]}: {s[2]}")
