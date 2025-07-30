import requests
import json
import os
from datetime import datetime, timedelta

def fetch_medical_ai_news():
    api_key = os.environ.get('NEWS_API_KEY')
    if not api_key:
        print("Error: NEWS_API_KEY environment variable not set")
        return None
    
    yesterday = (datetime.now() - timedelta(days=1)).strftime('%Y-%m-%d')
    
    url = 'https://newsapi.org/v2/everything'
    params = {
        'q': 'medical AI OR healthcare AI',
        'from': yesterday,
        'sortBy': 'publishedAt',
        'language': 'en',
        'apiKey': api_key,
        'pageSize': 3
    }
    
    try:
        response = requests.get(url, params=params)
        response.raise_for_status()
        data = response.json()
        
        if data['totalResults'] > 0:
            news_list = []
            for article in data['articles'][:3]:
                title = article['title']
                if len(title) > 50:
                    title = title[:47] + '...'
                
                news_item = {
                    'title': title,
                    'link': article['url'],
                    'writer': article['author'] or article['source']['name'],
                    'updated': article['publishedAt']
                }
                news_list.append(news_item)
            
            news_data = {'news': news_list}
            
            with open('news.json', 'w', encoding='utf-8') as f:
                json.dump(news_data, f, ensure_ascii=False, indent=2)
            
            print(f"News updated: {len(news_list)} articles")
            return news_data
        else:
            empty_data = {'news': []}
            
            with open('news.json', 'w', encoding='utf-8') as f:
                json.dump(empty_data, f, ensure_ascii=False, indent=2)
            
            print("No news found for today")
            return empty_data
            
    except requests.exceptions.RequestException as e:
        print(f"Error fetching news: {e}")
        return None
    except Exception as e:
        print(f"Unexpected error: {e}")
        return None

if __name__ == '__main__':
    fetch_medical_ai_news()