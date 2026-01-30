#!/usr/bin/env python3
"""
Convert dictionary JSON files:
Transform trans from string array to object array format
["v. 取消"] -> [{"pos": "v.", "cn": "取消"}]
"""

import json
import re
from pathlib import Path

def convert_trans(trans_list):
    """
    Convert trans from string array to object array format.
    Input: ["v. 取消", "n. 名詞"]
    Output: [{"pos": "v.", "cn": "取消"}, {"pos": "n.", "cn": "名詞"}]
    """
    result = []
    for item in trans_list:
        if isinstance(item, dict):
            # Already in object format
            result.append(item)
        elif isinstance(item, str):
            # String format - try to extract pos and cn
            # Common patterns: "v. 取消" or "n.名詞" or just "取消"
            item = item.strip()
            # Match patterns like "v." "n." "adj." "adv." etc at the beginning
            match = re.match(r'^([a-zA-Z]+\.?)\s*(.*)$', item)
            if match and len(match.group(1)) <= 6:  # Reasonable pos length
                pos = match.group(1)
                cn = match.group(2)
            else:
                pos = ""
                cn = item
            result.append({"pos": pos, "cn": cn})
    return result

def convert_word(word_obj):
    """Convert a single word object."""
    if "trans" in word_obj and isinstance(word_obj["trans"], list):
        word_obj["trans"] = convert_trans(word_obj["trans"])
    return word_obj

def process_file(filepath):
    """Process a single JSON file."""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)

        if isinstance(data, list):
            converted = [convert_word(word) for word in data]
        else:
            converted = convert_word(data)

        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(converted, f, ensure_ascii=False, separators=(',', ':'))

        return True
    except Exception as e:
        print(f"Error processing {filepath}: {e}")
        return False

def main():
    dicts_dir = Path(__file__).parent.parent / "public" / "dicts" / "en" / "word"

    if not dicts_dir.exists():
        print(f"Directory not found: {dicts_dir}")
        return

    json_files = list(dicts_dir.glob("*.json"))
    total = len(json_files)
    success = 0
    failed = 0

    print(f"Found {total} JSON files to process")

    for i, filepath in enumerate(json_files, 1):
        if process_file(filepath):
            success += 1
            if i % 50 == 0:
                print(f"[{i}/{total}] Processed...")
        else:
            failed += 1
            print(f"[{i}/{total}] FAILED: {filepath.name}")

    print(f"\nDone! Success: {success}, Failed: {failed}")

if __name__ == "__main__":
    main()
