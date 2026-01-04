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


def fix_duplicates_in_file(filepath: str):
    """Fix duplicate constant declarations in a TypeScript file."""

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
    const_pattern = re.compile(
        r"(// =+.*?\n)?export const ([A-Z_0-9]+): Movie = \{[^}]*(?:\{[^}]*\}[^}]*)*\};",
        re.DOTALL,
    )

    # Find all matches
    matches = list(const_pattern.finditer(content))

    # Track seen constants and their positions
    seen_constants = OrderedDict()
    duplicates_to_remove = []

    for match in matches:
        const_name = match.group(2)
        if const_name in seen_constants:
            # This is a duplicate - mark for removal
            duplicates_to_remove.append((match.start(), match.end()))
            print(f"Found duplicate: {const_name}")
        else:
            seen_constants[const_name] = match.group(0)

    print(f"\nTotal unique constants: {len(seen_constants)}")
    print(f"Duplicates to remove: {len(duplicates_to_remove)}")

    # Remove duplicates from end to start (to preserve positions)
    new_content = content
    for start, end in reversed(duplicates_to_remove):
        # Also remove any trailing newlines
        while end < len(new_content) and new_content[end] == "\n":
            end += 1
        new_content = new_content[:start] + new_content[end:]

    # Now fix the ALL_MOVIES array to only include unique constants
    all_movies_pattern = re.compile(
        r"export const ALL_MOVIES: Movie\[\] = \[\s*([\s\S]*?)\];",
        re.DOTALL,
    )

    all_movies_match = all_movies_pattern.search(new_content)
    if all_movies_match:
        # Get the array content
        array_content = all_movies_match.group(1)

        # Extract constant names from array
        array_items = re.findall(r"([A-Z_0-9]+)", array_content)

        # Keep only unique items that exist in our seen_constants
        unique_items = []
        seen_in_array = set()
        for item in array_items:
            if item in seen_constants and item not in seen_in_array:
                unique_items.append(item)
                seen_in_array.add(item)

        # Rebuild the array
        new_array = "export const ALL_MOVIES: Movie[] = [\n\n"
        for item in unique_items:
            new_array += f"  {item},\n"
        new_array += "\n];"

        # Replace in content
        new_content = (
            new_content[: all_movies_match.start()]
            + new_array
            + new_content[all_movies_match.end() :]
        )
    else:
        print("Warning: ALL_MOVIES array not found; skipped array cleanup.")

    # Write the fixed content
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(new_content)

    print(f"\nFixed file saved: {filepath}")
    return len(duplicates_to_remove), removed_duration_count


if __name__ == "__main__":
    filepath = "/Users/eyalatiya/Downloads/eyalatiatv (1)/data/movies.ts"

    print(f"Fixing duplicates in: {filepath}")
    print("=" * 50)

    removed_dupes, removed_durations = fix_duplicates_in_file(filepath)

    print("=" * 50)
    print(f"Done! Removed {removed_dupes} duplicate declarations.")
    print(f"Done! Removed {removed_durations} duration lines.")
