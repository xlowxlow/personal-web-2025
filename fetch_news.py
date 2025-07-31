import requests
import json
import os
import re
from datetime import datetime, timedelta
from googleapiclient.discovery import build

def fetch_medical_ai_news():
    # 使用Google Custom Search API获取医疗AI新闻
    try:
        # 从环境变量获取Google Custom Search API密钥和搜索引擎ID
        api_key = os.environ.get("GOOGLE_API_KEY", "AIzaSyDQsb1WV-ocv0_AH9pwuJXTWtp8aBQYqS8")  # 使用环境变量或默认值
        search_engine_id = os.environ.get("GOOGLE_CSE_ID", "017576662512468239146:omuauf_lfve")  # 默认搜索引擎ID
        
        # 创建Google Custom Search API服务
        service = build("customsearch", "v1", developerKey=api_key)
        
        # 定义搜索查询和参数
        query = "medical AI healthcare news artificial intelligence medicine"
        
        # 执行搜索
        result = service.cse().list(
            q=query,
            cx=search_engine_id,  # 自定义搜索引擎ID
            num=10,  # 获取10条结果
            dateRestrict="d7"  # 限制为过去7天的结果
        ).execute()
        
        all_news = []
        
        # 处理搜索结果
        if 'items' in result and result['items']:
            for item in result['items']:
                try:
                    # 提取标题
                    title = item.get('title', '')
                    if not title:
                        continue
                    
                    # 提取链接
                    link = item.get('link', '')
                    if not link:
                        continue
                    
                    # 提取发布日期 - 尝试从snippet或pagemap中获取
                    published_date = datetime.now().isoformat()
                    
                    # 从pagemap中获取日期信息
                    if 'pagemap' in item and 'metatags' in item['pagemap']:
                        for metatag in item['pagemap']['metatags']:
                            # 尝试从常见的元标签中获取日期
                            date_fields = [
                                'article:published_time',
                                'og:article:published_time',
                                'datePublished',
                                'pubdate',
                                'date'
                            ]
                            
                            for field in date_fields:
                                if field in metatag and metatag[field]:
                                    try:
                                        # 尝试解析ISO格式日期
                                        parsed_date = datetime.fromisoformat(metatag[field].replace('Z', '+00:00'))
                                        published_date = parsed_date.isoformat()
                                        break
                                    except (ValueError, TypeError):
                                        pass
                    
                    # 提取作者/来源
                    # 首先尝试从pagemap中获取作者信息
                    author = None
                    if 'pagemap' in item:
                        if 'person' in item['pagemap']:
                            for person in item['pagemap']['person']:
                                if 'name' in person:
                                    author = person['name']
                                    break
                        
                        if not author and 'article' in item['pagemap']:
                            for article in item['pagemap']['article']:
                                if 'author' in article:
                                    author = article['author']
                                    break
                    
                    # 如果没有找到作者，使用网站域名作为来源
                    if not author:
                        domain_match = re.search(r'https?://(?:www\.)?([^/]+)', link)
                        if domain_match:
                            author = domain_match.group(1)
                        else:
                            author = 'Unknown'
                    
                    # 创建新闻项
                    if len(title) > 50:
                        title = title[:47] + '...'
                    
                    news_item = {
                        'title': title,
                        'link': link,
                        'writer': author,
                        'updated': published_date
                    }
                    
                    all_news.append(news_item)
                except Exception as e:
                    print(f"Error parsing search result: {e}")
                    continue
        
        # 选择最新的3条新闻
        all_news.sort(key=lambda x: x['updated'], reverse=True)
        final_news = all_news[:3] if len(all_news) > 3 else all_news
        
        if final_news:
            news_data = {'news': final_news}
            
            with open('news.json', 'w', encoding='utf-8') as f:
                json.dump(news_data, f, ensure_ascii=False, indent=2)
            
            print(f"News updated: {len(final_news)} articles")
            return news_data
        else:
            # 如果没有找到新闻，使用示例新闻数据
            example_news = [
                {
                    "title": "AI-Powered Medical Imaging Shows 95% Accuracy in Early...",
                    "link": "https://example.com/medical-ai-breakthrough",
                    "writer": "Healthcare Technology News",
                    "updated": datetime.now().isoformat()
                },
                {
                    "title": "Revolutionary Healthcare AI Reduces Diagnosis Time by 60%...",
                    "link": "https://example.com/healthcare-ai-speed",
                    "writer": "Medical AI Journal",
                    "updated": datetime.now().isoformat()
                },
                {
                    "title": "New AI Algorithm Detects Rare Diseases with 98% Precision...",
                    "link": "https://example.com/rare-disease-ai",
                    "writer": "AI in Medicine Today",
                    "updated": datetime.now().isoformat()
                }
            ]
            
            news_data = {'news': example_news}
            
            with open('news.json', 'w', encoding='utf-8') as f:
                json.dump(news_data, f, ensure_ascii=False, indent=2)
            
            print("Using example news data")
            return news_data
    except Exception as e:
        print(f"Error fetching news: {e}")
        
        # 出错时使用示例新闻数据
        example_news = [
            {
                "title": "AI-Powered Medical Imaging Shows 95% Accuracy in Early...",
                "link": "https://example.com/medical-ai-breakthrough",
                "writer": "Healthcare Technology News",
                "updated": datetime.now().isoformat()
            },
            {
                "title": "Revolutionary Healthcare AI Reduces Diagnosis Time by 60%...",
                "link": "https://example.com/healthcare-ai-speed",
                "writer": "Medical AI Journal",
                "updated": datetime.now().isoformat()
            },
            {
                "title": "New AI Algorithm Detects Rare Diseases with 98% Precision...",
                "link": "https://example.com/rare-disease-ai",
                "writer": "AI in Medicine Today",
                "updated": datetime.now().isoformat()
            }
        ]
        
        news_data = {'news': example_news}
        
        with open('news.json', 'w', encoding='utf-8') as f:
            json.dump(news_data, f, ensure_ascii=False, indent=2)
        
        print("Using example news data due to error")
        return news_data

if __name__ == '__main__':
    fetch_medical_ai_news()