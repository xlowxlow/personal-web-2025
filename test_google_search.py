import json
from fetch_news import fetch_medical_ai_news

def test_news_scraper():
    print("Testing Medical AI News Scraper implementation...")
    
    # 调用获取新闻的函数
    result = fetch_medical_ai_news()
    
    if result:
        print("\nSuccessfully fetched news:")
        for i, news in enumerate(result['news'], 1):
            print(f"\nNews {i}:")
            print(f"Title: {news['title']}")
            print(f"Link: {news['link']}")
            print(f"Writer: {news['writer']}")
            print(f"Updated: {news['updated']}")
        
        print("\nAlso check news.json file for the saved results.")
    else:
        print("Failed to fetch news. Check the error messages above.")

if __name__ == "__main__":
    test_news_scraper()