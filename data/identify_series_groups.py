import re
import os
from collections import defaultdict

def identify_seasons(filepath):
    print(f"Analyzing: {filepath}")
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Pattern to match exported const declarations and their titles/ids
    # This is a bit rough but should help identify groupings
    const_pattern = re.compile(
        r'export const ([A-Z_0-9]+): Movie = \{(.*?)\n\};',
        re.DOTALL
    )
    
    id_pattern = re.compile(r'"id"\s*:\s*"([^"]+)"')
    title_pattern = re.compile(r'"title"\s*:\s*"([^"]+)"')
    
    groupings = defaultdict(list)
    
    for match in const_pattern.finditer(content):
        const_name = match.group(1)
        body = match.group(2)
        
        id_match = id_pattern.search(body)
        title_match = title_pattern.search(body)
        
        if id_match and title_match:
            item_id = id_match.group(1)
            title = title_match.group(1)
            
            # Try to find a "base name" by stripping " עונה X" or "-sx"
            # Hebrew: "עונה 1", "עונה 2", etc.
            base_title = re.sub(r'\s+עונה\s+\d+.*$', '', title).strip()
            base_id = re.sub(r'(-s\d+|-season\d+|-season-\d+|-?\d+)$', '', item_id).strip()
            
            groupings[base_title].append({
                'const_name': const_name,
                'id': item_id,
                'title': title,
                'base_id': base_id
            })

    # Print interesting groupings (more than 1 item)
    for base_title, items in groupings.items():
        if len(items) > 1:
            print(f"\nGroup: {base_title}")
            for item in items:
                print(f"  - {item['const_name']}: {item['title']} (ID: {item['id']})")

if __name__ == "__main__":
    base_path = "/Users/eyalatiya/Downloads/eyalatiatv (1)/data/"
    identify_seasons(os.path.join(base_path, "series.ts"))
    identify_seasons(os.path.join(base_path, "series 2.ts"))
