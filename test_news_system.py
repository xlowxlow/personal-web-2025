#!/usr/bin/env python3
import json
import os
import sys
from datetime import datetime

def test_news_system():
    print("Testing Medical AI News System...")
    print("=" * 50)
    
    # Test 1: Check if news.json exists and is valid
    try:
        with open('news.json', 'r', encoding='utf-8') as f:
            news_data = json.load(f)
        print("✅ news.json file exists and is valid JSON")
        if 'news' in news_data and news_data['news']:
            print(f"   Found {len(news_data['news'])} news items:")
            for i, news in enumerate(news_data['news'][:3], 1):
                print(f"   {i}. {news.get('title', 'N/A')}")
        else:
            print("   No news items found")
    except FileNotFoundError:
        print("❌ news.json file not found")
        return False
    except json.JSONDecodeError:
        print("❌ news.json is not valid JSON")
        return False
    
    # Test 2: Check if fetch_news.py exists
    if os.path.exists('fetch_news.py'):
        print("✅ fetch_news.py script exists")
    else:
        print("❌ fetch_news.py script not found")
        return False
    
    # Test 3: Check if GitHub Actions workflow exists
    workflow_path = '.github/workflows/daily-news-update.yml'
    if os.path.exists(workflow_path):
        print("✅ GitHub Actions workflow file exists")
    else:
        print("❌ GitHub Actions workflow file not found")
        return False
    
    # Test 4: Check if HTML contains news section
    try:
        with open('index.html', 'r', encoding='utf-8') as f:
            html_content = f.read()
        if 'daily-news' in html_content and 'news-title' in html_content:
            print("✅ HTML contains news section")
        else:
            print("❌ HTML missing news section")
            return False
    except FileNotFoundError:
        print("❌ index.html not found")
        return False
    
    # Test 5: Check if JavaScript contains news loading function
    try:
        with open('main.js', 'r', encoding='utf-8') as f:
            js_content = f.read()
        if 'loadDailyNews' in js_content and 'news.json' in js_content:
            print("✅ JavaScript contains news loading function")
        else:
            print("❌ JavaScript missing news loading function")
            return False
    except FileNotFoundError:
        print("❌ main.js not found")
        return False
    
    # Test 6: Check if CSS contains news styling
    try:
        with open('styles.css', 'r', encoding='utf-8') as f:
            css_content = f.read()
        if 'daily-news-section' in css_content and 'chat-bubble' in css_content:
            print("✅ CSS contains news styling")
        else:
            print("❌ CSS missing news styling")
            return False
    except FileNotFoundError:
        print("❌ styles.css not found")
        return False
    
    print("\n" + "=" * 50)
    print("🎉 All tests passed! Medical AI News system is ready.")
    print("\nNext steps:")
    print("1. Set NEWS_API_KEY in GitHub repository secrets")
    print("2. Push code to GitHub to activate daily updates")
    print("3. The system will automatically fetch news at 7 AM London time")
    return True

if __name__ == '__main__':
    success = test_news_system()
    sys.exit(0 if success else 1)