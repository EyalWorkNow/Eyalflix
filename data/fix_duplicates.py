#!/usr/bin/env python3
"""
Script to automatically fix duplicate constant declarations in TypeScript files.
This script will:
1. Find all duplicate exported constants in movies.ts
2. Keep only the first occurrence of each constant
3. Clean up the ALL_MOVIES array to only include unique entries
4. Remove duration lines formatted like: "duration": "96 דק׳",
"""

import re
from collections import OrderedDict


def fix_duplicates_in_file(filepath: str, array_name: str):
    """Fix duplicate constant declarations in a TypeScript file."""

    print(f"Processing: {filepath}")
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    # --------------------------------------------------
    # REMOVE duration lines like: "duration": "96 דק׳",
    # --------------------------------------------------
    duration_pattern = re.compile(
        r'^\s*"duration"\s*:\s*"\d+\s*דק׳"\s*,?\s*\n',
        re.MULTILINE,
    )
    content, removed_duration_count = duration_pattern.subn("", content)
    print(f"Removed duration lines: {removed_duration_count}")

    # Pattern to match exported const declarations
    # Captures: the full declaration from 'export const NAME' to the closing '};'
    # Updated to handle potential spacing or leading comments
    const_pattern = re.compile(
        r"(// =+.*?\n)?export const ([A-Z_0-9]+): Movie = \{.*?\n\};",
        re.DOTALL,
    )

    # Track seen IDs and constants
    seen_ids = set()
    cleaned_constants = OrderedDict()
    duplicates_to_remove = []

    # Regex to find the id value within the object
    id_pattern = re.compile(r'"id"\s*:\s*"([^"]+)"')

    for match in const_pattern.finditer(content):
        full_decl = match.group(0)
        const_name = match.group(2)
        
        # Extract the 'id' value from the object body
        id_match = id_pattern.search(full_decl)
        if id_match:
            item_id = id_match.group(1)
            if item_id in seen_ids:
                # Duplicate ID - remove this constant
                duplicates_to_remove.append((match.start(), match.end()))
            else:
                seen_ids.add(item_id)
                cleaned_constants[const_name] = full_decl
        else:
            # No ID found (unlikely for our schema), keep it just in case
            cleaned_constants[const_name] = full_decl

    print(f"Total unique IDs found: {len(seen_ids)}")
    print(f"Duplicates to remove (by ID): {len(duplicates_to_remove)}")

    # Remove duplicates from end to start (to preserve positions)
    new_content = content
    for start, end in reversed(duplicates_to_remove):
        while end < len(new_content) and new_content[end] == "\n":
            end += 1
        new_content = new_content[:start] + new_content[end:]

    # Now fix the array to only include unique constants that actually exist in the file
    array_pattern = re.compile(
        rf"export const {array_name}: Movie\[\] = \[\s*([\s\S]*?)\];",
        re.DOTALL,
    )

    array_match = array_pattern.search(new_content)
    if array_match:
        array_content = array_match.group(1)
        array_items = re.findall(r"([A-Z_0-9]+)", array_content)

        unique_items = []
        seen_in_array = set()
        for item in array_items:
            # Only include if the constant still exists in our cleaned set
            if item in cleaned_constants and item not in seen_in_array:
                unique_items.append(item)
                seen_in_array.add(item)

        new_array = f"export const {array_name}: Movie[] = [\n\n"
        for item in unique_items:
            new_array += f"  {item},\n"
        new_array += "\n];"

        new_content = (
            new_content[: array_match.start()]
            + new_array
            + new_content[array_match.end() :]
        )
    else:
        print(f"Warning: {array_name} array not found; skipped array cleanup.")

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(new_content)

    print(f"Fixed file saved: {filepath}\n")
    return len(duplicates_to_remove), removed_duration_count


if __name__ == "__main__":
    base_path = "/Users/eyalatiya/Downloads/eyalatiatv (1)/data/"
    
    files_to_fix = [
        ("movies.ts", "ALL_MOVIES"),
        ("series.ts", "ALL_SERIES"),
        ("series 2.ts", "ALL_SERIES") # Handling series 2.ts if relevant
    ]

    print("Starting UX Data Cleanup")
    print("=" * 50)

    total_dupes = 0
    total_durations = 0

    import os
    for filename, array_name in files_to_fix:
        filepath = os.path.join(base_path, filename)
        if os.path.exists(filepath):
            dupes, durations = fix_duplicates_in_file(filepath, array_name)
            total_dupes += dupes
            total_durations += durations
        else:
            print(f"Skipping {filename}: File not found.")

    print("=" * 50)
    print(f"Cleanup Complete!")
    print(f"Total Duplicate Declarations Removed: {total_dupes}")
    print(f"Total Duration Lines Removed: {total_durations}")
