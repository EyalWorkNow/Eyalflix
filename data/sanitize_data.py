import re
import os
import json

def sanitize_file(filepath):
    print(f"Sanitizing: {filepath}")
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    new_lines = []
    fixed_count = 0
    
    for line in lines:
        # Match lines like: "key": "value",
        # We look for the first colon-space-quote and the last quote-comma or quote-newline
        match = re.match(r'^(\s*"[^"]+"\s*:\s*)"(.*)"(\s*,?\s*)$', line)
        if match:
            prefix = match.group(1)
            value = match.group(2)
            suffix = match.group(3)
            
            # The value might contain unescaped quotes.
            # We want to escape them, EXCEPT if they are already escaped.
            # But wait, if we have unescaped quotes, how do we know where the value ends?
            # Fortunately, the regex `(.*)` is greedy and will match everything until the LAST quote.
            # This is usually what we want for these corrupted lines.
            
            # First, unescape everything to get the raw string
            # (In case some are already escaped and some are not)
            raw_value = value.replace('\\"', '"').replace('\\\\', '\\')
            
            # Now properly escape it using json.dumps
            safe_value = json.dumps(raw_value, ensure_ascii=False)
            
            # safe_value already includes surrounding quotes
            new_line = f"{prefix}{safe_value}{suffix}\n"
            if new_line != line:
                fixed_count += 1
            new_lines.append(new_line)
        else:
            new_lines.append(line)
            
    if fixed_count > 0:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.writelines(new_lines)
        print(f"  Fixed {fixed_count} lines.")
    else:
        print("  No lines needed fixing.")

if __name__ == "__main__":
    base_path = "/Users/eyalatiya/Downloads/eyalatiatv (1)/data/"
    sanitize_file(os.path.join(base_path, "series.ts"))
    sanitize_file(os.path.join(base_path, "series 2.ts"))
    sanitize_file(os.path.join(base_path, "movies.ts"))
