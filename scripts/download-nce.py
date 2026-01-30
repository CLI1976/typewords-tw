#!/usr/bin/env python3
"""
Download NCE (New Concept English) data from GitHub and convert to TypeWords format.
Source: https://github.com/luzhenhua/NCE-Flow
"""

import json
import os
import re
import urllib.request
import urllib.parse
from pathlib import Path

# GitHub API and raw content URLs
GITHUB_API = "https://api.github.com/repos/luzhenhua/NCE-Flow/contents"
GITHUB_RAW = "https://raw.githubusercontent.com/luzhenhua/NCE-Flow/main"

# Output directory
OUTPUT_DIR = Path(__file__).parent.parent / "public" / "dicts" / "en" / "article"

def fetch_json(url):
    """Fetch JSON from URL"""
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req) as response:
        return json.loads(response.read().decode('utf-8'))

def fetch_text(url):
    """Fetch text content from URL"""
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req) as response:
        return response.read().decode('utf-8')

def parse_lrc(lrc_content):
    """Parse LRC file content and extract text with translations"""
    lines = []
    for line in lrc_content.strip().split('\n'):
        # Skip metadata lines
        if line.startswith('[al:') or line.startswith('[ar:') or line.startswith('[ti:') or line.startswith('[by:'):
            continue

        # Parse timestamp and text: [00:15.91]English text|Chinese translation
        match = re.match(r'\[(\d+):(\d+\.\d+)\](.+)', line)
        if match:
            minutes = int(match.group(1))
            seconds = float(match.group(2))
            timestamp = minutes * 60 + seconds
            text_part = match.group(3)

            # Split English and Chinese
            if '|' in text_part:
                en_text, cn_text = text_part.split('|', 1)
            else:
                en_text = text_part
                cn_text = ''

            lines.append({
                'timestamp': timestamp,
                'en': en_text.strip(),
                'cn': cn_text.strip()
            })

    return lines

def convert_to_typewords_article(title, lrc_lines, lesson_id):
    """Convert parsed LRC data to TypeWords Article format"""
    # Combine all English text
    text_lines = [line['en'] for line in lrc_lines if line['en']]
    text = '\n'.join(text_lines)

    # Combine all Chinese translations
    translate_lines = [line['cn'] for line in lrc_lines if line['cn']]
    text_translate = '\n'.join(translate_lines)

    # Create article object matching TypeWords Article interface
    article = {
        'id': lesson_id,
        'title': title,
        'titleTranslate': '',  # Could extract from first line if it's a question
        'text': text,
        'textTranslate': text_translate,
        'newWords': [],
        'sections': [],
        'audioSrc': '',
        'audioFileId': '',
        'lrcPosition': [],
        'nameList': [],
        'questions': []
    }

    # Extract title translation if first line is a question
    if lrc_lines and lrc_lines[0]['cn']:
        article['titleTranslate'] = lrc_lines[0]['cn']

    return article

def download_nce_book(book_num):
    """Download all lessons for a specific NCE book"""
    folder_name = f"NCE{book_num}"
    print(f"\nDownloading {folder_name}...")

    # Get file list from GitHub API
    api_url = f"{GITHUB_API}/{folder_name}"
    try:
        files = fetch_json(api_url)
    except Exception as e:
        print(f"  [ERROR] Failed to fetch file list: {e}")
        return []

    # Filter LRC files
    lrc_files = [f for f in files if f['name'].endswith('.lrc')]
    print(f"  Found {len(lrc_files)} lessons")

    articles = []
    for i, file_info in enumerate(lrc_files):
        filename = file_info['name']
        # Extract lesson number and title from filename
        # Format: "01－A Private Conversation.lrc"
        match = re.match(r'(\d+)－(.+)\.lrc', filename)
        if not match:
            # Try alternate format for NCE1: "001&002－Excuse Me.lrc"
            match = re.match(r'(\d+)(?:&\d+)?－(.+)\.lrc', filename)

        if match:
            lesson_num = match.group(1)
            title = match.group(2)
        else:
            lesson_num = str(i + 1)
            title = filename.replace('.lrc', '')

        # Download LRC content
        raw_url = f"{GITHUB_RAW}/{folder_name}/{urllib.parse.quote(filename)}"
        try:
            lrc_content = fetch_text(raw_url)
            lrc_lines = parse_lrc(lrc_content)

            # Convert to article format
            lesson_id = f"nce{book_num}_lesson{lesson_num}"
            article = convert_to_typewords_article(title, lrc_lines, lesson_id)
            articles.append(article)

            print(f"  [OK] Lesson {lesson_num}: {title}")
        except Exception as e:
            print(f"  [ERROR] Failed to download {filename}: {e}")

    return articles

def main():
    """Main function to download all NCE books"""
    print("NCE Data Downloader for TypeWords")
    print("=" * 50)

    # Create output directory
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    print(f"Output directory: {OUTPUT_DIR}")

    # Download each book
    for book_num in [1, 2, 3, 4]:
        articles = download_nce_book(book_num)

        if articles:
            # Save to JSON file
            output_file = OUTPUT_DIR / f"NCE_{book_num}.json"
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump(articles, f, ensure_ascii=False, indent=2)
            print(f"  [SAVED] Saved {len(articles)} articles to {output_file.name}")

    print("\n[DONE] Done!")

if __name__ == "__main__":
    main()
