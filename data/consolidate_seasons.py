import re
import os
import json
from collections import OrderedDict, defaultdict

def get_balanced_braces(text, start_pos):
    """Finds the matching closing brace for a opening brace at start_pos."""
    braces = 0
    in_string = False
    escape = False
    
    for i in range(start_pos, len(text)):
        char = text[i]
        if escape:
            escape = False
            continue
        if char == '\\':
            escape = True
            continue
        if char == '"':
            in_string = not in_string
            continue
        
        if not in_string:
            if char == '{':
                braces += 1
            elif char == '}':
                braces -= 1
                if braces == 0:
                    return i
    return -1

def consolidate_series(filepath, array_name):
    print(f"Consolidating: {filepath}")
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find constants
    const_pattern = re.compile(r'(// =+.*?\n)?export const ([A-Z_0-9]+): Movie = (\{)', re.DOTALL)
    
    series_list = []
    constants_found = []
    
    for match in const_pattern.finditer(content):
        comment = match.group(1) or ""
        const_name = match.group(2)
        start_brace = match.start(3)
        end_brace = get_balanced_braces(content, start_brace)
        
        if end_brace == -1:
            print(f"  Error: Could not find matching brace for {const_name}")
            continue
            
        body_str = content[start_brace : end_brace + 1]
        constants_found.append({
            'const_name': const_name,
            'body': body_str,
            'comment': comment,
            'full_match_start': match.start(),
            'full_match_end': end_brace + 2 # +2 for };
        })

    # Grouping
    groups = defaultdict(list)
    for c in constants_found:
        # Crude extract of title
        title_match = re.search(r'"title"\s*:\s*"(?:\\.|[^"\\])*"', c['body'])
        if not title_match: continue
        
        title = json.loads(title_match.group(0).split(':', 1)[1].strip())
        
        # Normalize title
        norm_title = re.sub(r'\s+(עונה|Season|S|Part|חלק)\s+\d+.*$', '', title).strip()
        norm_title = re.sub(r'[:\-–—]$', '', norm_title).strip()
        
        groups[norm_title].append({
            'const_name': c['const_name'],
            'body': c['body'],
            'comment': c['comment'],
            'original_title': title
        })

    new_constants = []
    consolidated_count = 0
    final_all_series = []

    for title, items in groups.items():
        if len(items) == 1:
            # Keep as is
            new_constants.append(items[0]['comment'] + f"export const {items[0]['const_name']}: Movie = " + items[0]['body'] + ";")
            final_all_series.append(items[0]['const_name'])
            continue

        print(f"  Merging {len(items)} items for: {title}")
        consolidated_count += 1
        
        # Merge items
        # Sort by estimated season number
        def get_est_num(item):
            m = re.search(r'(עונה|Season|S|Part|חלק)\s+(\d+)', item['original_title'])
            if m: return int(m.group(2))
            return 1
        
        items.sort(key=get_est_num)
        
        base = items[0]
        # We need to extract the fields properly
        def get_val(body, field):
            m = re.search(rf'"{field}"\s*:\s*', body)
            if not m: return None
            start_val = m.end()
            
            char = body[start_val]
            if char == '"':
                # String - handle escapes
                end_str = start_val + 1
                while end_str < len(body):
                    if body[end_str] == '"' and body[end_str-1] != '\\':
                        break
                    if body[end_str] == '"' and body[end_str-1] == '\\' and body[end_str-2] == '\\':
                        # Case of double backslash followed by quote (quote is not escaped)
                        break
                    end_str += 1
                try: 
                    # Use json.loads for string unescaping
                    return json.loads(body[start_val : end_str + 1])
                except: 
                    return body[start_val + 1 : end_str]
            elif char == '[':
                # Array - find matching bracket
                braces = 0
                for i in range(start_val, len(body)):
                    if body[i] == '[': braces += 1
                    elif body[i] == ']':
                        braces -= 1
                        if braces == 0:
                            arr_str = body[start_val : i + 1]
                            # Try to fix trailing commas for json.loads
                            arr_str_fixed = re.sub(r',\s*\]', ']', arr_str)
                            arr_str_fixed = re.sub(r',\s*\}', '}', arr_str_fixed)
                            try: return json.loads(arr_str_fixed)
                            except: return arr_str # Return as string if parsing fails
                return None
            elif char == '{':
                # Object
                end_obj = get_balanced_braces(body, start_val)
                obj_str = body[start_val : end_obj + 1]
                obj_str_fixed = re.sub(r',\s*\]', ']', obj_str)
                obj_str_fixed = re.sub(r',\s*\}', '}', obj_str_fixed)
                try: return json.loads(obj_str_fixed)
                except: return obj_str
            else:
                m2 = re.match(r'[0-9true falsenull\.]+', body[start_val:])
                if m2:
                    val = m2.group(0).strip().rstrip(',')
                    if val == 'true': return True
                    if val == 'false': return False
                    if val == 'null': return None
                    try: return int(val)
                    except: 
                        try: return float(val)
                        except: return val
                return None

        # Build merged object
        all_seasons = []
        seen_season_nums = set()
        
        for idx, item in enumerate(items):
            # Extract seasons list
            seasons_val = get_val(item['body'], "seasons")
            if seasons_val:
                if isinstance(seasons_val, list):
                    for s in seasons_val:
                        num = s.get('number', idx + 1)
                        if num in seen_season_nums:
                            num = (max(seen_season_nums) if seen_season_nums else 0) + 1
                        s['number'] = num
                        seen_season_nums.add(num)
                        all_seasons.append(s)
                elif isinstance(seasons_val, str):
                    # It's a string because json.loads failed.
                    # This happens if it contains complex nested stuff or trailing commas we missed.
                    # We'll try to extract season objects individually.
                    objs = re.findall(r'(\{\s*"id"\s*:\s*".*?"\s*,\s*"number"\s*:\s*\d+.*?\n\s+\})', seasons_val, re.DOTALL)
                    for s_body in objs:
                        # Convert string to dict if possible
                        s_fixed = re.sub(r',\s*\}', '}', s_body)
                        try:
                            s = json.loads(s_fixed)
                            num = s.get('number', idx + 1)
                            if num in seen_season_nums:
                                num = (max(seen_season_nums) if seen_season_nums else 0) + 1
                            s['number'] = num
                            seen_season_nums.add(num)
                            all_seasons.append(s)
                        except: pass

        # Use metadata from the most "complete" item (one with a description or highest season)
        best_item = max(items, key=lambda x: len(get_val(x['body'], "description") or ""))
        
        merged_obj = {
            "id": get_val(best_item['body'], "id"),
            "englishName": get_val(best_item['body'], "englishName"),
            "type": "series",
            "title": title,
            "description": get_val(best_item['body'], "description"),
            "thumbnailUrl": get_val(best_item['body'], "thumbnailUrl"),
            "backdropUrl": get_val(best_item['body'], "backdropUrl"),
            "rating": get_val(best_item['body'], "rating"),
            "matchScore": get_val(best_item['body'], "matchScore") or 95,
            "year": get_val(best_item['body'], "year"),
            "genre": get_val(best_item['body'], "genre") or [],
            "cast": [],
            "seasons": all_seasons
        }
        
        # Write merged constant
        const_name = items[0]['const_name']
        merged_json = json.dumps(merged_obj, indent=2, ensure_ascii=False)
        new_constants.append(items[0]['comment'] + f"export const {const_name}: Movie = {merged_json};")
        final_all_series.append(const_name)

    # Rebuild file
    imports = re.match(r'^(import.*?;\n+)+', content)
    header = imports.group(0) if imports else "import { Movie } from '../types';\n\n"
    
    # Preserve YT helpers
    yt_helpers = re.search(r'(export const YT_TRAILERS[\s\S]*?ytLink = \(id: string\) => `.*?`;\n+)', content)
    if yt_helpers:
        header += yt_helpers.group(1)

    result_content = header + "\n\n".join(new_constants) + "\n\n"
    
    # Final array
    result_content += f"export const {array_name}: Movie[] = [\n"
    for cn in final_all_series:
        result_content += f"  {cn},\n"
    result_content += "];\n"

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(result_content)
    
    print(f"  Done! Merged {consolidated_count} groups.\n")

if __name__ == "__main__":
    base_path = "/Users/eyalatiya/Downloads/eyalatiatv (1)/data/"
    consolidate_series(os.path.join(base_path, "series.ts"), "ALL_SERIES")
    consolidate_series(os.path.join(base_path, "series 2.ts"), "ALL_SERIES")
