import re
import os

def fix_broken_strings(filepath):
    print(f"Fixing broken strings in: {filepath}")
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Fix the case where a string ends with a backslash that escapes the closing quote
    # Like: "description": "some text \" ,
    # We want to change it to "description": "some text " , or "some text \\" ,
    # Actually, in this case it probably intended to just be a normal quote or no backslash.
    # Looking at the error: "עונה 3 לאנימה \"
    # It seems the backslash was added accidentally.
    
    # This regex looks for a backslash followed by a quote followed by a comma or newline
    fixed_content = re.sub(r'\\"\s*(,|\n)', r'"\1', content)
    
    if fixed_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(fixed_content)
        print("  Fixed broken strings.")
    else:
        print("  No broken strings found.")

if __name__ == "__main__":
    base_path = "/Users/eyalatiya/Downloads/eyalatiatv (1)/data/"
    fix_broken_strings(os.path.join(base_path, "series.ts"))
    fix_broken_strings(os.path.join(base_path, "series 2.ts"))
