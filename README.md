# Personal Website with Medical AI News

This is a personal website that displays daily medical AI news updates using Google Custom Search API.

## Features

- Personal portfolio website
- Daily medical AI news updates
- Automated news fetching via GitHub Actions
- Responsive design

## Setup Instructions

### Google Custom Search API Setup

To enable real medical AI news fetching, you need to set up Google Custom Search API:

1. **Create a Google Custom Search Engine:**
   - Go to [Google Custom Search Engine](https://cse.google.com/all)
   - Click "Add" to create a new search engine
   - In "Sites to search", add: `*.com` (or specific medical news sites)
   - Select "Search the entire web but emphasize included sites"
   - Click "Create"
   - Note down your **Search Engine ID** (cx parameter)

2. **Get Google API Key:**
   - Go to [Google Cloud Console](https://console.developers.google.com/)
   - Create a new project or select existing one
   - Enable "Custom Search API"
   - Go to Credentials → Create credentials → API key
   - Note down your **API Key**

3. **Configure GitHub Secrets:**
   - Go to your GitHub repository → Settings → Secrets and variables → Actions
   - Add the following secrets:
     - `GOOGLE_API_KEY`: Your Google API key
     - `GOOGLE_CSE_ID`: Your Custom Search Engine ID

### Local Development

1. **Install dependencies:**
   ```bash
   pip install requests google-api-python-client
   ```

2. **Set environment variables:**
   ```bash
   export GOOGLE_API_KEY="your_api_key_here"
   export GOOGLE_CSE_ID="your_search_engine_id_here"
   ```

3. **Test news fetching:**
   ```bash
   python test_google_search.py
   ```

4. **Start local server:**
   ```bash
   python3 -m http.server 8000
   ```
   Then visit http://localhost:8000

## Files Structure

- `index.html` - Main website page
- `main.js` - JavaScript for website functionality and news display
- `styles.css` - Website styling
- `fetch_news.py` - Python script to fetch medical AI news
- `news.json` - Cached news data
- `.github/workflows/daily-news-update.yml` - GitHub Actions workflow

## How It Works

1. **Automated News Updates:**
   - GitHub Actions runs daily at 23:00 UTC
   - Fetches latest medical AI news using Google Custom Search API
   - Updates `news.json` file
   - Commits changes to repository

2. **News Display:**
   - Website loads news from `news.json`
   - Displays news with animations
   - Shows title, source, and publication time

3. **Fallback System:**
   - If API fails, uses example news data
   - Ensures website always has content to display

## Customization

- Modify search query in `fetch_news.py` to target specific topics
- Adjust news sources by configuring your Custom Search Engine
- Change update frequency in `.github/workflows/daily-news-update.yml`
- Customize website design in `styles.css`

## API Limits

- Google Custom Search API: 100 free queries per day
- Additional queries: $5 per 1000 queries (up to 10k per day)

## Troubleshooting

- **400 Bad Request**: Check if `GOOGLE_CSE_ID` is correctly set
- **403 Forbidden**: Verify API key and enable Custom Search API
- **No news found**: Check search engine configuration and query terms